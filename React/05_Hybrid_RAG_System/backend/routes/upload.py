"""
POST /upload – accept PDF / TXT files, extract text, chunk, and rebuild the RAG index.
"""

import os
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from langchain_core.documents import Document

from config import UPLOAD_DIR
from services.document import extract_text_from_pdf, chunk_text
from services.state import app_state

router = APIRouter()


@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    new_documents: List[Document] = []

    for file in files:
        filename = file.filename or "unknown"
        ext = os.path.splitext(filename)[1].lower()

        # ── TXT ──
        if ext == ".txt":
            raw = await file.read()
            text = raw.decode("utf-8", errors="ignore")
            for chunk in chunk_text(text):
                new_documents.append(
                    Document(page_content=chunk, metadata={"source": filename})
                )
            app_state.uploaded_file_names.append(filename)
            continue

        # ── PDF ──
        if ext == ".pdf":
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())

            try:
                text = extract_text_from_pdf(file_path)
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to read PDF '{filename}': {e}",
                )

            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail=f"No extractable text found in '{filename}'.",
                )

            for chunk in chunk_text(text):
                new_documents.append(
                    Document(page_content=chunk, metadata={"source": filename})
                )
            app_state.uploaded_file_names.append(filename)
            continue

        # ── unsupported ──
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: '{filename}'. Only PDF and TXT are accepted.",
        )

    if not new_documents:
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from the uploaded files.",
        )

    app_state.all_documents.extend(new_documents)

    try:
        app_state.rebuild_rag()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to build RAG index: {e}",
        )

    return {
        "message": f"Successfully processed {len(files)} file(s)",
        "total_chunks": len(app_state.all_documents),
        "files": app_state.uploaded_file_names,
    }
