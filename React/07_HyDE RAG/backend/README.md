# Hybrid RAG System – Backend

FastAPI server powering a **Hybrid Retrieval-Augmented Generation** system with LLM-based reranking.

## Folder Structure

```
backend/
├── main.py                 # Entry point – creates app, registers routers
├── config.py               # All constants & env vars
├── schemas/
│   ├── __init__.py
│   └── chat.py             # ChatRequest / ChatResponse
├── services/
│   ├── __init__.py
│   ├── state.py            # Shared AppState singleton
│   ├── rag_manager.py      # Hybrid retriever + LLM reranking (LangGraph)
│   └── document.py         # PDF extraction, text chunking
├── routes/
│   ├── __init__.py
│   ├── upload.py           # POST /upload
│   ├── chat.py             # POST /chat
│   ├── files.py            # GET /files, DELETE /files/{name}
│   └── health.py           # GET /health
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
echo 'Gemini_APi_Key=your_key_here' > .env

# Run the server
python main.py
# → http://localhost:8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/upload` | Upload PDF / TXT files |
| `POST` | `/chat` | Ask a question over uploaded docs |
| `GET` | `/files` | List uploaded files |
| `DELETE` | `/files/{filename}` | Remove a file from the index |
| `GET` | `/health` | Health / status check |
