"""
Chat API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import uuid

from app.models import ChatRequest, ChatResponse, SourceCitation
from app.api.deps import get_rag_agent
from app.core.agent import RAGAgent

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """
    Process a chat message and return AI response with RAG
    """
    try:
        # Get the last user message
        user_message = request.messages[-1].content if request.messages else ""
        
        # Get conversation history
        history = []
        for msg in request.messages[:-1]:
            history.append({"role": msg.role, "content": msg.content})
        
        # Run the RAG agent - now returns detailed source metadata
        response, source_metadata = await rag_agent.query(user_message, history)
        
        # Convert source metadata to SourceCitation objects
        sources = [
            SourceCitation(
                id=src.get("id", ""),
                filename=src.get("filename", "Unknown"),
                page=src.get("page"),
                excerpt=src.get("excerpt", ""),
                relevance_score=src.get("relevance_score", 0.0),
                highlight_text=src.get("highlight_text", src.get("full_content", ""))
            )
            for src in source_metadata
        ] if source_metadata else None
        
        return ChatResponse(
            id=str(uuid.uuid4()),
            role="assistant",
            content=response,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """
    Stream chat response using Server-Sent Events
    """
    try:
        user_message = request.messages[-1].content if request.messages else ""
        history = []
        for msg in request.messages[:-1]:
            history.append({"role": msg.role, "content": msg.content})
        
        async def generate():
            async for chunk in rag_agent.stream_query(user_message, history):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
