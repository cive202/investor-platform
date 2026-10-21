from os import wait
from pathlib import PATH
from pdf2md import PDFtoMarkdown

def parse_company_year(pdf_file : PATH) -> tuple[str,str]:
    ''' Parse company and year from PDF file 

    Supports name like '2024_Apple.pdf' and '2024_AnnunalReport_Apple.pdf
    '''

    stem = Path(pdf_file).stem
    parts = stem.split('_')

    year = parts[0]
    company = parts[-1]

    return company, year

def ingest_document(
        pdf_path: str,
        embeddings,
        vector) -> None:
    
    pdf_file = Path(pdf_path)
    company, year = parse_company_year(pdf_file)
    print(f"Ingesting document {pdf_file.name}")

    converter = PDFtoMarkdown()
    
    markdown
