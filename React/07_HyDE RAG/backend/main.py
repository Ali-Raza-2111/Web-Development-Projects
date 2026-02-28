"""
Hybrid RAG System – Backend entry point.

Wires together configuration, middleware, and route modules,
then starts the uvicorn server.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, UPLOAD_DIR
from routes import upload_router, chat_router, files_router, health_router


# ── Lifespan ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(_app: FastAPI):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    yield


# ── App ──────────────────────────────────────────────────────────────────

app = FastAPI(title="Hybrid RAG System", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────────────────

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(files_router)
app.include_router(health_router)


# ── Entry-point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
