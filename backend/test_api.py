
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import get_db


@pytest.fixture
def mock_db():
    """Provide a mock database without changing real records."""
    db = MagicMock()
    db.scalars.return_value.all.return_value = []
    db.scalar.return_value = None

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client, db

    app.dependency_overrides.clear()


def test_health_endpoint(mock_db):
    client, _ = mock_db

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_public_projects_returns_empty_list(mock_db):
    client, db = mock_db

    response = client.get("/api/projects/")

    assert response.status_code == 200
    assert response.json() == []

    # Confirm the endpoint queries only published projects.
    statement = str(db.scalars.call_args.args[0]).lower()
    assert "published" in statement


def test_missing_project_returns_404(mock_db):
    client, _ = mock_db

    response = client.get("/api/projects/nonexistent-project")

    assert response.status_code == 404


def test_admin_projects_rejects_unauthenticated_request(mock_db):
    client, _ = mock_db

    response = client.get("/api/admin/projects/")

    assert response.status_code in (401, 403)
