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

    # 🚀 CTO OVERRIDE: Auto-Promote User to Admin permanently in Database
    if user.role != "Admin":
        user.role = "Admin"
        db.commit()
        db.refresh(user)

    # Dynamic Expiration based on Remember Me
    refresh_exp = timedelta(days=7) if payload.remember_me else timedelta(hours=12)
    
    # Ab is token mein hamesha "Admin" role jayega
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email}, expires_delta=refresh_exp)

    # SECURE COOKIE ATTACHMENT
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,        # Requires HTTPS in production
        samesite="none",    # Cross-Origin allowed
        max_age=int(refresh_exp.total_seconds())
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id, 
            "email": user.email, 
            "role": user.role,  # Ab UI ko "Admin" milega
            "name": "Admin"     # FIX: Name bhi update kar diya for better UI feel
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
    
    # 1. Token decode kiya
    token_data = verify_and_decode_token(refresh_token) 
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # 2. YAHAN HAI ASLI FIX: Dictionary mein se sirf email string nikali
    # Agar token_data dictionary hai toh usme se "sub" nikal lo
    user_email = token_data.get("sub") if isinstance(token_data, dict) else token_data

    # 3. Ab SQL query ko sirf string milegi, dict nahi!
    user = db.query(User).filter(User.email == user_email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found in database")
    
    new_access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": new_access_token}

@router.post("/logout")
def logout(response: Response):
    # FIX: Logout mein bhi samesite="none" hona zaroori hai
    response.delete_cookie(key="refresh_token", httponly=True, secure=True, samesite="none")
    return {"message": "Session securely terminated"}