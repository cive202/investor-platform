import pymupdf4llm
from pathlib import Path


def main():
    input_dir = Path("data/raw_pdf")
    output_dir = Path("data/output_md")

    # Find all PDFs, including those in nested directories
    pdf_files = list(input_dir.rglob("*.pdf"))

    if not pdf_files:
        print(f"No PDF files found in {input_dir}")
        return

    for pdf_path in pdf_files:
        # Preserve subdirectory structure in output
        relative_path = pdf_path.relative_to(input_dir)
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
    main()

