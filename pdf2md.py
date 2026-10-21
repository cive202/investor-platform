import pymupdf4llm
from typing import Optional 
from pathlib import Path


def PDFtoMarkdown(input_File_path: Path | None = None, input_dir: Path | None = None, output_dir: Path = Path("output")) -> None:
    pdf_files: list[Path] = []

    if input_File_path:
        # Convert a single PDF; use its parent as the base for the output path if no input_dir was given
        pdf_files = [input_File_path]
        if input_dir is None:
            input_dir = input_File_path.parent
    elif input_dir:
        # Find all PDFs, including those in nested directories
        pdf_files = list(input_dir.rglob("*.pdf"))

    if not pdf_files:
        print(f"No PDF files found in {input_dir}")
        return

    for pdf_path in pdf_files:
        # Preserve subdirectory structure in output
        if input_dir and pdf_path.is_relative_to(input_dir):
            relative_path = pdf_path.relative_to(input_dir)
        else:
            relative_path = Path(pdf_path.name)
        md_path = (output_dir / relative_path).with_suffix(".md")

        # Create any required nested output directories
        md_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            print(f"Converting: {pdf_path}")

            # Convert PDF to Markdown
            markdown = pymupdf4llm.to_markdown(str(pdf_path))

            # Save Markdown
            md_path.write_text(markdown, encoding="utf-8")

            print(f"Saved: {md_path}")

        except Exception as e:
            print(f"Failed to convert {pdf_path}: {e}")

    print("PDF conversion complete.")


if __name__ == "__main__":
    PDFtoMarkdown()
