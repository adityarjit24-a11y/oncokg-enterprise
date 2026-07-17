import pandas as pd
from neo4j import GraphDatabase
import math

# Connection credentials - APNA PASSWORD YAHAN UPDATE KARNA MAT BHOOLNA!
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "neo4j@1234"  # <-- Update this to your Neo4j password

def load_drugs_to_neo4j():
    print("Loading ClinPGx Relationships dataset into Pandas...")
    
    try:
        # Read the relationships TSV file
        df = pd.read_csv('data/relationships.tsv', sep='\t', dtype=str, on_bad_lines='skip')
        
        # This file connects Entity1 to Entity2. We need to extract all unique entities that are 'Drug'
        drugs_side_1 = df[df['Entity1_type'] == 'Drug'][['Entity1_id', 'Entity1_name']].rename(columns={'Entity1_id': 'id', 'Entity1_name': 'name'})
        drugs_side_2 = df[df['Entity2_type'] == 'Drug'][['Entity2_id', 'Entity2_name']].rename(columns={'Entity2_id': 'id', 'Entity2_name': 'name'})
        
        # Combine both sides and remove duplicates to get a clean, unique list of Drugs
        drugs_df = pd.concat([drugs_side_1, drugs_side_2]).drop_duplicates(subset=['id'])
        drugs_df['class'] = 'Clinical Therapy' # Default class
        
        # Clean the data: replace NaN with empty strings
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
        print("❌ Error: 'relationships.tsv' not found. Please ensure it is inside the 'backend/data/' folder.")

if __name__ == "__main__":
    load_drugs_to_neo4j()