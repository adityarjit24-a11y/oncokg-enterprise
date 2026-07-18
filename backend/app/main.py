import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from neo4j import GraphDatabase

# 1. DATABASE IMPORTS (Yahan add kiya hai)
from app.db.database import engine, Base
from app.models.user import User

# Auth router import
from app.api.endpoints import auth

app = FastAPI(title="OncoKG Enterprise API")

# 2. AUTO-CREATE TABLES (Yeh line tumhare CORS error ko jad se khatam karegi)
Base.metadata.create_all(bind=engine)

# STRICT CORS POLICY (Production-ready lockdown)
origins = [
    "https://oncokg-enterprise.vercel.app", # YEH TUMHARA PRODUCTION FRONTEND HAI
    "http://localhost:3000",                # Agar local dev React use karte ho
    "http://localhost:5173"                 # Agar local dev Vite use karte ho
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"], 
)

# Auth Router Include
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])


# Neo4j Graph Database Credentials Load karo
URI = os.getenv("NEO4J_URI")
USER = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")

if not URI:
    print("WARNING: NEO4J_URI not found in environment variables!")

# Graph Data Endpoint
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

# Dynamic Explorer 
@app.get("/api/v1/explore/{entity_type}", tags=["explorer"])
def get_explorer_data(entity_type: str, limit: int = 50, search: str = ""):
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

# Simulation Lab
@app.post("/api/v1/simulation/run", tags=["simulation"])
async def run_simulation(request: Request):
    return {"status": "success", "efficacy_score": 88.5, "message": "Simulation executed"}

# AI Chat
@app.post("/api/v1/ai/chat", tags=["ai"])
async def ai_chat(request: Request):
    return {"reply": "System operational!"}

# Legacy Graph Redirect
@app.get("/graph")
async def legacy_graph_redirect():
    return RedirectResponse(url="/api/v1/graph")