from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from app.core.security import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str = "Researcher"

@router.post("/login")
def login(req: LoginRequest, response: Response):
    # Mocking DB validation for phase 4. In prod, check Neo4j/Postgres.
    if "@" not in req.email or len(req.password) < 4:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": req.email, "role": req.role})
    
    # CRITICAL FIX: Set httpOnly Cookie for Enterprise Security
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,    # Set to True when you deploy with HTTPS
        samesite="lax",
        max_age=1800     # 30 minutes
    )
    
    # We return the user data for the UI, but the token stays hidden in the cookie!
    return {
        "message": "Successfully logged in",
        "user": {"email": req.email, "name": req.email.split('@')[0], "role": req.role}
    }