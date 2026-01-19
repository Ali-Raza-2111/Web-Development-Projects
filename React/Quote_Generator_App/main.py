from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

@app.get("/quote")
def get_quote():
    url = "https://zenquotes.io/api/random"
    response = requests.get(url)
    data = response.json()
    # Return only what you need
    return {
        "text": data[0]["q"],
        "author": data[0]["a"]
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port, or 3000 if CRA
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
