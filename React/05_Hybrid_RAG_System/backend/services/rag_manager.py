"""
RAGManager – Hybrid (dense + sparse) retrieval with LLM-based reranking.

Pipeline (LangGraph):  START → retrieve → rerank → END
"""

import re
from typing import List, Optional, TypedDict

from langchain_classic.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.graph import END, START, StateGraph

from config import (
    DENSE_WEIGHT,
    EMBEDDING_MODEL,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    RERANK_THRESHOLD,
    RETRIEVER_K,
    VECTOR_STORE_DIR,
)


class _AgentState(TypedDict):
    """Internal state flowing through the LangGraph pipeline."""
    query: str
    documents: List[Document]
    final_results: List[Document]


class RAGManager:
    """Encapsulates hybrid retrieval with LLM-based reranking."""

    def __init__(
        self,
        documents: List[Document],
        persist_dir: str = VECTOR_STORE_DIR,
    ) -> None:
        self._persist_dir = persist_dir
        self._collection = "hybrid_rag_collection"

        self._embedding = GoogleGenerativeAIEmbeddings(
            model=EMBEDDING_MODEL,
            google_api_key=GEMINI_API_KEY,
        )

        self._reranker_llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            api_key=GEMINI_API_KEY,
            temperature=0,
        )

        self._vector_store: Optional[Chroma] = None
        self._hybrid_retriever: Optional[EnsembleRetriever] = None
        self._init_retriever(documents)

        self._app = self._build_graph().compile()

    # ── retriever setup ──────────────────────────────────────────────────

    def _init_retriever(self, documents: List[Document]) -> None:
        self._vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self._embedding,
            persist_directory=self._persist_dir,
            collection_name=self._collection,
        )

        dense = self._vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": RETRIEVER_K},
        )

        sparse = BM25Retriever.from_documents(documents=documents)
        sparse.k = RETRIEVER_K

        self._hybrid_retriever = EnsembleRetriever(
            retrievers=[dense, sparse],
            weights=[DENSE_WEIGHT, 1.0 - DENSE_WEIGHT],
        )

    # ── LangGraph nodes ──────────────────────────────────────────────────

    def _retrieve_node(self, state: _AgentState) -> dict:
        print("--- Executing Retrieval Node ---")
        docs = self._hybrid_retriever.invoke(state["query"])
        print(f"Retrieved {len(docs)} documents.")
        for i, doc in enumerate(docs):
            print(f"  [{i}] {doc.page_content[:120]}")
        return {"documents": docs}

    def _score_all_documents(self, query: str, docs: list) -> list[int]:
        """Score all documents in a single LLM call. Returns list of scores."""
        doc_list = "\n".join(
            f"[Doc {i}]: {doc.page_content}" for i, doc in enumerate(docs)
        )
        prompt = ChatPromptTemplate.from_template(
            "You are a relevance scoring assistant. Rate each document's relevance "
            "to the query on a scale of 1-10.\n"
            "1 = completely irrelevant, 10 = directly answers the question.\n\n"
            "Query: {query}\n\n"
            "Documents:\n{documents}\n\n"
            "Return ONLY a comma-separated list of integers (one per document, "
            "in order). Example for 3 docs: 8,3,6\n"
            "Nothing else."
        )
        try:
            response = (prompt | self._reranker_llm).invoke(
                {"query": query, "documents": doc_list}
            )
            numbers = re.findall(r"\d+", response.content)
            scores = [min(max(int(n), 1), 10) for n in numbers]

            # Pad or truncate to match doc count
            while len(scores) < len(docs):
                scores.append(1)
            scores = scores[: len(docs)]

            return scores
        except Exception as e:
            print(f"  ⚠ Reranker error: {e}")
            return [1] * len(docs)

    def _rerank_node(self, state: _AgentState) -> dict:
        print("--- Executing Rerank Node ---")
        query = state["query"]
        docs = state["documents"]

        scores = self._score_all_documents(query, docs)

        scored = list(zip(scores, range(len(docs)), docs))
        for score, idx, doc in scored:
            print(f"  Doc[{idx}] score={score}: {doc.page_content[:100]}")

        scored.sort(key=lambda x: x[0], reverse=True)

        reranked = [doc for score, _, doc in scored if score > RERANK_THRESHOLD]
        if not reranked:
            print("  All docs scored low — returning top 3 as fallback.")
            reranked = [doc for _, _, doc in scored[:3]]

        print(f"Reranked results ({len(reranked)} docs):")
        for i, doc in enumerate(reranked):
            print(f"  [{i}] {doc.page_content[:120]}")

        return {"final_results": reranked}

    # ── graph wiring ─────────────────────────────────────────────────────

    def _build_graph(self) -> StateGraph:
        graph = StateGraph(_AgentState)
        graph.add_node("retrieve", self._retrieve_node)
        graph.add_node("rerank", self._rerank_node)
        graph.add_edge(START, "retrieve")
        graph.add_edge("retrieve", "rerank")
        graph.add_edge("rerank", END)
        return graph

    # ── public API ───────────────────────────────────────────────────────

    def run_query(self, user_query: str) -> List[Document]:
        return self._app.invoke({"query": user_query})["final_results"]
