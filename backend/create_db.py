import sqlite3
import json

# Connect database
conn = sqlite3.connect("satellites.db")
cursor = conn.cursor()

# Remove old table (optional but recommended while developing)
cursor.execute("DROP TABLE IF EXISTS satellites")

# Create table
cursor.execute("""
CREATE TABLE satellites (
    id INTEGER PRIMARY KEY,
    name TEXT,
    lat REAL,
    lng REAL,
    coverage TEXT,
    status TEXT,
    pass_status TEXT,
    next_pass TEXT,
    signal_strength INTEGER,
    tracking_stability TEXT,
    ground_lock TEXT,
    data_relay TEXT,
    revisit_time TEXT,
    orbit TEXT,
    altitude TEXT,
    agency TEXT
)
""")

# Load JSON
with open(
    r"C:\Users\Ajith BIju\OneDrive\Desktop\BIA\POC-21\mock-data\satellites.json",
    "r"
) as f:
    data = json.load(f)

# Insert data
for sat in data:
    cursor.execute("""
    INSERT INTO satellites (
        id,
        name,
        lat,
        lng,
        coverage,
        status,
        pass_status,
        next_pass,
        signal_strength,
        tracking_stability,
        ground_lock,
        data_relay,
        revisit_time,
        orbit,
        altitude,
        agency
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sat["id"],
        sat["name"],
        sat["lat"],
        sat["lng"],
        sat["coverage"],
        sat["status"],
        sat["pass_status"],
        sat["next_pass"],
        sat["signal_strength"],
        sat["tracking_stability"],
        sat["ground_lock"],
        sat["data_relay"],
        sat["revisit_time"],
        sat["orbit"],
        sat["altitude"],
        sat["agency"]
    ))

conn.commit()
conn.close()

print("Database created successfully.")