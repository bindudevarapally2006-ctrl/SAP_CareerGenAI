import re


def analyze_resume(text: str):
    """
    Analyze resume and calculate a realistic score out of 100.
    """

    if not text or not text.strip():
        return {
            "score": 0,
            "word_count": 0,
            "strengths": [],
            "suggestions": [
                "Unable to extract readable text from the resume."
            ],
        }

    text = text.strip()
    text_lower = text.lower()

    # Normalize spaces
    text_lower = re.sub(r"\s+", " ", text_lower)

    word_count = len(re.findall(r"\b\w+\b", text))

    score = 0
    strengths = []
    suggestions = []

    # =====================================================
    # 1. CONTACT INFORMATION - 15 POINTS
    # =====================================================

    email_found = bool(
        re.search(
            r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            text
        )
    )

    phone_found = bool(
        re.search(
            r"(?:\+91[\s-]?)?[6-9]\d{9}",
            text
        )
    )

    if email_found:
        score += 8
        strengths.append("Professional email address found")
    else:
        suggestions.append("Add a professional email address")

    if phone_found:
        score += 7
        strengths.append("Phone number found")
    else:
        suggestions.append("Add a valid phone number")

    # =====================================================
    # 2. EDUCATION - 15 POINTS
    # =====================================================

    education_keywords = [
        "education",
        "b.tech",
        "btech",
        "b.e",
        "bachelor",
        "degree",
        "college",
        "university",
        "engineering",
        "computer science",
        "cse"
    ]

    education_found = any(
        keyword in text_lower
        for keyword in education_keywords
    )

    if education_found:
        score += 15
        strengths.append("Education details found")
    else:
        suggestions.append(
            "Add clear education details"
        )

    # =====================================================
    # 3. TECHNICAL SKILLS - 20 POINTS
    # =====================================================

    skill_keywords = [
        "python",
        "java",
        "javascript",
        "typescript",
        "html",
        "css",
        "sql",
        "mysql",
        "flask",
        "fastapi",
        "react",
        "node",
        "git",
        "github",
        "c++",
        "machine learning",
        "artificial intelligence",
        "data analysis",
        "excel"
    ]

    found_skills = [
        skill for skill in skill_keywords
        if skill in text_lower
    ]

    skill_count = len(set(found_skills))

    if skill_count >= 6:
        score += 20
        strengths.append(
            f"{skill_count} relevant technical skills found"
        )

    elif skill_count >= 4:
        score += 15
        strengths.append(
            f"{skill_count} relevant technical skills found"
        )
        suggestions.append(
            "Add a few more role-specific technical skills"
        )

    elif skill_count >= 2:
        score += 10
        strengths.append(
            f"{skill_count} technical skills found"
        )
        suggestions.append(
            "Expand your technical skills section"
        )

    elif skill_count == 1:
        score += 5
        suggestions.append(
            "Add more technical skills"
        )

    else:
        suggestions.append(
            "Add a technical skills section"
        )

    # =====================================================
    # 4. PROJECTS - 15 POINTS
    # =====================================================

    project_keywords = [
        "project",
        "projects",
        "developed",
        "develop",
        "built",
        "implemented",
        "application",
        "website",
        "system"
    ]

    project_found = any(
        keyword in text_lower
        for keyword in project_keywords
    )

    if project_found:
        score += 15
        strengths.append("Project experience found")
    else:
        suggestions.append(
            "Add academic or personal projects"
        )

    # =====================================================
    # 5. EXPERIENCE / INTERNSHIP - 10 POINTS
    # =====================================================

    experience_keywords = [
        "experience",
        "internship",
        "intern",
        "training",
        "employment",
        "work experience"
    ]

    experience_found = any(
        keyword in text_lower
        for keyword in experience_keywords
    )

    if experience_found:
        score += 10
        strengths.append(
            "Experience or internship information found"
        )
    else:
        suggestions.append(
            "Add internship or practical experience"
        )

    # =====================================================
    # 6. CERTIFICATIONS - 5 POINTS
    # =====================================================

    certification_keywords = [
        "certification",
        "certifications",
        "certificate",
        "certificates",
        "certified"
    ]

    certification_found = any(
        keyword in text_lower
        for keyword in certification_keywords
    )

    if certification_found:
        score += 5
        strengths.append("Certifications found")
    else:
        suggestions.append(
            "Add relevant certifications if available"
        )

    # =====================================================
    # 7. RESUME CONTENT QUALITY - 10 POINTS
    # =====================================================

    if word_count >= 500:
        score += 10
        strengths.append(
            "Resume has good content coverage"
        )

    elif word_count >= 350:
        score += 8
        strengths.append(
            "Resume has sufficient content"
        )
        suggestions.append(
            "Add more measurable achievements"
        )

    elif word_count >= 200:
        score += 5
        suggestions.append(
            "Add more relevant details and achievements"
        )

    else:
        score += 2
        suggestions.append(
            "Resume contains limited information"
        )

    # =====================================================
    # 8. ACHIEVEMENTS / LEADERSHIP - 5 POINTS
    # =====================================================

    achievement_keywords = [
        "achievement",
        "achievements",
        "award",
        "awards",
        "leadership",
        "leader",
        "hackathon",
        "competition",
        "winner",
        "volunteer",
        "coordinator"
    ]

    achievement_found = any(
        keyword in text_lower
        for keyword in achievement_keywords
    )

    if achievement_found:
        score += 5
        strengths.append(
            "Achievements or leadership experience found"
        )
    else:
        suggestions.append(
            "Add achievements, leadership, or hackathon experience"
        )

    # =====================================================
    # FINAL SCORE
    # =====================================================

    score = min(score, 100)

    return {
        "score": score,
        "word_count": word_count,
        "strengths": strengths,
        "suggestions": suggestions
    }