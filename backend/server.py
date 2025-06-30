from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with error handling
try:
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        raise ValueError("MONGO_URL environment variable is required")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'guesty_dashboard')]
except Exception as e:
    print(f"MongoDB connection error: {e}")
    client = None
    db = None

# Create the main app
app = FastAPI(title="Guesty Financial Dashboard API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    database_connected: bool

# Health check endpoint
@api_router.get("/health", response_model=HealthCheck)
async def health_check():
    db_connected = False
    if client and db:
        try:
            await client.admin.command('ping')
            db_connected = True
        except Exception:
            pass
    
    return HealthCheck(
        status="healthy" if db_connected else "degraded",
        timestamp=datetime.utcnow(),
        database_connected=db_connected
    )

@api_router.get("/")
async def root():
    return {"message": "Guesty Financial Dashboard API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    
    try:
        await db.status_checks.insert_one(status_obj.dict())
        return status_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        status_checks = await db.status_checks.find().to_list(1000)
        return [StatusCheck(**status_check) for status_check in status_checks]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # In production, specify exact origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (for React build)
static_dir = Path(__file__).parent.parent / "frontend" / "build"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir / "static")), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Serve React app for all non-API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_path = static_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        
        # Fallback to index.html for React Router
        return FileResponse(static_dir / "index.html")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Guesty Financial Dashboard API")
    if db:
        logger.info("MongoDB connection established")
    else:
        logger.warning("MongoDB connection failed - running in degraded mode")

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
        logger.info("MongoDB connection closed")

# For development
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
