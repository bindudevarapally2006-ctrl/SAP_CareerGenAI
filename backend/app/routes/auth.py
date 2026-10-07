from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt

from ..database import get_db
from ..models import Student
from ..schemas import StudentCreate, StudentResponse, StudentLogin
from ..services.auth_service import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )
    return hashed.decode("utf-8")


@router.post("/register", response_model=StudentResponse)
def register_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    existing_student = (
        db.query(Student)
        .filter(Student.email == student.email)
        .first()
    )

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(student.password)

    new_student = Student(
        name=student.name,
        email=student.email,
        password=hashed_password,
        branch=student.branch,
        cgpa=student.cgpa,
        target_role=student.target_role,
        skills=student.skills
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


@router.post("/login")
def login_student(
    student: StudentLogin,
    db: Session = Depends(get_db)
):
    existing_student = (
        db.query(Student)
        .filter(Student.email == student.email)
        .first()
    )

    if not existing_student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_valid = bcrypt.checkpw(
        student.password.encode("utf-8"),
        existing_student.password.encode("utf-8")
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(existing_student.id)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "student_id": existing_student.id,
        "name": existing_student.name,
        "email": existing_student.email
    }