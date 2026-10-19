import pymupdf4llm
from pathlib import Path

pdf_path = "data/raw_pdf/2024_Tesla.pdf"
md_path = "data/output_md/2024_Tesla.md"


# Convert PDF to Markdown
markdown = pymupdf4llm.to_markdown(pdf_path)

# Save Markdown to a file
Path(md_path).write_text(markdown, encoding="utf-8")

print(f"Markdown saved to: {md_path}")

