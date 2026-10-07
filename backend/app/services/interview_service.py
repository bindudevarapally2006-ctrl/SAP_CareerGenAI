def generate_interview_questions(target_role):
    """
    Generate basic interview questions based on the student's target role.
    """

    role = (target_role or "").lower()

    questions = []

    # Common HR questions
    questions.extend([
        {
            "question": "Tell me about yourself.",
            "category": "HR"
        },
        {
            "question": "What are your strengths and weaknesses?",
            "category": "HR"
        },
        {
            "question": "Why should we hire you?",
            "category": "HR"
        }
    ])

    # Role-specific questions
    if "python" in role:
        questions.extend([
            {
                "question": "What are the main features of Python?",
                "category": "Technical"
            },
            {
                "question": "What is the difference between a list and a tuple in Python?",
                "category": "Technical"
            },
            {
                "question": "What is a dictionary in Python?",
                "category": "Technical"
            },
            {
                "question": "What is exception handling in Python?",
                "category": "Technical"
            }
        ])

    elif "web" in role or "frontend" in role:
        questions.extend([
            {
                "question": "What is the difference between HTML and CSS?",
                "category": "Technical"
            },
            {
                "question": "What is JavaScript used for?",
                "category": "Technical"
            },
            {
                "question": "What is the difference between frontend and backend development?",
                "category": "Technical"
            }
        ])

    elif "backend" in role:
        questions.extend([
            {
                "question": "What is an API?",
                "category": "Technical"
            },
            {
                "question": "What is REST API?",
                "category": "Technical"
            },
            {
                "question": "What is the difference between SQL and NoSQL databases?",
                "category": "Technical"
            }
        ])

    else:
        questions.extend([
            {
                "question": "What technical skills do you have?",
                "category": "Technical"
            },
            {
                "question": "Explain one of your projects.",
                "category": "Technical"
            },
            {
                "question": "What technologies are you currently learning?",
                "category": "Technical"
            }
        ])

    return questions