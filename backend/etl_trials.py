import requests
from neo4j import GraphDatabase

# Connection credentials - APNA PASSWORD YAHAN UPDATE KAREIN!
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM" 

def fetch_and_load_trials():
    print("Fetching Live Clinical Trials from ClinicalTrials.gov API...")
    
    # Hum kuch famous targeted therapies ke trials nikalenge jo hamare graph mein hain
    target_drugs = ["Erlotinib", "Osimertinib", "Imatinib", "Pembrolizumab", "Nivolumab", "Paclitaxel"]
    
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    
    for drug in target_drugs:
        print(f"Querying live data for {drug}...")
        # ClinicalTrials.gov v2 API URL
        url = f"https://clinicaltrials.gov/api/v2/studies?query.intr={drug}&pageSize=10"
        
        try:
            response = requests.get(url)
            data = response.json()
            
            studies = data.get("studies", [])
            print(f"Found {len(studies)} recent trials for {drug}. Pushing to Neo4j...")
            
            for study in studies:
                # API se data extract karna
                protocol = study.get("protocolSection", {})
                identification = protocol.get("identificationModule", {})
                status_module = protocol.get("statusModule", {})
                design = protocol.get("designModule", {})

                nct_id = identification.get("nctId", "UNKNOWN")
                title = identification.get("briefTitle", "No Title")
                status = status_module.get("overallStatus", "UNKNOWN")
                phases = design.get("phases", ["UNKNOWN"])
                phase = phases[0] if phases else "UNKNOWN"

                # Cypher query to create Trial and link it to the Drug
                query = """
                MERGE (t:Trial {id: $nct_id})
                SET t.title = $title, 
                    t.status = $status, 
                    t.phase = $phase,
                    t.name = $nct_id
                WITH t
                MATCH (d:Drug) WHERE toLower(d.name) = toLower($drug)
                MERGE (d)-[:STUDIED_IN]->(t)
                """
                with driver.session() as session:
                    session.run(query, nct_id=nct_id, title=title, status=status, phase=phase, drug=drug)
                    
        except Exception as e:
            print(f"Error fetching data for {drug}: {e}")
            
    driver.close()
    print("✅ Successfully imported live Clinical Trials and connected them to Drugs!")

if __name__ == "__main__":
    fetch_and_load_trials()