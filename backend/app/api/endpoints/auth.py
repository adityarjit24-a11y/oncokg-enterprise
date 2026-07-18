from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.core.security import (
    verify_password, 
    create_access_token, 
    create_refresh_token, 
    verify_and_decode_token
)

router = APIRouter()

@router.post("/login")
def login(
    response: Response,
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Dynamic Expiration based on Remember Me
    refresh_exp = timedelta(days=7) if payload.remember_me else timedelta(hours=12)
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email}, expires_delta=refresh_exp)

    # SECURE COOKIE ATTACHMENT (Fixed for Cross-Origin Vercel -> Railway)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,         # Requires HTTPS in production
        samesite="none",     # YAHAN CHANGE KIYA HAI: 'lax' se 'none' kar diya
        max_age=int(refresh_exp.total_seconds())
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id, 
            "email": user.email, 
            "role": user.role,
            "name": "Dr. Researcher" # FIX: Default name add kar diya undefined hatane ke liye
        }
    }

@router.post("/refresh")
def refresh_session(
    response: Response,
    refresh_token: str = Cookie(None),
    db: Session = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    # Validate refresh token and extract user logic here
    user_email = verify_and_decode_token(refresh_token) 
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.email == user_email).first()
    
    new_access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": new_access_token}

@router.post("/logout")
def logout(response: Response):
    # FIX: Logout mein bhi samesite="none" hona zaroori hai
    response.delete_cookie(key="refresh_token", httponly=True, secure=True, samesite="none")
    return {"message": "Session securely terminated"}