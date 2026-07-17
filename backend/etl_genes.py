import pandas as pd
from neo4j import GraphDatabase
import math

# Connection credentials
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"  
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM" 

def load_genes_to_neo4j():
    print("Loading ClinPGx Relationships dataset for GENES...")
    
    try:
        # Read the relationships TSV file
        df = pd.read_csv('data/relationships.tsv', sep='\t', dtype=str, on_bad_lines='skip')
        df.columns = df.columns.str.strip()
        
        # Is baar hum 'Drug' nahi, 'Gene' dhoondh rahe hain!
        genes_side_1 = df[df['Entity1_type'] == 'Gene'][['Entity1_id', 'Entity1_name']].rename(columns={'Entity1_id': 'id', 'Entity1_name': 'name'})
        genes_side_2 = df[df['Entity2_type'] == 'Gene'][['Entity2_id', 'Entity2_name']].rename(columns={'Entity2_id': 'id', 'Entity2_name': 'name'})
        
        # Combine both sides and remove duplicates
        genes_df = pd.concat([genes_side_1, genes_side_2]).drop_duplicates(subset=['id'])
        genes_df['chromosome'] = 'Unknown' # Default value
        genes_df['type'] = 'Protein Coding' # Default value
        
        genes_df = genes_df.fillna("")
        genes_data = genes_df.to_dict('records')
        
        print(f"Extracted {len(genes_data)} unique Genes. Pushing to Neo4j in batches...")

        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        
        cypher_query = """
        UNWIND $batch AS gene
        MERGE (g:Gene {id: gene.id})
        SET g.name = gene.name,
            g.chromosome = gene.chromosome,
            g.type = gene.type
        """

        batch_size = 2000
        with driver.session() as session:
            for i in range(0, len(genes_data), batch_size):
                batch = genes_data[i:i + batch_size]
                session.run(cypher_query, batch=batch)
                print(f"Inserted batch {i//batch_size + 1} / {math.ceil(len(genes_data)/batch_size)}")

        driver.close()
        print("✅ Successfully injected real Gene data into the Knowledge Graph!")

    except FileNotFoundError:
        print("❌ Error: 'relationships.tsv' not found.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    load_genes_to_neo4j()