from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

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

    conn = sqlite3.connect("../satellites.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM satellites")

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]

@app.post("/api/satellites")
def add_satellite(satellite: dict):

    conn = sqlite3.connect("../satellites.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO satellites
        (name, lat, lng, coverage, status, revisit_time, orbit, altitude, agency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        satellite["name"],
        satellite["lat"],
        satellite["lng"],
        satellite["coverage"],
        satellite["status"],
        satellite["revisit_time"],
        satellite["orbit"],
        satellite["altitude"],
        satellite["agency"]
    ))

    conn.commit()
    conn.close()

    return {"message": "Satellite added"}

@app.put("/api/satellites/{sat_id}")
def update_satellite(sat_id: int, satellite: dict):

    conn = sqlite3.connect("../satellites.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE satellites
        SET status=?
        WHERE id=?
    """, (
        satellite["status"],
        sat_id
    ))

    conn.commit()
    conn.close()

    return {"message": "Updated"}

@app.delete("/api/satellites/{sat_id}")
def delete_satellite(sat_id: int):

    conn = sqlite3.connect("../satellites.db")
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM satellites WHERE id=?",
        (sat_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Deleted"}