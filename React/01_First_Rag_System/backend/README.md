# NeuralRAG Backend

A FastAPI backend for the NeuralRAG application that integrates LangGraph ReAct agents with ChromaDB for document retrieval.

## Features

- **RAG (Retrieval-Augmented Generation)**: Query your documents with AI
- **ChromaDB Vector Store**: Persistent document embeddings
- **LangGraph ReAct Agent**: Intelligent reasoning with tool use
- **Document Upload**: Support for PDF, TXT, and other text files
- **FastAPI**: Modern, fast Python web framework with automatic OpenAPI docs

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app factory
│   ├── config.py            # Application settings
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies (RAG agent singleton)
│   │   ├── chat.py          # Chat endpoints
│   │   ├── documents.py     # Document upload/delete endpoints
│   │   └── settings.py      # Settings endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── agent.py         # LangGraph RAG Agent
│   └── models/
│       ├── __init__.py
│       └── schemas.py       # Pydantic models
├── uploads/                  # Uploaded documents
├── chroma_db/               # ChromaDB persistence
├── run.py                   # Server entry point
├── Requirements.txt
└── README.md
```

## Prerequisites

- Python 3.10+
- Ollama with `llama3.2:1b` model installed
- Node.js (for frontend)

## Installation

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r Requirements.txt
   ```

3. **Make sure Ollama is running with the required model:**
   ```bash
   ollama pull llama3.2:1b
   ollama serve
   ```

## Running the Server

### Option 1: Using run.py (Recommended)
```bash
python run.py
```

### Option 2: Using uvicorn directly
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Using uvicorn with module path
```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Chat
- `POST /api/chat` - Send a message and get AI response
- `POST /api/chat/stream` - Stream chat response (SSE)

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - List all documents
- `DELETE /api/documents/{doc_id}` - Delete a document

### Settings
- `GET /api/settings` - Get current settings
- `POST /api/settings` - Update settings

### Health
- `GET /` - API info
- `GET /health` - Health check

## Configuration

Settings can be configured via environment variables or `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | NeuralRAG API | Application name |
| `DEBUG` | True | Enable debug mode |
| `HOST` | 0.0.0.0 | Server host |
| `PORT` | 8000 | Server port |
| `DEFAULT_MODEL` | llama3.2:1b | Ollama model |
| `DEFAULT_TEMPERATURE` | 0.7 | LLM temperature |

## Tools Available to the Agent

1. `search_documents` - Search the knowledge base
2. `add_numbers` - Add two numbers
3. `subtract_numbers` - Subtract two numbers
4. `multiply_numbers` - Multiply two numbers
5. `divide_numbers` - Divide two numbers