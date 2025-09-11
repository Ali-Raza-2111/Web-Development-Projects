from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json
app = FastAPI()


load_dotenv()

api_key = os.getenv('API_KEY')
@app.get('/weather')
def get_weather():
    url = f'https://api.openweathermap.org/data/2.5/weather?q=London&units=Metric&appid={api_key}'
    response = requests.get(url)
    data = response.json()
    return data



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port, or 3000 if CRA
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

