import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()


def test_database_connection():
    test_database_url = os.getenv("TEST_DATABASE_URL")
    assert test_database_url, "TEST_DATABASE_URL is missing"

    engine = create_engine(test_database_url)

    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            assert result.scalar() == 1
    finally:
        engine.dispose()