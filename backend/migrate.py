import sqlite3

conn = sqlite3.connect("careergenai.db")
cursor = conn.cursor()

try:
    cursor.execute(
        "ALTER TABLE students ADD COLUMN interview_questions_answered INTEGER DEFAULT 0"
    )
    print("Interview questions answered column added successfully.")

except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Interview questions answered column already exists.")
    else:
        print("Database update failed:")
        print(e)

conn.commit()
conn.close()

print("Database migration completed.")