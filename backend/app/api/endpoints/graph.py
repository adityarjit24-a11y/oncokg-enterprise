from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_db_session

router = APIRouter()

def format_graph_data(records):
    """Utility to convert Neo4j records into D3/ForceGraph JSON format."""
    nodes = {}
    links = []
    
    for record in records:
        n, r, m = record.get('n'), record.get('r'), record.get('m')
        
        if n and n.element_id not in nodes:
            nodes[n.element_id] = {"id": n.element_id, "label": n.get("name", n.get("symbol", "Unknown")), "type": list(n.labels)[0] if n.labels else "Unknown", **dict(n)}
        if m and m.element_id not in nodes:
            nodes[m.element_id] = {"id": m.element_id, "label": m.get("name", m.get("symbol", "Unknown")), "type": list(m.labels)[0] if m.labels else "Unknown", **dict(m)}
            
        if r:
            links.append({
                "source": r.nodes[0].element_id,
                "target": r.nodes[1].element_id,
                "type": r.type,
                **dict(r)
            })
            
    return {"nodes": list(nodes.values()), "links": links}

@router.get("/")
def get_full_graph(limit: int = 300, session = Depends(get_db_session)):
    """Fetch the macro knowledge graph topology."""
    query = """
    MATCH (n)-[r]->(m)
    RETURN n, r, m LIMIT $limit
    """
    try:
        result = session.run(query, limit=limit)
        return format_graph_data(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
def search_nodes(q: str, session = Depends(get_db_session)):
    """Global search across multiple entity types."""
    query = """
    MATCH (n)
    WHERE toLower(n.name) CONTAINS toLower($q) OR toLower(n.symbol) CONTAINS toLower($q)
    RETURN n LIMIT 20
    """
    try:
        result = session.run(query, q=q)
        nodes = [{"id": record["n"].element_id, "label": record["n"].get("name", record["n"].get("symbol")), "type": list(record["n"].labels)[0]} for record in result]
        return {"results": nodes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/node/{node_id}")
def get_node_details(node_id: str, session = Depends(get_db_session)):
    """Fetch rich details and immediate neighbors for a specific node."""
    query = """
    MATCH (n)-[r]-(m)
    WHERE elementId(n) = $node_id
    RETURN n, r, m LIMIT 50
    """
    try:
        result = session.run(query, node_id=node_id)
        return format_graph_data(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics")
def get_statistics(session = Depends(get_db_session)):
    """Returns database metrics for the dashboard/analytics."""
    query = """
    CALL db.labels() YIELD label
    MATCH (n) WHERE label IN labels(n)
    WITH label, count(n) AS count
    RETURN collect({label: label, count: count}) AS nodeStats
    """
    try:
        result = session.run(query).single()
        return result["nodeStats"] if result else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))