
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.session import get_db
from app.models.admin_user import AdminUser
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(
    prefix="/api/admin/projects",
    tags=["Admin Projects"],
    dependencies=[Depends(get_current_admin)],
)


@router.get("/", response_model=list[ProjectResponse])
def list_all_projects(
    db: Annotated[Session, Depends(get_db)],
):
    statement = select(Project).order_by(
        Project.display_order.asc(),
        Project.id.asc(),
    )
    return db.scalars(statement).all()


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[AdminUser, Depends(get_current_admin)],
):
    existing_project = db.scalar(
        select(Project).where(Project.slug == project_data.slug)
    )
    if existing_project is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A project with this slug already exists",
        )

    project = Project(**project_data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{slug}", response_model=ProjectResponse)
def get_admin_project(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
):
    project = db.scalar(select(Project).where(Project.slug == slug))
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{slug}", response_model=ProjectResponse)
def update_project(
    slug: str,
    project_data: ProjectUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    project = db.scalar(select(Project).where(Project.slug == slug))
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    changes = project_data.model_dump(exclude_unset=True)
    new_slug = changes.get("slug")

    if new_slug and new_slug != project.slug:
        duplicate = db.scalar(
            select(Project).where(Project.slug == new_slug)
        )
        if duplicate is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A project with this slug already exists",
            )

    for field, value in changes.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
):
    project = db.scalar(select(Project).where(Project.slug == slug))
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
