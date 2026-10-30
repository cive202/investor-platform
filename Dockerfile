FOM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y             
--no-install-recommends \                            
  tesseract-ocr-eng \                              
  && rm -rf /var/lib/apt/lists/*                   


RUN ln -sfn "$(dirname "$(find /usr/share/tesseract-ocr -name eng.traineddata | head -n1)")" /usr/share/tessdata \
    && test -f /usr/share/tessdata/eng.traineddata

ENV TESSDATA_PREFIX=/usr/share/tessdata

RUN pip install --no-cache-dir uv

COPY requirements.txt .

RUN uv pip install --system --no-cache -r requirements.txt

# Fail the build (not the first upload) if MuPDF's OCR can't initialise.
RUN python -c "import pymupdf; p = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, 64, 64), 0); p.clear_with(255); p.pdfocr_tobytes(language='eng')"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
