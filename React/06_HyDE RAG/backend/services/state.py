"""
Shared application state.

Centralises the mutable globals (RAG manager, document list, file names)
so that every route module can import and mutate the same objects.
"""

import os
import shutil
from typing import List, Optional

from langchain_core.documents import Document

from config import VECTOR_STORE_DIR


class AppState:
    """Container for mutable server-wide state."""

    def __init__(self) -> None:
        self.rag_manager: Optional["RAGManager"] = None  # noqa: F821
        self.all_documents: List[Document] = []
        self.uploaded_file_names: List[str] = []

    def rebuild_rag(self) -> None:
        """(Re-)initialise the RAGManager with current documents."""
        from services.rag_manager import RAGManager  # lazy to avoid circular

        if os.path.exists(VECTOR_STORE_DIR):
            shutil.rmtree(VECTOR_STORE_DIR)
        self.rag_manager = RAGManager(
            self.all_documents, persist_dir=VECTOR_STORE_DIR
        )

    def reset_rag(self) -> None:
        """Clear the RAG manager (e.g. when all files are deleted)."""
        self.rag_manager = None


# Singleton used across the app
app_state = AppState()
