"""
Resume Parser — extracts text and structured profile from PDF/DOCX files.
"""
import re
from pathlib import Path


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    import fitz  # PyMuPDF

    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def extract_text_from_docx(file_path: str) -> str:
    """Extract all text from a DOCX file using python-docx."""
    from docx import Document

    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    return text.strip()


def extract_text(file_path: str) -> str:
    """Extract text from PDF or DOCX."""
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in (".docx", ".doc"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def extract_email(text: str) -> str:
    """Extract email from text."""
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    return match.group(0) if match else ""


def extract_phone(text: str) -> str:
    """Extract phone number from text."""
    match = re.search(r"[\+]?[\d\s\-\(\)]{7,15}", text)
    return match.group(0).strip() if match else ""


def extract_skills(text: str) -> list[str]:
    """Extract skills from common section headers."""
    skill_keywords = [
        "python", "javascript", "typescript", "react", "node.js", "express",
        "django", "flask", "fastapi", "sql", "postgresql", "mongodb", "redis",
        "docker", "kubernetes", "aws", "azure", "gcp", "git", "linux",
        "html", "css", "tailwind", "next.js", "vue", "angular", "svelte",
        "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin",
        "flutter", "dart", "react native", "tensorflow", "pytorch", "pandas",
        "numpy", "scikit-learn", "machine learning", "deep learning", "nlp",
        "graphql", "rest api", "microservices", "ci/cd", "agile", "scrum",
        "figma", "photoshop", "illustrator", "ui/ux", "ux design",
        ".net", "spring boot", "laravel", "rails", "firebase",
    ]
    text_lower = text.lower()
    found = [skill for skill in skill_keywords if skill in text_lower]
    return list(set(found))


def extract_name(text: str) -> str:
    """Extract name — typically the first non-empty line of a resume."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if lines:
        # First line is usually the name
        candidate = lines[0]
        # Filter out lines that look like headers/emails/phones
        if "@" not in candidate and not re.match(r"^[\d\+\(]", candidate) and len(candidate) < 60:
            return candidate
    return ""


def parse_resume(file_path: str) -> dict:
    """
    Parse a resume file and extract structured profile data.
    Returns a dict with: name, email, phone, skills, raw_text
    """
    text = extract_text(file_path)

    profile = {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "raw_text": text,
    }

    return profile
