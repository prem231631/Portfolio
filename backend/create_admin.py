
from getpass import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin_user import AdminUser


def main() -> None:
    email = input("Admin email: ").strip().lower()

    if not email or "@" not in email:
        print("Please enter a valid email address.")
        return

    password = getpass("Admin password (minimum 12 characters): ")
    confirm_password = getpass("Confirm admin password: ")

    if len(password) < 12:
        print("Password must contain at least 12 characters.")
        return

    if password != confirm_password:
        print("Passwords do not match.")
        return

    with SessionLocal() as db:
        existing_admin = db.scalar(
            select(AdminUser).where(AdminUser.email == email)
        )

        if existing_admin is not None:
            print("An admin account with this email already exists.")
            return

        admin = AdminUser(
            email=email,
            hashed_password=hash_password(password),
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print(f"Admin account created successfully for {email}.")


if __name__ == "__main__":
    main()
