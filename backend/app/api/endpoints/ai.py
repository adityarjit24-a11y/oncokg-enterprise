from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/chat")
def ai_chat(req: ChatRequest):
    # Abstracted Layer: Swap this logic out for OpenAI/Gemini SDKs later.
    time.sleep(1) # Simulate network latency
    query = req.message.lower()
    
    response_text = "I am the OncoKG Enterprise AI. I am currently operating in offline simulation mode."
    
    if "egfr" in query or "drug" in query:
        response_text = "Based on the knowledge graph, **EGFR** is targeted by several FDA-approved Tyrosine Kinase Inhibitors (TKIs). \n\n* **Erlotinib**\n* **Osimertinib**\n* **Gefitinib**\n\nResistance is often mediated by the `T790M` mutation."
    elif "simulation" in query or "pathway" in query:
        response_text = "To run a complex pathway analysis, please use the **Simulation Lab** module."
        
    return {"reply": response_text, "graph_context": None}