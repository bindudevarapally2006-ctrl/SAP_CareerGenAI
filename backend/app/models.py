from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    branch = Column(String(100))

    cgpa = Column(Float)

    target_role = Column(String(100))

    skills = Column(Text)

    resume_text = Column(Text)

    resume_score = Column(Float, default=0)

    placement_score = Column(Float, default=0)

    interview_score = Column(Float, default=0)

    interview_questions_answered = Column(Integer, default=0)