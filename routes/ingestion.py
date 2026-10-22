import shutil
from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from database.save_metrics import save_metrics
from ingestion.ingest import build_clients, ingest_document, parse_company_year
from rag.kpi_extraction import Retriever, extract_financial_metrics

router = APIRouter()

@router.post("/upload")
def upload_documents(
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

    # Extract KPIs from the freshly indexed document and store them.
    # A failure here should not fail the upload: the PDF is already indexed.
    company, year = parse_company_year(file_path)
    metrics_saved = False
    metrics_error = None

    try:
        metrics = extract_financial_metrics(
            retriever=Retriever(vector_store.client),
            company=company,
            year=int(year),
        )
        save_metrics(
            company=company,
            year=int(year),
            metrics=metrics,
        )
        metrics_saved = True
    except Exception as exc:
        metrics_error = str(exc)
        print(f"Failed to save metrics for {file.filename}: {exc}")

    return {
        "message": "Document uploaded and indexed successfully",
        "file_name": file.filename,
        "metrics_saved": metrics_saved,
        "metrics_error": metrics_error,
    }
