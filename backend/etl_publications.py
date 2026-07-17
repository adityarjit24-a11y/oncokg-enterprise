import requests
from neo4j import GraphDatabase

# Connection credentials - APNA PASSWORD YAHAN UPDATE KAREIN!
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "neo4j@1234"  # <-- Apna Neo4j password yahan likho

def fetch_publications():
    print("Fetching Live Research Papers from PubMed (NCBI)...")
    
    # Hum in drugs ke latest research papers nikalenge
    target_drugs = ["Erlotinib", "Osimertinib", "Pembrolizumab", "Nivolumab", "Sotorasib"]
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

    for drug in target_drugs:
        print(f"Querying PubMed API for {drug}...")
        
        # PubMed E-utilities API URL (Pehle IDs fetch karenge)
        search_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={drug}+oncology&retmode=json&retmax=10"
        
        try:
            res = requests.get(search_url)
            data = res.json()
            id_list = data.get("esearchresult", {}).get("idlist", [])
            
            if not id_list:
                print(f"No publications found for {drug}.")
                continue
                
            print(f"Found {len(id_list)} papers for {drug}. Downloading metadata...")
            
            # Un IDs ki details (Title, Journal, Date) fetch karenge
            ids_str = ",".join(id_list)
            summary_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={ids_str}&retmode=json"
            
            sum_res = requests.get(summary_url)
            sum_data = sum_res.json().get("result", {})
            
            for pmid in id_list:
                pub_info = sum_data.get(pmid, {})
                title = pub_info.get("title", "No Title Available")
                journal = pub_info.get("source", "Unknown Journal")
                pubdate = pub_info.get("pubdate", "Unknown Date")
                
                # Cypher query to create Publication node and connect it
                query = """
                MERGE (p:Publication {id: $pmid})
                SET p.name = 'PMID: ' + $pmid,
                    p.title = $title,
                    p.journal = $journal,
                    p.year = $pubdate,
                    p.status = 'PubMed Indexed'
                WITH p
                MATCH (d:Drug) WHERE toLower(d.name) = toLower($drug)
                MERGE (d)-[:MENTIONED_IN]->(p)
                """
                with driver.session() as session:
                    session.run(query, pmid=pmid, title=title, journal=journal, pubdate=pubdate, drug=drug)
                    
        except Exception as e:
            print(f"Error fetching PubMed data for {drug}: {e}")

    driver.close()
    print("✅ Successfully imported real PubMed Publications and connected them to the Graph!")

if __name__ == "__main__":
    fetch_publications()