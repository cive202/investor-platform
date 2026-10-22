import shutil
from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from ingestion.ingest import build_clients, ingest_document

router = APIRouter()


@router.post("/upload")
def ingest(
    file: UploadFile = File(...),
) -> dict:
    upload_dir = Path("data/raw_pdf")
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    embeddings, vector_store = build_clients()

    ingest_document(
        pdf_path=str(file_path),
        embeddings=embeddings,
        vector_store=vector_store,
    )

    return {
        "message": "Document uploaded and indexed successfully",
        "file_name": file.filename,
    }
