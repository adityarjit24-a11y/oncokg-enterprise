import pandas as pd
from neo4j import GraphDatabase

# Connection credentials - APNA PASSWORD YAHAN UPDATE KAREIN!
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM" 

def load_mutations():
    print("Extracting Real Variants/Mutations from PharmGKB dataset...")
    try:
        df = pd.read_csv('data/relationships.tsv', sep='\t', dtype=str, on_bad_lines='skip')

        # 1. PharmGKB TSV se Variants extract karna
        var1 = df[df['Entity1_type'] == 'Variant'][['Entity1_id', 'Entity1_name']].rename(columns={'Entity1_id': 'id', 'Entity1_name': 'name'})
        var2 = df[df['Entity2_type'] == 'Variant'][['Entity2_id', 'Entity2_name']].rename(columns={'Entity2_id': 'id', 'Entity2_name': 'name'})

        mutations_df = pd.concat([var1, var2]).drop_duplicates(subset=['id']).fillna("")
        mutations_df['significance'] = 'Pharmacogenetic Variant'
        mutations_data = mutations_df.to_dict('records')
        
        print(f"Found {len(mutations_data)} unique Mutations. Pushing to Neo4j...")

        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

        # 2. Upload Variants to Neo4j
        node_query = """
        UNWIND $batch AS mut
        MERGE (m:Mutation {id: mut.id})
        SET m.name = mut.name,
            m.dbsnp_id = mut.name,
            m.significance = mut.significance
        """
        with driver.session() as session:
            for i in range(0, len(mutations_data), 2000):
                batch = mutations_data[i:i + 2000]
                session.run(node_query, batch=batch)

        # 3. Connect Variants to Genes
        print("Connecting Mutations to Genes...")
        mask1 = (df['Entity1_type'] == 'Gene') & (df['Entity2_type'] == 'Variant')
        rels1 = df[mask1][['Entity1_name', 'Entity2_name']].rename(columns={'Entity1_name': 'gene', 'Entity2_name': 'mutation'})

        mask2 = (df['Entity1_type'] == 'Variant') & (df['Entity2_type'] == 'Gene')
        rels2 = df[mask2][['Entity2_name', 'Entity1_name']].rename(columns={'Entity2_name': 'gene', 'Entity1_name': 'mutation'})

        rels_df = pd.concat([rels1, rels2]).drop_duplicates().fillna("")
        rels_data = rels_df.to_dict('records')

        rel_query = """
        UNWIND $batch AS rel
        MATCH (g:Gene), (m:Mutation)
        WHERE toLower(g.name) = toLower(rel.gene) AND toLower(m.name) = toLower(rel.mutation)
        MERGE (m)-[:VARIANT_OF]->(g)
        """
        with driver.session() as session:
            for i in range(0, len(rels_data), 2000):
                batch = rels_data[i:i + 2000]
                session.run(rel_query, batch=batch)

        # 4. BONUS: Inject Famous Targeted Oncology Mutations for UI awesomeness
        print("Injecting Actionable Oncology Mutations...")
        famous_mutations = [
            {"id": "rs121434568", "name": "T790M", "gene": "EGFR", "significance": "Drug Resistance (Erlotinib)"},
            {"id": "rs121913465", "name": "L858R", "gene": "EGFR", "significance": "Drug Sensitivity"},
            {"id": "rs114045963", "name": "V600E", "gene": "BRAF", "significance": "Targetable Mutation (Vemurafenib)"},
            {"id": "rs121913529", "name": "G12C", "gene": "KRAS", "significance": "Targetable Mutation (Sotorasib)"},
            {"id": "rs28934571", "name": "R273H", "gene": "TP53", "significance": "Pathogenic Loss of Function"}
        ]
        famous_query = """
        UNWIND $batch AS mut
        MERGE (m:Mutation {id: mut.id})
        SET m.name = mut.name, m.dbsnp_id = mut.id, m.significance = mut.significance
        WITH m, mut
        MATCH (g:Gene) WHERE g.name = mut.gene
        MERGE (m)-[:VARIANT_OF]->(g)
        """
        with driver.session() as session:
            session.run(famous_query, batch=famous_mutations)

        driver.close()
        print("✅ Successfully imported Mutations and connected them to Genes!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    load_mutations()