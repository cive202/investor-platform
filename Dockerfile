WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Let Tesseract use its default language-data directory.
# Do not set TESSDATA_PREFIX unless you have verified the path.

RUN pip install --no-cache-dir uv

COPY requirements.txt .

RUN uv pip install --system --no-cache -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
