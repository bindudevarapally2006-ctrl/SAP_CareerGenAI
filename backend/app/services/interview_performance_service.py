def calculate_interview_performance(scores):
    """
    Calculate overall interview performance from individual answer scores.
    """

    if not scores:
        return {
            "overall_score": 0,
            "level": "No Data",
            "strengths": [],
            "suggestions": [
                "Complete at least one interview question"
            ]
        }

    # Calculate average score
    overall_score = round(sum(scores) / len(scores))

    strengths = []
    suggestions = []

    # Performance level
    if overall_score >= 85:
        level = "Excellent"
        strengths.append("Excellent overall interview performance")
    elif overall_score >= 70:
        level = "Good"
        strengths.append("Good overall interview performance")
    elif overall_score >= 50:
        level = "Moderate"
        suggestions.append("Practice more interview questions")
    else:
        level = "Needs Improvement"
        suggestions.append("Improve your interview preparation")

    # Analyze individual scores
    high_scores = [
        score for score in scores
        if score >= 80
    ]

    low_scores = [
        score for score in scores
        if score < 60
    ]

    if high_scores:
        strengths.append(
            "Good performance in several interview answers"
        )

    if low_scores:
        suggestions.append(
            "Improve answers that received low scores"
        )

    if len(scores) >= 5:
        strengths.append(
            "Completed a comprehensive interview practice session"
        )
    else:
        suggestions.append(
            "Practice more questions for better preparation"
        )

    return {
        "overall_score": overall_score,
        "level": level,
        "questions_answered": len(scores),
        "strengths": strengths,
        "suggestions": suggestions
    }