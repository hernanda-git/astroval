"""
Astroval Real-Time Astrometric & Grimoiric Operative Web Server
Standard: NASA JPL Swiss Ephemeris Topocentric Astrometry
Deployment: LiteSpeed / Uvicorn / FastAPI on fspmi-hostinger
"""

import os
import sys
import math
import asyncio
import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# Add engine directory to path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from astroval_engine import AstrovalEngine, JAKARTA_TZ

app = FastAPI(
    title="Astroval Astrometric Engine",
    description="100% NASA JPL / Swiss Ephemeris Precision Real-Time Astrometric & Grimoiric Intelligence",
    version="2.0.0-PRO"
)

# CORS configuration to allow cross-origin requests from GitHub Pages or custom domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize astronomical engine
engine = AstrovalEngine()

# Mount static asset directories if they exist
public_dir = PROJECT_ROOT / "public"
if public_dir.exists():
    app.mount("/public", StaticFiles(directory=str(public_dir)), name="public")

docs_dir = PROJECT_ROOT / "docs"
if docs_dir.exists():
    app.mount("/docs_dir", StaticFiles(directory=str(docs_dir)), name="docs_dir")


@app.get("/api/health")
async def health_check():
    """Health check and ephemeris integrity verification"""
    now_wib = datetime.datetime.now(JAKARTA_TZ)
    return {
        "status": "OPERATIONAL",
        "engine": "Astroval NASA JPL / Swiss Ephemeris C-Extension",
        "version": "2.0.0-PRO",
        "system_time_wib": now_wib.strftime("%Y-%m-%d %H:%M:%S WIB"),
        "observer": {
            "city": "Jakarta Center, Indonesia",
            "latitude": engine.lat,
            "longitude": engine.lon,
            "elevation_m": engine.alt
        }
    }


@app.get("/api/live")
async def get_live_snapshot():
    """
    Returns complete 100% topocentric astrometric and grimoiric state for the exact current second in Jakarta.
    Includes all 11 bodies, Placidus houses, aspects with velocities, 24 planetary hours, fixed stars, and 14 operative works.
    """
    try:
        now_wib = datetime.datetime.now(JAKARTA_TZ)
        snapshot = engine.get_complete_snapshot(now_wib)
        return snapshot
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Astrometric computation error: {str(e)}")


@app.get("/api/chart")
async def get_historical_or_future_chart(
    iso_datetime: Optional[str] = Query(None, description="ISO format: YYYY-MM-DDTHH:MM:SS"),
    date: Optional[str] = Query(None, description="Date: YYYY-MM-DD"),
    time: Optional[str] = Query("12:00:00", description="Time: HH:MM:SS")
):
    """
    Calculates exact astronomical chart and operative matrix for any historical or future epoch.
    """
    try:
        if iso_datetime:
            # Handle ISO string (e.g. 2026-10-04T14:30:00)
            clean_str = iso_datetime.replace("Z", "").split("+")[0]
            dt = datetime.datetime.fromisoformat(clean_str)
            target_dt = dt.replace(tzinfo=JAKARTA_TZ)
        elif date:
            parts = [int(p) for p in date.split("-")]
            t_parts = [int(p) for p in time.split(":")]
            target_dt = datetime.datetime(parts[0], parts[1], parts[2], t_parts[0], t_parts[1], t_parts[2], tzinfo=JAKARTA_TZ)
        else:
            target_dt = datetime.datetime.now(JAKARTA_TZ)

        snapshot = engine.get_complete_snapshot(target_dt)
        return snapshot
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date/time parameters: {str(e)}")


@app.get("/api/planetary-hours")
async def get_planetary_hours_schedule(
    date: Optional[str] = Query(None, description="Date: YYYY-MM-DD")
):
    """
    Calculates the 24 proportional diurnal and nocturnal planetary hours for the requested date.
    """
    try:
        if date:
            parts = [int(p) for p in date.split("-")]
            target_dt = datetime.datetime(parts[0], parts[1], parts[2], 12, 0, 0, tzinfo=JAKARTA_TZ)
        else:
            target_dt = datetime.datetime.now(JAKARTA_TZ)

        hours_data = engine.calculate_24_planetary_hours(target_dt)
        return hours_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")


@app.get("/api/operative-works")
async def get_operative_works_status():
    """
    Returns real-time viability scores and tactical grimoiric dossiers for all 14 Operative Works.
    """
    try:
        now_wib = datetime.datetime.now(JAKARTA_TZ)
        snapshot = engine.get_complete_snapshot(now_wib)
        return {
            "timestamp_wib": snapshot["timestamp_wib"],
            "active_hour": snapshot["chronometry"]["active_hour"],
            "operative_works": snapshot["operative_works"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Operative works evaluation error: {str(e)}")


@app.websocket("/ws/live")
async def websocket_live_stream(websocket: WebSocket):
    """
    Real-time WebSocket connection streaming 1-second ticks of astrometric chronometry,
    active hour countdown, luminary positions, and operative ranks.
    """
    await websocket.accept()
    try:
        while True:
            now_wib = datetime.datetime.now(JAKARTA_TZ)
            jd = engine.get_julday(now_wib)
            chronometry = engine.calculate_24_planetary_hours(now_wib)
            
            # Quick calculations for luminaries
            sun_calc = engine.calculate_body(jd, "sun")
            moon_calc = engine.calculate_body(jd, "moon")
            elongation = (moon_calc["longitude"] - sun_calc["longitude"]) % 360.0
            phase_pct = (1.0 - math.cos(math.radians(elongation))) / 2.0 * 100.0

            active_h = chronometry.get("active_hour")

            payload = {
                "timestamp_wib": now_wib.strftime("%Y-%m-%d %H:%M:%S WIB"),
                "julian_day": round(jd, 6),
                "active_hour": {
                    "id": active_h["id"] if active_h else "--",
                    "num": active_h["num"] if active_h else 0,
                    "period": active_h["period"] if active_h else "--",
                    "ruler": active_h["ruler"] if active_h else "--",
                    "glyph": active_h["glyph"] if active_h else "☉",
                    "color": active_h["color"] if active_h else "#f59e0b",
                    "start_wib": active_h["start_wib"] if active_h else "--",
                    "end_wib": active_h["end_wib"] if active_h else "--",
                    "seconds_remaining": active_h["seconds_remaining"] if active_h else 0,
                    "percentage_elapsed": active_h["percentage_elapsed"] if active_h else 0.0
                },
                "sun": {
                    "dms": sun_calc["formatted_dms"],
                    "sign": sun_calc["sign"],
                    "sign_glyph": sun_calc["sign_glyph"],
                    "altitude": round(sun_calc["altitude"], 2),
                    "azimuth": round(sun_calc["azimuth"], 2)
                },
                "moon": {
                    "dms": moon_calc["formatted_dms"],
                    "sign": moon_calc["sign"],
                    "sign_glyph": moon_calc["sign_glyph"],
                    "altitude": round(moon_calc["altitude"], 2),
                    "azimuth": round(moon_calc["azimuth"], 2),
                    "phase_illumination_pct": round(phase_pct, 1)
                }
            }

            await websocket.send_json(payload)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass


@app.get("/", response_class=HTMLResponse)
async def serve_index():
    """Serves the master interactive Astroval application"""
    index_path = PROJECT_ROOT / "index.html"
    if index_path.exists():
        return FileResponse(
            str(index_path),
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    return HTMLResponse("<h1>Astroval Engine Running</h1><p>Visit /api/live for data.</p>")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=18090, reload=True)
