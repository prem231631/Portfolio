
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import ALGORITHM
from app.db.session import get_db
from app.models.admin_user import AdminUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> AdminUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject:
            raise unauthorized

        admin_id = int(subject)
    except (InvalidTokenError, ValueError, TypeError):
        raise unauthorized

    admin = db.scalar(
        select(AdminUser).where(
            AdminUser.id == admin_id,
            AdminUser.is_active.is_(True),
        )
    )

    if admin is None:
        raise unauthorized

    return admin
