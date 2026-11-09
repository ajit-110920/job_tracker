
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN python -m pip install --no-cache-dir --timeout=120 --retries=10 -r requirements.txt

COPY . .

# Create a non-root user
RUN useradd --create-home appuser

# Give the application directory to appuser
RUN chown -R appuser:appuser /app

# Run the application as a non-root user
USER appuser

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]