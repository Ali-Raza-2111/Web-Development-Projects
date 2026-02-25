"""
POST /chat – query the HyDE RAG pipeline and return an LLM-generated answer.
"""

import time
from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from config import GEMINI_API_KEY, GEMINI_MODEL
from schemas import ChatRequest, ChatResponse
from services.state import app_state

router = APIRouter()

# LLM used to synthesise a final answer from retrieved context
_answer_llm = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL,
    api_key=GEMINI_API_KEY,
    temperature=0.3,
)

_ANSWER_PROMPT = ChatPromptTemplate.from_template(
    "You are a helpful AI assistant. Answer the user's question based ONLY on "
    "the provided context documents. If the context doesn't contain enough "
    "information to answer, say so honestly.\n\n"
    "Context:\n{context}\n\n"
    "Question: {question}\n\n"
    "Answer:"
)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if app_state.rag_manager is None:
        raise HTTPException(
            status_code=400,
            detail="No documents uploaded yet. Please upload documents first.",
        )

    try:
        # run_query now returns {"final_results": [...], "trace": [...]}
        result = app_state.rag_manager.run_query(request.message)
        relevant_docs: List[Document] = result["final_results"]
        trace = result.get("trace", [])

        if not relevant_docs:
            return ChatResponse(
                answer="I couldn't find any relevant information in the uploaded documents.",
                sources=[],
                trace=trace,
            )

        context = "\n\n---\n\n".join(doc.page_content for doc in relevant_docs)
        sources = list(
            {doc.metadata.get("source", "Unknown") for doc in relevant_docs}
        )

        # ── Step 6: Context Assembled ──
        trace.append({
            "step": 6,
            "label": "Context Assembled",
            "status": "complete",
            "metadata": {
                "context_length_chars": len(context),
                "num_sources": len(sources),
                "strategy": "stuffing",
            },
        })

        # ── Step 7: LLM Response Generation ──
        t0 = time.time()
        response = (_ANSWER_PROMPT | _answer_llm).invoke(
            {"context": context, "question": request.message}
        )
        llm_elapsed = round(time.time() - t0, 2)

        trace.append({
            "step": 7,
            "label": "LLM Response Generation",
            "status": "complete",
            "duration_s": llm_elapsed,
            "metadata": {
                "model": GEMINI_MODEL,
                "temperature": 0.3,
                "answer_length_chars": len(response.content),
            },
        })

        # ── Step 8: Final Answer Delivered ──
        trace.append({
            "step": 8,
            "label": "Final Answer Delivered",
            "status": "complete",
            "metadata": {
                "finish_reason": "stop",
            },
        })

        return ChatResponse(
            answer=response.content,
            sources=sources,
            trace=trace,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {e}")
