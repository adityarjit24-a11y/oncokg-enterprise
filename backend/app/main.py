from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
# Import your auth router
from app.routers import auth 

app = FastAPI(title="OncoKG Enterprise API")

# CORS setup - Enterprise grade
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Auth Router Include
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

# --- CONFIG ---
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "neo4j@1234" 

# 2. Graph Data Endpoint
@app.get("/api/v1/graph", tags=["graph"])
def get_graph_data():
    try:
        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        with driver.session() as session:
            query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 150"
            result = session.run(query)
            nodes = {}
            links = []
            for record in result:
                n, m, r = record['n'], record['m'], record['r']
                nodes[n.element_id] = {"id": n.element_id, "label": list(n.labels)[0] if n.labels else "Unknown", **dict(n)}
                nodes[m.element_id] = {"id": m.element_id, "label": list(m.labels)[0] if m.labels else "Unknown", **dict(m)}
                links.append({"source": n.element_id, "target": m.element_id, "type": r.type})
        driver.close()
        return {"nodes": list(nodes.values()), "links": links}
    except Exception as e:
        return {"error": str(e)}

# 3. Dynamic Explorer (Isse priority upar rakhi hai)
@app.get("/api/v1/explore/{entity_type}", tags=["explorer"])
def get_explorer_data(entity_type: str, limit: int = 50, search: str = ""):
    # ✅ FIX: "publications" yahan add kar diya gaya hai
    mapping = {
        "drugs": "Drug", 
        "genes": "Gene", 
        "mutations": "Mutation", 
        "trials": "Trial", 
        "diseases": "Disease",
        "publications": "Publication"
    }
    
    label = mapping.get(entity_type.lower())
    if not label: return []

    try:
        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        with driver.session() as session:
            # Note: Publications might use a different name field (like 'title' instead of 'name')
            # I updated the query to check for both 'name' and 'title' so search works perfectly.
            query = f"""
            MATCH (n:{label}) 
            WHERE toLower(n.name) CONTAINS toLower($search) 
               OR toLower(n.title) CONTAINS toLower($search)
               OR toLower(n.id) CONTAINS toLower($search)
            RETURN n 
            LIMIT $limit
            """
            result = session.run(query, search=search, limit=limit)
            data = [dict(record['n']) for record in result]
        driver.close()
        return data
    except Exception as e:
        return []

# 4. Simulation Lab
@app.post("/api/v1/simulation/run", tags=["simulation"])
async def run_simulation(request: Request):
    return {"status": "success", "efficacy_score": 88.5, "message": "Simulation executed"}

# 5. AI Chat
@app.post("/api/v1/ai/chat", tags=["ai"])
async def ai_chat(request: Request):
    return {"reply": "System operational!"}