
from sqlalchemy import text

from app.db.session import engine


def main():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1")).scalar_one()
            print(f"Database connection successful: {result}")
    except Exception as exc:
        print(f"Database connection failed: {exc}")
        raise


if __name__ == "__main__":
    main()
