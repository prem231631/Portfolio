
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    statement = (
        select(Project)
        .where(Project.published.is_(True))
        .order_by(Project.display_order.asc(), Project.id.asc())
    )
    return db.scalars(statement).all()


@router.get("/{slug}", response_model=ProjectResponse)
def get_project(slug: str, db: Session = Depends(get_db)):
    statement = select(Project).where(
        Project.slug == slug,
        Project.published.is_(True),
    )
    project = db.scalar(statement)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
