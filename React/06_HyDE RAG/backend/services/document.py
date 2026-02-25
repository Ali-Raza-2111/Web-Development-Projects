"""
Document-processing helpers: PDF text extraction and text chunking.
"""

from typing import List

import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import CHUNK_SIZE, CHUNK_OVERLAP

# Splits at paragraphs → sentences → words, keeping chunks coherent
_text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
    separators=["\n\n", "\n", ". ", ", ", " ", ""],
    length_function=len,
)


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF using PyMuPDF."""
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text


def chunk_text(text: str) -> List[str]:
    """Split *text* into overlapping chunks using RecursiveCharacterTextSplitter."""
    return _text_splitter.split_text(text)
