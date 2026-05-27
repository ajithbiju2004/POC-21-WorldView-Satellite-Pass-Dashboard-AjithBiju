from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def home():
    return {"message": "Real Rails Backend Running"}

# Satellite API route
@app.get("/api/satellites")
def get_satellites():

    # Locate mock JSON file
    file_path = Path(__file__).resolve().parent.parent.parent / "mock-data" / "satellites.json"

    # Read JSON data
    with open(file_path, "r") as file:
        data = json.load(file)

    return data