import pandas as pd
from neo4j import GraphDatabase
import math

# Connection credentials - APNA PASSWORD YAHAN UPDATE KAREIN!
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM" 

def load_relationships_to_neo4j():
    print("Loading ClinPGx Relationships to connect Drugs and Genes...")
    
    try:
        df = pd.read_csv('data/relationships.tsv', sep='\t', dtype=str, on_bad_lines='skip')
        
        # Hum un rows ko filter kar rahe hain jahan ek side 'Chemical' (Drug) ho aur doosri side 'Gene' ho
        # Case 1: Entity1 is Chemical, Entity2 is Gene
        mask1 = (df['Entity1_type'] == 'Chemical') & (df['Entity2_type'] == 'Gene')
        rels1 = df[mask1][['Entity1_name', 'Entity2_name']].rename(columns={'Entity1_name': 'drug', 'Entity2_name': 'gene'})
        
        # Case 2: Entity1 is Gene, Entity2 is Chemical
        mask2 = (df['Entity1_type'] == 'Gene') & (df['Entity2_type'] == 'Chemical')
        rels2 = df[mask2][['Entity2_name', 'Entity1_name']].rename(columns={'Entity2_name': 'drug', 'Entity1_name': 'gene'})
        
        # Combine them and remove duplicates
        relationships_df = pd.concat([rels1, rels2]).drop_duplicates()
        relationships_df = relationships_df.fillna("")
        
        rels_data = relationships_df.to_dict('records')
        print(f"Found {len(rels_data)} unique Drug-Gene connections. Pushing arrows to Neo4j...")

        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        
        # Cypher Query to create the connection (Arrow) between existing Drug and Gene nodes
        cypher_query = """
        UNWIND $batch AS rel
        MATCH (d:Drug), (g:Gene)
        WHERE toLower(d.name) = toLower(rel.drug) AND toLower(g.name) = toLower(rel.gene)
        MERGE (d)-[:TARGETS]->(g)
        """

        batch_size = 1000
        with driver.session() as session:
            for i in range(0, len(rels_data), batch_size):
                batch = rels_data[i:i + batch_size]
                session.run(cypher_query, batch=batch)
                print(f"Inserted batch {i//batch_size + 1} / {math.ceil(len(rels_data)/batch_size)}")

        driver.close()
        print("✅ Successfully connected Real Drugs to Real Genes in the Knowledge Graph!")

    except FileNotFoundError:
        print("❌ Error: 'relationship.tsv' not found. Please ensure it is inside the 'backend/data/' folder.")

if __name__ == "__main__":
    load_relationships_to_neo4j()