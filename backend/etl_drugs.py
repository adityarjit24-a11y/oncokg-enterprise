import pandas as pd
from neo4j import GraphDatabase
import math

# Connection credentials - APNA PASSWORD YAHAN UPDATE KARNA MAT BHOOLNA!
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM" 

def load_drugs_to_neo4j():
    print("Loading ClinPGx Relationships dataset into Pandas...")
    
    try:
        df = pd.read_csv('data/relationships.tsv', sep='\t', dtype=str, on_bad_lines='skip')
        
        # THE FIX: PharmGKB categorizes medicines as 'Chemical', not 'Drug'
        drugs_side_1 = df[df['Entity1_type'] == 'Chemical'][['Entity1_id', 'Entity1_name']].rename(columns={'Entity1_id': 'id', 'Entity1_name': 'name'})
        drugs_side_2 = df[df['Entity2_type'] == 'Chemical'][['Entity2_id', 'Entity2_name']].rename(columns={'Entity2_id': 'id', 'Entity2_name': 'name'})
        
        # Combine and remove duplicates
        drugs_df = pd.concat([drugs_side_1, drugs_side_2]).drop_duplicates(subset=['id'])
        drugs_df['class'] = 'Clinical Therapy'
        
        # Clean the data
        drugs_df = drugs_df.fillna("")
        
        drugs_data = drugs_df.to_dict('records')
        print(f"Extracted {len(drugs_data)} unique clinical drugs. Pushing to Neo4j in batches...")

        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        
        cypher_query = """
        UNWIND $batch AS drug
        MERGE (d:Drug {id: drug.id})
        SET d.name = drug.name,
            d.class = drug.class,
            d.status = 'ClinPGx Verified'
        """

        batch_size = 2000
        with driver.session() as session:
            for i in range(0, len(drugs_data), batch_size):
                batch = drugs_data[i:i + batch_size]
                session.run(cypher_query, batch=batch)
                print(f"Inserted batch {i//batch_size + 1} / {math.ceil(len(drugs_data)/batch_size)}")

        driver.close()
        print("✅ Successfully injected real Clinical Drug data into the Knowledge Graph!")

    except FileNotFoundError:
        print("❌ Error: 'relationship.tsv' not found. Please ensure it is inside the 'backend/data/' folder.")

if __name__ == "__main__":
    load_drugs_to_neo4j()