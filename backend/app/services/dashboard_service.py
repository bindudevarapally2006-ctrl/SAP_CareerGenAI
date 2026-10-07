def create_dashboard_summary(
    student,
    placement_result,
    job_recommendations,
    interview_performance
):
    """
    Create a combined dashboard summary for the student.
    """

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "branch": student.branch,
            "cgpa": student.cgpa,
            "target_role": student.target_role,
            "skills": student.skills
        },

        "resume": {
            "uploaded": bool(student.resume_text),
            "resume_score": student.resume_score or 0
        },

        "placement": {
            "placement_score": placement_result.get(
                "score", 0
            ),
            "placement_level": placement_result.get(
                "level", "Needs Improvement"
            ),
            "strengths": placement_result.get(
                "strengths", []
            ),
            "suggestions": placement_result.get(
                "suggestions", []
            )
        },

        "jobs": {
            "total_recommendations": len(
                job_recommendations
            ),
            "recommendations": job_recommendations[:5]
        },

        "interview": {
            "overall_score": interview_performance.get(
                "overall_score", 0
            ),
            "level": interview_performance.get(
                "level", "No Data"
            ),
            "questions_answered": interview_performance.get(
                "questions_answered", 0
            ),
            "strengths": interview_performance.get(
                "strengths", []
            ),
            "suggestions": interview_performance.get(
                "suggestions", []
            )
        }
    }