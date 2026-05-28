# POC-21 — WorldView Satellite Pass Dashboard

## Overview

WorldView Satellite Pass Dashboard is an operational intelligence visualization platform designed to monitor satellite coverage zones, revisit cycles, and regional surveillance operations through an interactive tactical dashboard.

The system provides:

- Real-time style geospatial visualization
- Interactive intelligence handshake
- Tactical operational overlays
- Satellite filtering system
- Intelligence report export
- Operational metrics dashboard

---

## Features

### Interactive Tactical Map
- Leaflet-based operational map
- Satellite markers
- Popup intelligence cards
- Click-to-sidebar handshake

### Intelligence Sidebar
- Selected satellite panel
- Operational status
- Coverage information
- Strategic context

### Functional Filters
- Region filtering
- Status filtering
- Dynamic marker updates

### Intelligence Export
- Export filtered operational data
- JSON intelligence reports

### Tactical UI
- Obsidian black operational theme
- Interactive glow effects
- Operational legends
- Responsive intelligence layout

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Leaflet
- React Leaflet

### Backend
- FastAPI
- Python

---

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install fastapi uvicorn pandas python-dotenv

uvicorn app.main:app --reload
```

---

## Operational Workflow

1. Backend serves satellite intelligence data
2. Frontend consumes operational data
3. Interactive map renders satellite positions
4. Marker click updates intelligence sidebar
5. Filters dynamically update operational view
6. Export system generates intelligence reports

---

## Author

Ajith Biju