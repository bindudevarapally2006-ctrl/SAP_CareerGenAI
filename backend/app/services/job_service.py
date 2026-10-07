def recommend_jobs(skills, target_role):
    """
    Recommend suitable jobs based on skills and target role.
    """

    jobs = [
        {
            "title": "Python Developer",
            "company": "Tech Solutions",
            "required_skills": ["python", "sql", "fastapi"],
            "location": "Hyderabad"
        },
        {
            "title": "Web Developer",
            "company": "Digital Works",
            "required_skills": ["html", "css", "javascript"],
            "location": "Bangalore"
        },
        {
            "title": "Backend Developer",
            "company": "Code Labs",
            "required_skills": ["python", "fastapi", "sql"],
            "location": "Hyderabad"
        },
        {
            "title": "Frontend Developer",
            "company": "WebTech",
            "required_skills": ["html", "css", "javascript"],
            "location": "Bangalore"
        },
        {
            "title": "Software Developer",
            "company": "Innovate Systems",
            "required_skills": ["python", "java", "sql"],
            "location": "Chennai"
        }
    ]

    student_skills = []

    if skills:
        student_skills = [
            skill.strip().lower()
            for skill in skills.split(",")
            if skill.strip()
        ]

    recommendations = []

    for job in jobs:

        matched_skills = [
            skill
            for skill in job["required_skills"]
            if skill in student_skills
        ]

        skill_match = len(matched_skills)

        role_match = False

        if target_role:
            if target_role.lower() in job["title"].lower():
                role_match = True

        match_score = 0

        if len(job["required_skills"]) > 0:
            match_score += int(
                (skill_match / len(job["required_skills"])) * 70
            )

        if role_match:
            match_score += 30

        if match_score > 0:
            recommendations.append({
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "matched_skills": matched_skills,
                "match_score": match_score
            })

    recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return recommendations