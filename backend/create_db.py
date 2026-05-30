import sqlite3
import json

conn = sqlite3.connect("satellites.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS satellites (
    id INTEGER PRIMARY KEY,
    name TEXT,
    lat REAL,
    lng REAL,
    coverage TEXT,
    status TEXT,
    pass_status TEXT,
    next_pass TEXT,
    revisit_time TEXT,
    orbit TEXT,
    altitude TEXT,
    agency TEXT
)
""")

with open(r"C:\Users\Ajith BIju\OneDrive\Desktop\BIA\POC-21\mock-data\satellites.json") as f:
    data = json.load(f)

for sat in data:
    cursor.execute("""
    INSERT OR REPLACE INTO satellites
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sat["id"],
        sat["name"],
        sat["lat"],
        sat["lng"],
        sat["coverage"],
        sat["status"],
        sat["pass_status"],
        sat["next_pass"],
        sat["revisit_time"],
        sat["orbit"],
        sat["altitude"],
        sat["agency"]
    ))

conn.commit()
conn.close()