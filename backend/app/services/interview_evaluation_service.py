def evaluate_answer(question, answer):
    """
    Evaluate an interview answer using basic keyword matching.
    """

    if not answer or not answer.strip():
        return {
            "score": 0,
            "level": "Poor",
            "feedback": "Please provide an answer."
        }

    answer_lower = answer.lower()

    score = 0

    # Answer length
    word_count = len(answer.split())

    if word_count >= 50:
        score += 30
    elif word_count >= 25:
        score += 20
    elif word_count >= 10:
        score += 10

    # Question-specific keywords
    keywords = []

    question_lower = question.lower()

    if "python" in question_lower:
        keywords = [
            "python",
            "programming",
            "interpreted",
            "dynamic",
            "object-oriented"
        ]

    elif "list and a tuple" in question_lower:
        keywords = [
            "list",
            "tuple",
            "mutable",
            "immutable"
        ]

    elif "dictionary" in question_lower:
        keywords = [
            "key",
            "value",
            "dictionary",
            "mutable"
        ]

    elif "exception" in question_lower:
        keywords = [
            "try",
            "except",
            "exception",
            "error"
        ]

    elif "strengths" in question_lower:
        keywords = [
            "strength",
            "skill",
            "communication",
            "learning",
            "team"
        ]

    elif "why should we hire" in question_lower:
        keywords = [
            "skills",
            "experience",
            "learn",
            "contribute",
            "team"
        ]

    else:
        keywords = [
            "project",
            "skills",
            "experience",
            "learning"
        ]

    matched_keywords = [
        keyword
        for keyword in keywords
        if keyword in answer_lower
    ]

    if len(matched_keywords) >= 3:
        score += 50
    elif len(matched_keywords) >= 2:
        score += 35
    elif len(matched_keywords) >= 1:
        score += 20

    # Clarity
    if "." in answer or "," in answer:
        score += 10

    score = min(score, 100)

    if score >= 80:
        level = "Excellent"
        feedback = "Strong answer with good relevance and detail."
    elif score >= 60:
        level = "Good"
        feedback = "Good answer, but you can add more relevant details."
    elif score >= 40:
        level = "Moderate"
        feedback = "Your answer is relevant, but needs more explanation."
    else:
        level = "Needs Improvement"
        feedback = "Try to provide a clearer and more detailed answer."

    return {
        "score": score,
        "level": level,
        "feedback": feedback,
        "matched_keywords": matched_keywords
    }