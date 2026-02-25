"""
GET  /files            – list uploaded files
DELETE /files/{filename} – remove a file and its chunks from the index
"""

import os

from fastapi import APIRouter, HTTPException

from config import UPLOAD_DIR
from services.state import app_state

router = APIRouter()


@router.get("/files")
async def list_files():
    return {"files": app_state.uploaded_file_names}


@router.delete("/files/{filename}")
async def delete_file(filename: str):
    if filename not in app_state.uploaded_file_names:
        raise HTTPException(status_code=404, detail="File not found")

    app_state.uploaded_file_names = [
        f for f in app_state.uploaded_file_names if f != filename
    ]
    app_state.all_documents = [
        d
        for d in app_state.all_documents
        if d.metadata.get("source") != filename
    ]

    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    if app_state.all_documents:
        app_state.rebuild_rag()
    else:
        app_state.reset_rag()

    return {"message": f"'{filename}' deleted successfully"}
