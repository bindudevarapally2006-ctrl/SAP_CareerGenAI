def calculate_placement_score(
    cgpa,
    skills,
    resume_score,
    target_role
):
    """
    Calculate a basic placement readiness score.
    """

    score = 0
    strengths = []
    suggestions = []

    # 1. CGPA - 30 points
    if cgpa is not None:
        if cgpa >= 9:
            score += 30
            strengths.append("Excellent academic performance")
        elif cgpa >= 8:
            score += 25
            strengths.append("Good academic performance")
        elif cgpa >= 7:
            score += 20
            strengths.append("Satisfactory academic performance")
        elif cgpa >= 6:
            score += 15
            suggestions.append("Try to improve your academic performance")
        else:
            score += 10
            suggestions.append("Focus on improving your CGPA")
    else:
        suggestions.append("Add your CGPA")

    # 2. Resume - 30 points
    if resume_score is not None:
        if resume_score >= 90:
            score += 30
            strengths.append("Strong resume")
        elif resume_score >= 75:
            score += 25
            strengths.append("Good resume")
        elif resume_score >= 60:
            score += 20
            suggestions.append("Improve your resume")
        else:
            score += 10
            suggestions.append("Significantly improve your resume")
    else:
        suggestions.append("Upload and analyze your resume")

    # 3. Skills - 25 points
    if skills:
        skill_list = [
            skill.strip()
            for skill in skills.split(",")
            if skill.strip()
        ]

        skill_count = len(skill_list)

        if skill_count >= 6:
            score += 25
            strengths.append("Strong technical skill set")
        elif skill_count >= 4:
            score += 20
            strengths.append("Good technical skill set")
        elif skill_count >= 2:
            score += 15
            suggestions.append("Learn more relevant technical skills")
        else:
            score += 10
            suggestions.append("Add more technical skills")
    else:
        suggestions.append("Add your technical skills")

    # 4. Target role - 15 points
    if target_role:
        score += 15
        strengths.append("Career target role is defined")
    else:
        suggestions.append("Define your target career role")

    # Maximum score = 100
    score = min(score, 100)

    # Placement level
    if score >= 85:
        level = "Excellent"
    elif score >= 70:
        level = "Good"
    elif score >= 50:
        level = "Moderate"
    else:
        level = "Needs Improvement"

    return {
        "score": score,
        "level": level,
        "strengths": strengths,
        "suggestions": suggestions
    }