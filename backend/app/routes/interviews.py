import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv

from ..database import get_db
from ..models import Student
from ..services.interview_service import generate_interview_questions
from ..services.interview_evaluation_service import evaluate_answer
from ..services.interview_performance_service import calculate_interview_performance


load_dotenv()


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


security = HTTPBearer()


SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    SECRET_KEY = "careergenai-secret-key"

ALGORITHM = "HS256"


class InterviewAnswer(BaseModel):
    question: str
    answer: str


class InterviewPerformance(BaseModel):
    scores: list[int]


def get_student_from_token(
    credentials: HTTPAuthorizationCredentials,
    db: Session
):
    token = credentials.credentials

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

    return student


@router.get("/questions")
def get_interview_questions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    student = get_student_from_token(
        credentials,
        db
    )

    questions = generate_interview_questions(
        student.target_role
    )

    return {
        "student_id": student.id,
        "target_role": student.target_role,
        "questions": questions
    }


@router.post("/evaluate")
def evaluate_interview_answer(
    data: InterviewAnswer,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    student = get_student_from_token(
        credentials,
        db
    )

    result = evaluate_answer(
        question=data.question,
        answer=data.answer
    )

    return {
        "student_id": student.id,
        "question": data.question,
        "answer": data.answer,
        "evaluation": result
    }


@router.post("/performance")
def get_interview_performance(
    data: InterviewPerformance,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    student = get_student_from_token(
        credentials,
        db
    )

    result = calculate_interview_performance(
        scores=data.scores
    )

    student.interview_score = result["overall_score"]

    student.interview_questions_answered = len(
        data.scores
    )

    db.commit()
    db.refresh(student)

    return {
        "student_id": student.id,
        "interview_score": student.interview_score,
        "questions_answered": student.interview_questions_answered,
        "performance": result
    }