#!/usr/bin/env python
"""
Run the FastAPI server with Uvicorn

Usage:
    python run.py
    
Or with uvicorn directly:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""
import uvicorn
from app.config import get_settings


def main():
    settings = get_settings()
    
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║                    NeuralRAG Backend                         ║
╠══════════════════════════════════════════════════════════════╣
║  Server:    http://{settings.HOST}:{settings.PORT}                           ║
║  Docs:      http://localhost:{settings.PORT}/docs                     ║
║  ReDoc:     http://localhost:{settings.PORT}/redoc                    ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )


if __name__ == "__main__":
    main()
