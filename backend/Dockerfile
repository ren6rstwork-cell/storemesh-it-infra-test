# --- Storemesh IT Infra Test: Django backend image -----------------------
# Base image: slim Python, matches the Django 4.2 requirement without the
# extra bulk of the full python image.
FROM python:3.11-slim

# Environment setup:
# - PYTHONDONTWRITEBYTECODE: skip .pyc files (smaller, faster container fs)
# - PYTHONUNBUFFERED: send stdout/stderr straight to the container log
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

# System dependencies required to build/run psycopg2 (PostgreSQL client
# library) and to compile any wheels that don't ship pre-built binaries.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first so Docker can cache this layer and
# only re-run pip install when requirements.txt actually changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code.
COPY . .

RUN chmod +x entrypoint.sh \
    && useradd --create-home --uid 1000 django \
    && chown -R django:django /app
USER django

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

ENTRYPOINT ["./entrypoint.sh"]

# Production command: gunicorn WSGI server.
# (docker-compose can override this with `python manage.py runserver`
#  for local development if hot-reload is preferred.)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
