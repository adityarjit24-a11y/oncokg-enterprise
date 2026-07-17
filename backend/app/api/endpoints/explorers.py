from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_db_session

router = APIRouter()

def fetch_entities(label: str, skip: int, limit: int, search: str, session):
    """Generic Cypher query generator for paginated entity fetching."""
    where_clause = ""
    if search:
        where_clause = f"WHERE toLower(n.name) CONTAINS toLower('{search}') OR toLower(n.id) CONTAINS toLower('{search}')"
    
    query = f"""
    MATCH (n:{label})
    {where_clause}
    RETURN n SKIP $skip LIMIT $limit
    """
    try:
        result = session.run(query, skip=skip, limit=limit)
        nodes = [dict(record["n"]) for record in result]
        
        # Fallback mock data if Neo4j is empty during dev
        if not nodes:
            return generate_mock_data(label)
        return nodes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_entity_by_id(label: str, entity_id: str, session):
    query = f"MATCH (n:{label}) WHERE n.id = $id RETURN n"
    result = session.run(query, id=entity_id).single()
    if not result:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return dict(result["n"])

# --- ENDPOINTS ---

@router.get("/drugs")
def get_drugs(skip: int = 0, limit: int = 50, search: str = "", session = Depends(get_db_session)):
    return fetch_entities("Drug", skip, limit, search, session)

@router.get("/genes")
def get_genes(skip: int = 0, limit: int = 50, search: str = "", session = Depends(get_db_session)):
    return fetch_entities("Gene", skip, limit, search, session)

@router.get("/mutations")
def get_mutations(skip: int = 0, limit: int = 50, search: str = "", session = Depends(get_db_session)):
    return fetch_entities("Mutation", skip, limit, search, session)

@router.get("/trials")
def get_trials(skip: int = 0, limit: int = 50, search: str = "", session = Depends(get_db_session)):
    return fetch_entities("Trial", skip, limit, search, session)

@router.get("/publications")
def get_publications(skip: int = 0, limit: int = 50, search: str = "", session = Depends(get_db_session)):
    return fetch_entities("Publication", skip, limit, search, session)

# --- MOCK DATA GENERATOR (For Seamless UI Testing) ---
def generate_mock_data(label: str):
    if label == "Drug":
        return [
            {"id": "DB00530", "name": "Erlotinib", "class": "Tyrosine Kinase Inhibitor", "status": "FDA Approved", "targets": "EGFR"},
            {"id": "DB09330", "name": "Osimertinib", "class": "Kinase Inhibitor", "status": "FDA Approved", "targets": "EGFR"}
        ]
    elif label == "Gene":
        return [
            {"id": "HGNC:3236", "name": "EGFR", "chromosome": "7p12", "type": "Protein Coding"},
            {"id": "HGNC:6407", "name": "KRAS", "chromosome": "12p12.1", "type": "Protein Coding"}
        ]
    elif label == "Mutation":
        return [
            {"id": "rs121434568", "name": "T790M", "gene": "EGFR", "clinical_significance": "Pathogenic", "drug_resistance": "Erlotinib"},
            {"id": "rs121913529", "name": "G12C", "gene": "KRAS", "clinical_significance": "Pathogenic", "drug_resistance": "None"}
        ]
    elif label == "Trial":
        return [
            {"id": "NCT034560", "title": "Osimertinib in NSCLC", "phase": "Phase 3", "status": "Recruiting", "disease": "NSCLC"},
            {"id": "NCT012345", "title": "Erlotinib Efficacy Trial", "phase": "Phase 4", "status": "Completed", "disease": "Lung Cancer"}
        ]
    elif label == "Publication":
        return [
            {"id": "PMID:25907998", "title": "Osimertinib in EGFR Mutated Lung Cancer", "journal": "NEJM", "year": "2015", "authors": "Jänne PA, et al."},
            {"id": "PMID:15254195", "title": "EGFR Mutations in Lung Cancer", "journal": "Science", "year": "2004", "authors": "Paez JG, et al."}
        ]
    return []