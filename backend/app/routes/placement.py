from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import os

from ..database import get_db
from ..models import Student
from ..services.placement_service import calculate_placement_score


router = APIRouter(
    prefix="/placement",
    tags=["Placement"]
)

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"


@router.get("/score")
def get_placement_score(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    # Decode JWT token
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        student_id = payload.get("student_id")

        if student_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Find student
    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Calculate placement score
    result = calculate_placement_score(
        cgpa=student.cgpa,
        skills=student.skills,
        resume_score=student.resume_score,
        target_role=student.target_role
    )

    # Save placement score
    student.placement_score = result["score"]

    db.commit()
    db.refresh(student)

    return {
        "student_id": student.id,
        "placement_score": result["score"],
        "placement_level": result["level"],
        "strengths": result["strengths"],
        "suggestions": result["suggestions"]
    }