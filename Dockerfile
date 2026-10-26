# Python version must satisfy requires-python in pyproject.toml (>=3.13)
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_HTTP_TIMEOUT=300 \
    PATH="/app/.venv/bin:$PATH"

# Pin uv to a version so builds are reproducible
COPY --from=ghcr.io/astral-sh/uv:0.8 /uv /usr/local/bin/uv

# psycopg2 (not -binary) is compiled from source here, so it needs gcc and libpq headers
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc6-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install dependencies first. This layer is cached until pyproject.toml or uv.lock changes.
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project

# 2. Copy the application source (a .dockerignore file keeps out .env, .venv, .git, ...)
COPY . .

# Run as a non-root user; give it ownership of /app so uploads to data/raw_pdf work
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
