import re


def analyze_resume(text: str):
    """
    Analyze resume text and generate a basic resume score.
    """

    text_lower = text.lower()

    score = 0
    strengths = []
    suggestions = []

    # 1. Contact information
    if re.search(r"\b[\w.-]+@[\w.-]+\.\w+\b", text):
        score += 10
        strengths.append("Email address found")
    else:
        suggestions.append("Add a professional email address")

    # 2. Phone number
    if re.search(r"\b\d{10}\b", text):
        score += 10
        strengths.append("Phone number found")
    else:
        suggestions.append("Add a phone number")

    # 3. Education
    education_keywords = [
        "education",
        "b.tech",
        "btech",
        "bachelor",
        "degree",
        "college",
        "university"
    ]

    if any(keyword in text_lower for keyword in education_keywords):
        score += 15
        strengths.append("Education details found")
    else:
        suggestions.append("Add clear education details")

    # 4. Skills
    skill_keywords = [
        "skills",
        "python",
        "java",
        "javascript",
        "html",
        "css",
        "sql",
        "flask",
        "fastapi",
        "mysql"
    ]

    found_skills = [
        skill for skill in skill_keywords
        if skill in text_lower
    ]

    if len(found_skills) >= 3:
        score += 20
        strengths.append("Multiple technical skills found")
    elif len(found_skills) > 0:
        score += 10
        suggestions.append("Add more relevant technical skills")
    else:
        suggestions.append("Add a technical skills section")

    # 5. Projects
    project_keywords = [
        "project",
        "projects",
        "developed",
        "built",
        "implemented"
    ]

    if any(keyword in text_lower for keyword in project_keywords):
        score += 15
        strengths.append("Project experience found")
    else:
        suggestions.append("Add academic or personal projects")

    # 6. Experience / internship
    experience_keywords = [
        "experience",
        "internship",
        "intern",
        "worked",
        "training"
    ]

    if any(keyword in text_lower for keyword in experience_keywords):
        score += 15
        strengths.append("Experience or internship information found")
    else:
        suggestions.append("Add internship, training, or practical experience")

    # 7. Certifications
    certification_keywords = [
        "certification",
        "certifications",
        "certificate",
        "certified"
    ]

    if any(keyword in text_lower for keyword in certification_keywords):
        score += 10
        strengths.append("Certifications found")
    else:
        suggestions.append("Add relevant certifications if available")

    # 8. Resume length
    word_count = len(text.split())

    if word_count >= 200:
        score += 5
        strengths.append("Resume contains sufficient information")
    else:
        suggestions.append("Add more relevant information to the resume")

    # Make sure score never exceeds 100
    score = min(score, 100)

    return {
        "score": score,
        "word_count": word_count,
        "strengths": strengths,
        "suggestions": suggestions
    }