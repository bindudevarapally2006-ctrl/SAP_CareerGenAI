from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    target_role: Optional[str] = None
    skills: Optional[str] = None


class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    target_role: Optional[str] = None
    skills: Optional[str] = None
    resume_score: float = 0
    placement_score: float = 0

    class Config:
        from_attributes = True


class StudentLogin(BaseModel):
    email: EmailStr
    password: str