from fastapi import APIRouter
from pydantic import BaseModel
from neo4j import GraphDatabase

router = APIRouter()

# Connection (Wahi same credentials jo ETL mein use kiye the)
URI = "neo4j+ssc://921df89f.databases.neo4j.io"
USER = "921df89f"
PASSWORD = "kYYk5APhq9yhGUDiCPMM3GsL1tWclGoginny2EYZjeM"
driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

class ChatRequest(BaseModel):
    message: str
    history: list = []

def run_query(cypher, params={}):
    with driver.session() as session:
        result = session.run(cypher, params)
        return [record.data() for record in result]

@router.post("/chat")
def ai_chat(req: ChatRequest):
    query = req.message.lower()
    response_text = "I am OncoKG Enterprise AI. I couldn't find a direct answer in the graph. Try asking: 'Which drugs target EGFR?'"
    
    # 1. Logic for EGFR Target Query
    if "egfr" in query and "drug" in query:
        cypher = """
        MATCH (d:Drug)-[:TARGETS]->(g:Gene {name: 'EGFR'}) 
        RETURN d.name AS name, d.class AS class
        """
        results = run_query(cypher)
        if results:
            drugs = [r['name'] for r in results]
            response_text = f"The following drugs target EGFR in our Knowledge Graph:\n\n* " + "\n* ".join(drugs)
        else:
            response_text = "No drugs targeting EGFR were found in the graph."

    # 2. Logic for Mutation Search
    elif "mutation" in query:
        cypher = "MATCH (m:Mutation) RETURN m.name AS name LIMIT 5"
        results = run_query(cypher)
        mutations = [r['name'] for r in results]
        response_text = f"Here are some tracked mutations: {', '.join(mutations)}"

    return {"reply": response_text, "graph_context": None}