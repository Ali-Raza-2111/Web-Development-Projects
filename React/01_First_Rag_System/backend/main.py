from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
import shutil
from datetime import datetime

from rag_agent import RAGAgent

app = FastAPI(title="NeuralRAG API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Agent
rag_agent = RAGAgent()

# Directory for uploaded documents
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    id: str
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None  # Now returns detailed source metadata

class DocumentResponse(BaseModel):
    id: str
    filename: str
    status: str
    upload_date: str
    size: int
    type: str

class SettingsRequest(BaseModel):
    model: Optional[str] = "llama3.2:1b"
    temperature: Optional[float] = 0.7

# Store for documents metadata
documents_store = {}


@app.get("/")
async def root():
    return {"message": "NeuralRAG API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat message and return AI response with RAG"""
    try:
        # Get the last user message
        user_message = request.messages[-1].content if request.messages else ""
        
        # Get conversation history
        history = []
        for msg in request.messages[:-1]:
            history.append({"role": msg.role, "content": msg.content})
        
        # Run the RAG agent
        response, sources = await rag_agent.query(user_message, history)
        
        return ChatResponse(
            id=str(uuid.uuid4()),
            role="assistant",
            content=response,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat response"""
    try:
        user_message = request.messages[-1].content if request.messages else ""
        history = []
        for msg in request.messages[:-1]:
            history.append({"role": msg.role, "content": msg.content})
        
        async def generate():
            async for chunk in rag_agent.stream_query(user_message, history):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/documents/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload a document to the knowledge base"""
    try:
        # Generate unique ID
        doc_id = str(uuid.uuid4())
        
        # Get file extension
        file_ext = file.filename.split(".")[-1].upper() if "." in file.filename else "TXT"
        
        # Save file
        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
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


@app.get("/api/documents", response_model=List[DocumentResponse])
async def list_documents():
    """List all uploaded documents"""
    return [DocumentResponse(**doc) for doc in documents_store.values()]


@app.delete("/api/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the knowledge base"""
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


@app.get("/api/documents/view/{filename}")
async def view_document(filename: str, highlight: Optional[str] = Query(None)):
    """View a document with optional text highlighting for source verification"""
    from langchain_community.document_loaders import PyPDFLoader, TextLoader
    
    # Find the document in store
    doc_info = None
    for doc in documents_store.values():
        if doc["filename"] == filename:
            doc_info = doc
            break
    
    if not doc_info:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_path = doc_info["path"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Document file not found")
    
    try:
        # Load document
        if file_path.lower().endswith('.pdf'):
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            pages = []
            for i, doc in enumerate(documents):
                page_text = doc.page_content
                has_highlight = False
                highlight_start = -1
                highlight_end = -1
                
                # Find highlight position if provided
                if highlight:
                    # Try to find exact match first
                    pos = page_text.find(highlight[:100])  # Use first 100 chars to find
                    if pos != -1:
                        has_highlight = True
                        highlight_start = pos
                        highlight_end = pos + len(highlight)
                
                pages.append({
                    "page": i + 1,
                    "text": page_text,
                    "has_highlight": has_highlight,
                    "highlight_start": highlight_start,
                    "highlight_end": highlight_end
                })
            
            return {
                "filename": filename,
                "type": "pdf",
                "total_pages": len(pages),
                "pages": pages,
                "highlight_text": highlight
            }
        else:
            # Text file
            loader = TextLoader(file_path)
            documents = loader.load()
            text = documents[0].page_content if documents else ""
            
            has_highlight = False
            highlight_start = -1
            highlight_end = -1
            
            if highlight:
                pos = text.find(highlight[:100])
                if pos != -1:
                    has_highlight = True
                    highlight_start = pos
                    highlight_end = pos + len(highlight)
            
            return {
                "filename": filename,
                "type": "text",
                "content": text,
                "has_highlight": has_highlight,
                "highlight_start": highlight_start,
                "highlight_end": highlight_end,
                "highlight_text": highlight
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/settings")
async def update_settings(settings: SettingsRequest):
    """Update model settings"""
    try:
        rag_agent.update_settings(
            model=settings.model,
            temperature=settings.temperature
        )
        return {"message": "Settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/settings")
async def get_settings():
    """Get current settings"""
    return rag_agent.get_settings()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
