import pandas as pd
from neo4j import GraphDatabase
import math

# Connection credentials - APNA PASSWORD YAHAN UPDATE KAREIN!
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "neo4j@1234"  # <-- Apna Neo4j password yahan likho

def load_diseases_and_connections():
    print("Extracting Real Diseases & Phenotypes from existing dataset...")
    
    try:
        # Hum wahi purani file use kar rahe hain!
        df = pd.read_csv('data/relationship.tsv', sep='\t', dtype=str, on_bad_lines='skip')
        
        # 1. Extract Disease Nodes (PharmGKB uses 'Disease' or 'Phenotype')
        dis1 = df[df['Entity1_type'].isin(['Disease', 'Phenotype'])][['Entity1_id', 'Entity1_name']].rename(columns={'Entity1_id': 'id', 'Entity1_name': 'name'})
        dis2 = df[df['Entity2_type'].isin(['Disease', 'Phenotype'])][['Entity2_id', 'Entity2_name']].rename(columns={'Entity2_id': 'id', 'Entity2_name': 'name'})
        
        diseases_df = pd.concat([dis1, dis2]).drop_duplicates(subset=['id']).fillna("")
        diseases_data = diseases_df.to_dict('records')
        print(f"Found {len(diseases_data)} unique Diseases/Phenotypes. Pushing to Neo4j...")

        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        
        node_query = """
        UNWIND $batch AS dis
        MERGE (d:Disease {id: dis.id})
        SET d.name = dis.name,
            d.type = 'Clinical Phenotype',
            d.status = 'Verified'
        """
        
        with driver.session() as session:
            for i in range(0, len(diseases_data), 2000):
                batch = diseases_data[i:i + 2000]
                session.run(node_query, batch=batch)
        print("✅ Disease Nodes Successfully Inserted!")

        # 2. Extract Gene -> Disease Relationships
        print("Connecting Genes to Diseases (Arrows)...")
        mask1 = (df['Entity1_type'] == 'Gene') & (df['Entity2_type'].isin(['Disease', 'Phenotype']))
        rels1 = df[mask1][['Entity1_name', 'Entity2_name']].rename(columns={'Entity1_name': 'gene', 'Entity2_name': 'disease'})
        
        mask2 = (df['Entity1_type'].isin(['Disease', 'Phenotype'])) & (df['Entity2_type'] == 'Gene')
        rels2 = df[mask2][['Entity2_name', 'Entity1_name']].rename(columns={'Entity2_name': 'gene', 'Entity1_name': 'disease'})
        
        rels_df = pd.concat([rels1, rels2]).drop_duplicates().fillna("")
        rels_data = rels_df.to_dict('records')
        
        rel_query = """
        UNWIND $batch AS rel
        MATCH (g:Gene), (d:Disease)
        WHERE toLower(g.name) = toLower(rel.gene) AND toLower(d.name) = toLower(rel.disease)
        MERGE (g)-[:ASSOCIATED_WITH]->(d)
        """
        
        with driver.session() as session:
            for i in range(0, len(rels_data), 2000):
                batch = rels_data[i:i + 2000]
                session.run(rel_query, batch=batch)
        
        driver.close()
        print("✅ Successfully connected Genes to Real Diseases in the Knowledge Graph!")

    except FileNotFoundError:
        print("❌ Error: 'relationship.tsv' not found in data folder.")

if __name__ == "__main__":
    load_diseases_and_connections()