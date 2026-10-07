from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models import Student
from app.services.resume_service import analyze_resume


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    student_id: int = 2,
    db: Session = Depends(get_db)
):
    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Find student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Save uploaded file
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text from PDF
    try:
        import PyPDF2

        text = ""

        with open(file_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not extract PDF text: {str(e)}"
        )

    # Analyze resume
    analysis = analyze_resume(text)

    # Save resume information to database
    student.resume_text = text
    student.resume_score = analysis["score"]

    db.commit()
    db.refresh(student)

    return {
        "message": "Resume analyzed and saved successfully",
        "student_id": student.id,
        "filename": file.filename,
        "text_length": len(text),
        "resume_score": analysis["score"],
        "word_count": analysis["word_count"],
        "strengths": analysis["strengths"],
        "suggestions": analysis["suggestions"]
    }