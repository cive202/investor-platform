import os
from pathlib import Path

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_experimental.text_splitter import SemanticChunker


class MarkdownSemanticChunker:
    def __init__(self, embeddings: Embeddings, **chunker_kwargs) -> None:
        """Wrap LangChain's SemanticChunker for Markdown content.

        Extra keyword arguments (e.g. `breakpoint_threshold_type`) are
        passed straight through to `SemanticChunker`.
        """
        self.embeddings = embeddings
        self.chunker = SemanticChunker(embeddings, **chunker_kwargs)

    @classmethod
    def from_env(cls, **chunker_kwargs) -> "MarkdownSemanticChunker":
        """Build a chunker using Azure OpenAI embedding settings from `.env`."""
        from dotenv import load_dotenv
        from langchain_openai import OpenAIEmbeddings

        load_dotenv(override=True)
        embedding_model_name = os.getenv("AZURE_EMBEDDING_MODEL_NAME")
        embedding_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        embedding_api_key = os.getenv("AZURE_OPENAI_API_KEY")

        if not embedding_endpoint or not embedding_api_key:
            raise RuntimeError("Missing Azure OpenAI endpoint or api_key")

        embeddings = OpenAIEmbeddings(
            model=embedding_model_name,
            base_url=embedding_endpoint,
            api_key=embedding_api_key,
            check_embedding_ctx_length=False,
        )
        return cls(embeddings, **chunker_kwargs)

    def chunk_text(self, markdown: str, metadata: dict | None = None) -> list[Document]:
        """Generate semantic chunks from a Markdown string."""
        metadatas = [metadata] if metadata else None
        return self.chunker.create_documents([markdown], metadatas=metadatas)

    def chunk_file(self, markdown_file: Path | str) -> list[Document]:
        """Read a Markdown file and generate semantic chunks from it.

        Each chunk's metadata records the source file path.
        """
        markdown_file = Path(markdown_file)
        markdown = markdown_file.read_text(encoding="utf-8")
        return self.chunk_text(markdown, metadata={"source": str(markdown_file)})

    def chunk_dir(self, input_dir: Path | str) -> dict[Path, list[Document]]:
        """Chunk every Markdown file under `input_dir` (including nested directories).

        Returns a mapping of Markdown path -> chunks for successful files.
        """
        input_dir = Path(input_dir)
        md_files = list(input_dir.rglob("*.md"))

        if not md_files:
            print(f"No Markdown files found in {input_dir}")
            return {}

        results: dict[Path, list[Document]] = {}
        for md_path in md_files:
            try:
                results[md_path] = self.chunk_file(md_path)
                print(f"Chunked: {md_path} ({len(results[md_path])} chunks)")
            except Exception as e:
                print(f"Failed to chunk {md_path}: {e}")

        return results


if __name__ == "__main__":
    chunker = MarkdownSemanticChunker.from_env()
    md_file_path = "./data/output_md/2024_Tesla.md"
    chunks = chunker.chunk_file(md_file_path)

    print(f"Generated {len(chunks)} chunks \n")

    for i, chunk in enumerate(chunks, start=1):
        print(f"--- Chunk {i} ({len(chunk.page_content)} chars) ---")
        print(chunk.page_content.strip())
        if chunk.metadata:
            print(f"Metadata: {chunk.metadata}")
            print()
