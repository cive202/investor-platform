import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings
from vectorstore.azure_ai_search import AzureAISearchVectorStore
from pdf_to_markdown import PDFtoMarkdown


def parse_company_year(pdf_file: Path) -> tuple[str, str]:
    """Parse company and year from the PDF filename.

    Examples:
        2024_Apple.pdf -> ("Apple", "2024")
        2024_AnnualReport_Apple.pdf -> ("Apple", "2024")
    """
    parts = pdf_file.stem.split("_")

    if len(parts) < 2 or not parts[0].isdigit():
        raise ValueError(
            f"Invalid filename format: {pdf_file.name}"
        )

    year = parts[0]
    company = parts[-1]

    return company, year


def ingest_document(
    pdf_path: str,
    embeddings,
    vector_store,
) -> None:
    """Convert a PDF, create semantic chunks, and index them."""

    pdf_file = Path(pdf_path)
    company, year = parse_company_year(pdf_file)

    print(f"Ingesting document: {pdf_file.name}")

    # 1. Convert PDF to Markdown
    converter = PDFtoMarkdown()
    markdown = converter.pdf2md(str(pdf_file))

    if not markdown or not markdown.strip():
        raise ValueError(
            f"No Markdown content extracted from {pdf_file.name}"
        )

    # 2. Split Markdown into semantic chunks
    chunker = SemanticChunker(
        embeddings,
        breakpoint_threshold_type="percentile",
    )

    chunks = chunker.create_documents([markdown])

    vector_store.upload_chunks(
            chunks = chunks,
            embeddings = embeddings,
            company = company, 
            year = year,
            source_file =pdf_file.name
            )
    print(
        f"Successfully indexed {len(chunks)} chunks "
        f"from {pdf_file.name}"
    )


def ingest_directory(input_dir: str) -> None:
    """Ingest every PDF in a directory."""

    load_dotenv(override=True)

    embedding_model_name = os.getenv(
        "AZURE_EMBEDDING_MODEL_NAME"
    )
    embedding_endpoint = os.getenv(
        "AZURE_OPENAI_ENDPOINT"
    )
    embedding_api_key = os.getenv(
        "AZURE_OPENAI_API_KEY"
    )

    search_endpoint = os.getenv(
        "AZURE_SEARCH_ENDPOINT"
    )
    search_api_key = os.getenv(
        "AZURE_SEARCH_API_KEY"
    )
    index_name = os.getenv(
        "AZURE_SEARCH_INDEX_NAME"
    )

    # Validate configuration
    required_settings = {
        "AZURE_EMBEDDING_MODEL_NAME": embedding_model_name,
        "AZURE_OPENAI_ENDPOINT": embedding_endpoint,
        "AZURE_OPENAI_API_KEY": embedding_api_key,
        "AZURE_SEARCH_ENDPOINT": search_endpoint,
        "AZURE_SEARCH_API_KEY": search_api_key,
        "AZURE_SEARCH_INDEX_NAME": index_name,
    }

    missing = [
        name
        for name, value in required_settings.items()
        if not value
    ]

    if missing:
        raise RuntimeError(
            f"Missing environment variables: {', '.join(missing)}"
        )

    # 1. Initialize Azure OpenAI embeddings

    embeddings = OpenAIEmbeddings(
        model=embedding_model_name,
        base_url=embedding_endpoint,
        api_key=embedding_api_key,
        check_embedding_ctx_length=False,
    )

    # 2. Initialize Azure AI Search vector store
    vector_store = AzureAISearchVectorStore(
        endpoint=search_endpoint,
        api_key=search_api_key,
        index_name=index_name,
    )

    # 3. Find all PDFs
    directory = Path(input_dir)

    if not directory.is_dir():
        raise NotADirectoryError(
            f"Input directory does not exist: {directory}"
        )

    pdf_files = sorted(directory.glob("*.pdf"))

    if not pdf_files:
        print(f"No PDF files found in {directory}")
        return

    # 4. Ingest each PDF
    for pdf_file in pdf_files:
        try:
            ingest_document(
                pdf_path=str(pdf_file),
                embeddings=embeddings,
                vector_store=vector_store,
            )
        except Exception as exc:
            print(f"Failed to ingest {pdf_file.name}: {exc}")


if __name__ == "__main__":
    ingest_directory("data/raw_pdf/")
