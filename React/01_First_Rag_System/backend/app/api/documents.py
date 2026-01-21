"""
Documents API Routes
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
import uuid
import os
import shutil
from datetime import datetime

from app.models import DocumentResponse
from app.api.deps import get_rag_agent, get_documents_store
from app.core.agent import RAGAgent
from app.config import get_settings

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    rag_agent: RAGAgent = Depends(get_rag_agent),
    documents_store: dict = Depends(get_documents_store)
):
    """
    Upload a document to the knowledge base
    """
    try:
        settings = get_settings()
        
        # Generate unique ID
        doc_id = str(uuid.uuid4())
        
        # Get file extension
        file_ext = file.filename.split(".")[-1].upper() if "." in file.filename else "TXT"
        
        # Save file
        file_path = os.path.join(settings.UPLOAD_DIR, f"{doc_id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Process document and add to ChromaDB
        await rag_agent.add_document(file_path, file.filename)
        
        # Store metadata
        doc_metadata = {
            "id": doc_id,
            "filename": file.filename,
            "status": "success",
            "upload_date": datetime.now().isoformat(),
            "size": file_size,
            "type": file_ext,
            "path": file_path
        }
        documents_store[doc_id] = doc_metadata
        
        return DocumentResponse(**doc_metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    documents_store: dict = Depends(get_documents_store)
):
    """
    List all uploaded documents
    """
    return [DocumentResponse(**doc) for doc in documents_store.values()]


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    rag_agent: RAGAgent = Depends(get_rag_agent),
    documents_store: dict = Depends(get_documents_store)
):
    """
    Delete a document from the knowledge base
    """
    if doc_id not in documents_store:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        doc = documents_store[doc_id]
        
        # Remove from ChromaDB
        await rag_agent.remove_document(doc["filename"])
        
        # Remove file
        if os.path.exists(doc["path"]):
            os.remove(doc["path"])
        
        # Remove from store
        del documents_store[doc_id]
        
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/view/{filename:path}")
async def view_document(
    filename: str,
    highlight: str = None,
    documents_store: dict = Depends(get_documents_store)
):
    """
    Get document content for viewing with optional highlight text.
    Returns the document content and metadata for the source viewer.
    """
    # Find document by filename
    doc_info = None
    for doc in documents_store.values():
        if doc["filename"] == filename:
            doc_info = doc
            break
    
    if not doc_info:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        file_path = doc_info["path"]
        
        # Read document content based on type
        if file_path.lower().endswith('.pdf'):
            # For PDFs, extract text
            from langchain_community.document_loaders import PyPDFLoader
            loader = PyPDFLoader(file_path)
            pages = loader.load()
            
            content = []
            for i, page in enumerate(pages):
                page_content = {
                    "page": i + 1,
                    "text": page.page_content,
                    "has_highlight": False,
                    "highlight_start": -1,
                    "highlight_end": -1
                }
                
                # Check if this page contains the highlight text
                if highlight:
                    idx = page.page_content.find(highlight[:100])  # Use first 100 chars for matching
                    if idx != -1:
                        page_content["has_highlight"] = True
                        page_content["highlight_start"] = idx
                        page_content["highlight_end"] = idx + len(highlight)
                
                content.append(page_content)
            
            return {
                "filename": filename,
                "type": "pdf",
                "pages": content,
                "total_pages": len(pages),
                "highlight_text": highlight
            }
        else:
            # For text files
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            highlight_start = -1
            highlight_end = -1
            if highlight:
                idx = text.find(highlight[:100])
                if idx != -1:
                    highlight_start = idx
                    highlight_end = idx + len(highlight)
            
            return {
                "filename": filename,
                "type": "text",
                "content": text,
                "highlight_text": highlight,
                "highlight_start": highlight_start,
                "highlight_end": highlight_end
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
