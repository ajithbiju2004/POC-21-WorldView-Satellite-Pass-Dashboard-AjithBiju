from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sqlite3

DB_NAME = "satellites.db"


# ---------------- DB INIT ----------------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS satellites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        latitude REAL,
        longitude REAL,
        status TEXT,
        coverage TEXT,
        revisit_time TEXT,
        orbit TEXT,
        altitude REAL,
        agency TEXT
    )
    """)

    # seed sample data
    cursor.execute("SELECT COUNT(*) FROM satellites")
    count = cursor.fetchone()[0]

    if count == 0:
        cursor.execute("""
        INSERT INTO satellites 
        (name, latitude, longitude, status, coverage, revisit_time, orbit, altitude, agency)
        VALUES 
        ('Station A', 10.52, 76.21, 'active', 'high', '12h', 'LEO', 500, 'ISRO'),
        ('Station B', 10.50, 76.25, 'active', 'medium', '24h', 'LEO', 600, 'NASA')
        """)

    conn.commit()
    conn.close()


# ---------------- FASTAPI APP ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- ROUTES ----------------

@app.get("/")
def home():
    return {"message": "Real Rails Backend Running"}


@app.get("/api/satellites")
def get_satellites():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM satellites")

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.post("/api/satellites")
def add_satellite(satellite: dict):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO satellites
        (name, latitude, longitude, status, coverage, revisit_time, orbit, altitude, agency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        satellite["name"],
        satellite["latitude"],
        satellite["longitude"],
        satellite["status"],
        satellite["coverage"],
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
    conn = sqlite3.connect(DB_NAME)
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
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM satellites WHERE id=?", (sat_id,))

    conn.commit()
    conn.close()

    return {"message": "Deleted"}