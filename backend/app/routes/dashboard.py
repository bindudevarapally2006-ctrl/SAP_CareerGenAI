from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from ..database import get_db
from ..models import Student

from ..services.placement_service import calculate_placement_score
from ..services.job_service import recommend_jobs
from ..services.dashboard_service import create_dashboard_summary


# Load environment variables from .env
load_dotenv()


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ==========================================
# JWT SECURITY
# ==========================================

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"


# ==========================================
# GET DASHBOARD SUMMARY
# ==========================================

@router.get("/summary")
def get_dashboard_summary(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # GET TOKEN
    # --------------------------------------

    token = credentials.credentials


    # --------------------------------------
    # CHECK SECRET KEY
    # --------------------------------------

    if not SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="JWT secret key is not configured"
        )


    # --------------------------------------
    # DECODE JWT TOKEN
    # --------------------------------------

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
                detail="Invalid token: student ID missing"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    # --------------------------------------
    # FIND STUDENT
    # --------------------------------------

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


    # ======================================
    # PLACEMENT SCORE
    # ======================================

    placement_result = calculate_placement_score(
        cgpa=student.cgpa,
        skills=student.skills,
        resume_score=student.resume_score,
        target_role=student.target_role
    )


    # ======================================
    # JOB RECOMMENDATIONS
    # ======================================

    job_recommendations = recommend_jobs(
        skills=student.skills,
        target_role=student.target_role
    )


    # ======================================
    # INTERVIEW PERFORMANCE
    # ======================================

    interview_score = student.interview_score or 0

    questions_answered = (
        student.interview_questions_answered or 0
    )


    # --------------------------------------
    # DETERMINE INTERVIEW LEVEL
    # --------------------------------------

    if interview_score == 0:

        interview_level = "No Data"

        interview_strengths = []

        interview_suggestions = [
            "Complete an interview practice session"
        ]


    elif interview_score >= 85:

        interview_level = "Excellent"

        interview_strengths = [
            "Excellent overall interview performance"
        ]

        interview_suggestions = []


    elif interview_score >= 70:

        interview_level = "Good"

        interview_strengths = [
            "Good overall interview performance"
        ]

        interview_suggestions = [
            "Practice more questions for better preparation"
        ]


    elif interview_score >= 50:

        interview_level = "Moderate"

        interview_strengths = []

        interview_suggestions = [
            "Practice more interview questions"
        ]


    else:

        interview_level = "Needs Improvement"

        interview_strengths = []

        interview_suggestions = [
            "Improve your interview preparation"
        ]


    # ======================================
    # INTERVIEW PERFORMANCE OBJECT
    # ======================================

    interview_performance = {

        "overall_score": interview_score,

        "level": interview_level,

        "questions_answered": questions_answered,

        "strengths": interview_strengths,

        "suggestions": interview_suggestions
    }


    # ======================================
    # CREATE DASHBOARD SUMMARY
    # ======================================

    dashboard = create_dashboard_summary(

        student=student,

        placement_result=placement_result,

        job_recommendations=job_recommendations,

        interview_performance=interview_performance

    )


    # ======================================
    # RETURN DASHBOARD
    # ======================================

    return dashboard