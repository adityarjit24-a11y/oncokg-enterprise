from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

# Try to import your existing security module, otherwise use a mock token
try:
    from app.core.security import create_access_token
except ModuleNotFoundError:
    def create_access_token(data: dict):
        return "mock_enterprise_token_12345"

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str = "Researcher"

@router.post("/login")
def login(req: LoginRequest, response: Response):
    # Mocking validation for Phase 1. 
    # Password sirf 4 character se lamba hona chahiye.
    if "@" not in req.email or len(req.password) < 4:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": req.email, "role": req.role})
    
    # CRITICAL FIX: Set httpOnly Cookie for Enterprise Security
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,    # Development ke liye False, Production (HTTPS) mein True
        samesite="lax",
        max_age=1800     # 30 minutes
    )
    
    return {
        "message": "Successfully logged in",
        "user": {"email": req.email, "name": req.email.split('@')[0], "role": req.role}
    }