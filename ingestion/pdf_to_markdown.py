import pymupdf
import pymupdf4llm
from pathlib import Path


class PDFtoMarkdown:
    def __init__(self, output_dir: Path | str = Path("output"), save: bool = True) -> None:
        self.output_dir = Path(output_dir)
        self.save = save

    def pdf2md(self, pdf_path: Path | str, input_dir: Path | str | None = None) -> str:
        """Convert a single PDF to Markdown and return the Markdown text.

        If `save` is enabled, the Markdown is also written to `output_dir`,
        preserving the PDF's path relative to `input_dir` (if given).
        """
        pdf_path = Path(pdf_path)
        print(f"Converting: {pdf_path}")

        # Convert PDF to Markdown
        try:
            markdown = pymupdf4llm.to_markdown(str(pdf_path))
        except pymupdf.mupdf.FzErrorBase as e:
            # OCR engine failures (e.g. missing Tesseract language data) shouldn't
            # sink the whole ingestion; fall back to the embedded text layer.
            print(f"OCR failed for {pdf_path} ({e}); retrying without OCR")
            markdown = pymupdf4llm.to_markdown(str(pdf_path), use_ocr=False)

        if self.save:
            md_path = self._output_path(pdf_path, Path(input_dir) if input_dir else pdf_path.parent)
            # Create any required nested output directories
            md_path.parent.mkdir(parents=True, exist_ok=True)
            md_path.write_text(markdown, encoding="utf-8")
            print(f"Saved: {md_path}")

        return markdown

    def convert_dir(self, input_dir: Path | str) -> dict[Path, str]:
        """Convert every PDF under `input_dir` (including nested directories).

        Returns a mapping of PDF path -> Markdown text for successful conversions.
        """
        input_dir = Path(input_dir)
        # Find all PDFs, including those in nested directories
        pdf_files = list(input_dir.rglob("*.pdf"))

        if not pdf_files:
            print(f"No PDF files found in {input_dir}")
            return {}

        results: dict[Path, str] = {}
        for pdf_path in pdf_files:
            try:
                results[pdf_path] = self.pdf2md(pdf_path, input_dir)
            except Exception as e:
                print(f"Failed to convert {pdf_path}: {e}")

        print("PDF conversion complete.")
        return results

    def _output_path(self, pdf_path: Path, input_dir: Path) -> Path:
        # Preserve subdirectory structure in output
        if pdf_path.is_relative_to(input_dir):
            relative_path = pdf_path.relative_to(input_dir)
        else:
            relative_path = Path(pdf_path.name)
        return (self.output_dir / relative_path).with_suffix(".md")


if __name__ == "__main__":
    import sys

    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("data")
    converter = PDFtoMarkdown()
    if target.is_dir():
        converter.convert_dir(target)
    else:
        converter.pdf2md(target)
