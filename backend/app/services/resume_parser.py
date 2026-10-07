from pypdf import PdfReader


def extract_resume_text(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        extracted = page.extract_text() or ""
        text += extracted + "\n"

    return text