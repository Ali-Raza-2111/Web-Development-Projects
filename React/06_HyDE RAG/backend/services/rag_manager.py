"""
RAGManager – HyDE (Hypothetical Document Embedding) retrieval pipeline.

Pipeline (LangGraph):  START → hyde_generate → hyde_embed_and_search → END

Instead of reranking retrieved docs, we generate a hypothetical answer first,
embed *that* answer, then use the embedding to find the most similar real chunks.
"""

import time
import re
from typing import Any, Dict, List, Optional, TypedDict

from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.graph import END, START, StateGraph

from config import (
    EMBEDDING_MODEL,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    RETRIEVER_K,
    VECTOR_STORE_DIR,
)


class _AgentState(TypedDict):
    """Internal state flowing through the LangGraph pipeline."""
    query: str
    hypothetical_document: str
    documents: List[Document]
    final_results: List[Document]
    trace: List[Dict[str, Any]]


class RAGManager:
    """Encapsulates HyDE-based retrieval."""

    def __init__(
        self,
        documents: List[Document],
        persist_dir: str = VECTOR_STORE_DIR,
    ) -> None:
        self._persist_dir = persist_dir
        self._collection = "hyde_rag_collection"

        self._embedding = GoogleGenerativeAIEmbeddings(
            model=EMBEDDING_MODEL,
            google_api_key=GEMINI_API_KEY,
        )

        # Used for hypothetical document generation (same LLM as old reranker)
        self._hyde_llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            api_key=GEMINI_API_KEY,
            temperature=0.7,
        )

        self._vector_store: Optional[Chroma] = None
        self._init_vector_store(documents)

        self._app = self._build_graph().compile()

    # ── vector store setup ───────────────────────────────────────────────

    def _init_vector_store(self, documents: List[Document]) -> None:
        self._vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self._embedding,
            persist_directory=self._persist_dir,
            collection_name=self._collection,
        )

    # ── LangGraph nodes ──────────────────────────────────────────────────

    def _hyde_generate_node(self, state: _AgentState) -> dict:
        """Step 2: Generate a hypothetical document that *would* answer the query."""
        print("--- Executing HyDE Generation Node ---")
        t0 = time.time()

        prompt = ChatPromptTemplate.from_template(
            "You are a knowledgeable assistant. Given the question below, "
            "write a short, detailed paragraph (100-200 words) that would "
            "perfectly answer the question. Do NOT say 'I don't know'. "
            "Just write the ideal answer passage as if it existed in a "
            "reference document.\n\n"
            "Question: {query}\n\n"
            "Hypothetical answer passage:"
        )

        try:
            response = (prompt | self._hyde_llm).invoke({"query": state["query"]})
            hypo_doc = response.content.strip()
        except Exception as e:
            print(f"  ⚠ HyDE generation error: {e}")
            hypo_doc = state["query"]  # fallback to raw query

        elapsed = round(time.time() - t0, 2)
        print(f"  Generated hypothetical document ({len(hypo_doc)} chars, {elapsed}s)")
        print(f"  Preview: {hypo_doc[:200]}")

        trace_entry = {
            "step": 2,
            "label": "Hypothetical Document Generated (HyDE)",
            "status": "complete",
            "duration_s": elapsed,
            "metadata": {
                "hypothetical_document": hypo_doc,
                "char_count": len(hypo_doc),
            },
        }

        return {
            "hypothetical_document": hypo_doc,
            "trace": state.get("trace", []) + [trace_entry],
        }

    def _hyde_embed_and_search_node(self, state: _AgentState) -> dict:
        """Steps 3-5: Embed the hypothetical doc, vector search, retrieve top-k."""
        print("--- Executing HyDE Embed & Search Node ---")

        # ── Step 3: create embedding ──
        t0 = time.time()
        hypo_doc = state["hypothetical_document"]
        hypo_embedding = self._embedding.embed_query(hypo_doc)
        embed_elapsed = round(time.time() - t0, 2)
        print(f"  Embedded hypothetical doc ({embed_elapsed}s)")

        embed_trace = {
            "step": 3,
            "label": "Hypothetical Embedding Created",
            "status": "complete",
            "duration_s": embed_elapsed,
            "metadata": {
                "model": EMBEDDING_MODEL,
                "dimensions": len(hypo_embedding),
            },
        }

        # ── Step 4: vector search ──
        t1 = time.time()
        results_with_scores = self._vector_store.similarity_search_by_vector(
            hypo_embedding, k=RETRIEVER_K
        )
        search_elapsed = round(time.time() - t1, 2)
        print(f"  Vector search returned {len(results_with_scores)} docs ({search_elapsed}s)")

        search_trace = {
            "step": 4,
            "label": "Vector Search Executed",
            "status": "complete",
            "duration_s": search_elapsed,
            "metadata": {
                "index": "chroma",
                "search_type": "cosine_similarity",
                "k": RETRIEVER_K,
            },
        }

        # ── Step 5: top-k chunks ──
        docs = results_with_scores  # already Document objects
        retrieved_chunks_meta = []
        for i, doc in enumerate(docs):
            snippet = doc.page_content[:200]
            source = doc.metadata.get("source", "unknown")
            retrieved_chunks_meta.append({
                "rank": i + 1,
                "source": source,
                "text": snippet,
            })
            print(f"  [{i}] ({source}) {snippet[:120]}")

        chunks_trace = {
            "step": 5,
            "label": "Top-K Chunks Retrieved",
            "status": "complete",
            "metadata": {
                "retrieved_count": len(docs),
                "chunks": retrieved_chunks_meta,
            },
        }

        trace = state.get("trace", []) + [embed_trace, search_trace, chunks_trace]

        return {
            "documents": docs,
            "final_results": docs,
            "trace": trace,
        }

    # ── graph wiring ─────────────────────────────────────────────────────

    def _build_graph(self) -> StateGraph:
        graph = StateGraph(_AgentState)
        graph.add_node("hyde_generate", self._hyde_generate_node)
        graph.add_node("hyde_embed_and_search", self._hyde_embed_and_search_node)
        graph.add_edge(START, "hyde_generate")
        graph.add_edge("hyde_generate", "hyde_embed_and_search")
        graph.add_edge("hyde_embed_and_search", END)
        return graph

    # ── public API ───────────────────────────────────────────────────────

    def run_query(self, user_query: str) -> dict:
        """Run the HyDE pipeline. Returns dict with 'final_results' and 'trace'."""
        result = self._app.invoke({
            "query": user_query,
            "hypothetical_document": "",
            "documents": [],
            "final_results": [],
            "trace": [{
                "step": 1,
                "label": "User Query Received",
                "status": "complete",
                "metadata": {"query": user_query},
            }],
        })
        return {
            "final_results": result["final_results"],
            "trace": result["trace"],
        }
