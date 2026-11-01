from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from dotenv import load_dotenv

from database.metrics import get_metrics
from database.postgres_sql import create_database
from database.create_table import create_tables
from vectorstore.create_index import create_index
from routes.ingestion import router as ingestion_router
from routes.chat import router as chat_router



load_dotenv()

app = FastAPI(
    title="AI-Powered Investor Intelligence Platform"
)

DEFAULT_CORS_ORIGINS = (
    "http://localhost:8443,http://127.0.0.1:8443,"
    "http://localhost:5173,http://127.0.0.1:5173"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """
    Initialize database and vector index on app startup.
    """
    print("Creating database....")
    create_database()
    print("Creating table....")
    create_tables()
    
    try:
        create_index(
            endpoint=os.getenv("AZURE_SEARCH_ENDPOINT"),
            api_key=os.getenv("AZURE_SEARCH_API_KEY"),
            index_name=os.getenv("AZURE_SEARCH_INDEX_NAME")
        )
    except Exception as e:
        print(f"Warning: Could not create vector index: {e}")

app.include_router(
    ingestion_router,
    prefix="/api",
    tags=["Ingestion"]
)

app.include_router(
    chat_router,
    prefix="/api",
    tags=["Chat"]
)

@app.get("/api/metrics")
def metrics():
    """
    Return KPI metrics.
    """
    return get_metrics()


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


FRONTEND_DIST = Path(__file__).parent / "frontend" / "dist"

if FRONTEND_DIST.is_dir():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets"
    )

    @app.get("/{path:path}", include_in_schema=False)
    def frontend(path: str):
        """
        Serve the built React app, falling back to index.html.
        """
        file = (FRONTEND_DIST / path).resolve()
        if file.is_file() and FRONTEND_DIST in file.parents:
            return FileResponse(file)
        return FileResponse(FRONTEND_DIST / "index.html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )
