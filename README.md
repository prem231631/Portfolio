# Developer Portfolio

A full-stack developer portfolio built with **React, FastAPI, and PostgreSQL**, featuring database-driven portfolio content and a secure admin dashboard for project management.

The application is containerized with Docker Compose, making it easier to run the frontend, backend, and database together in a consistent local environment.

## Overview

The portfolio showcases software development projects and professional information through a responsive web interface. Portfolio data is served by a REST API and stored in PostgreSQL rather than being managed entirely through hardcoded frontend content.

### Features

- **Responsive portfolio website** for showcasing projects and developer information.
- **Database-driven projects** retrieved from the backend API.
- **Admin authentication** using token-based authentication.
- **Project management dashboard** for creating, updating, viewing, and deleting projects.
- **FastAPI REST API** for portfolio data and administrative operations.
- **PostgreSQL database** for persistent application data.
- **Alembic migrations** for database schema versioning.
- **Docker Compose** for running the application services together.
- **Nginx reverse proxy** for serving the production frontend and forwarding API requests.
- **Health checks** for monitoring container availability.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| UI and icons | CSS, Lucide React |
| Backend | Python, FastAPI, Uvicorn |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Database migrations | Alembic |
| Authentication | JWT, password hashing with Argon2 |
| Frontend web server | Nginx |
| Containerization | Docker, Docker Compose |
| API documentation | OpenAPI, Swagger UI |

## Architecture

```text
Browser
   |
   v
React Frontend + Nginx
   |
   |  /api/*
   v
FastAPI Backend
   |
   v
PostgreSQL Database
   |
   +-- Projects
   +-- Profile
   +-- Education
   +-- Experience
   +-- Skills
   +-- Admin Users
```

In the Docker setup, Nginx serves the compiled frontend and proxies `/api/` requests to the FastAPI backend. The backend communicates with PostgreSQL over the internal Docker network.

## Portfolio Projects

The portfolio currently includes the following projects:

| Project | Description |
|---|---|
| HIMORA LIFESTYLE | Full-stack e-commerce platform |
| EV Charging Station | Electric vehicle charging station application |
| NEPSE AI Web Application | Stock market-related web application |

Project details are stored in the database and retrieved through the portfolio API.

## Getting Started with Docker

### Prerequisites

Install the following tools before starting:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/), if you plan to clone the repository
- A modern web browser

Ensure Docker Desktop is running before executing Docker commands.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

Replace the placeholders with your actual GitHub repository URL and directory name.

Alternatively, open PowerShell in your existing project directory.

### 2. Configure environment variables

The backend requires a `.env` file at:

```text
backend/.env
```

Use your existing working environment file as the starting point. Do not commit `.env` files or expose database passwords, JWT signing keys, or other secrets.

The Docker Compose configuration supplies the database connection URL and frontend origin for the containerized environment. Ensure your backend settings support these environment-variable overrides.

For production deployments, use strong, unique credentials and a securely managed secret key.

### 3. Build and start the application

From the directory containing `docker-compose.yml`, run:

```powershell
docker compose config --quiet
docker compose up -d --build
```

Docker Compose builds the frontend and backend images, starts PostgreSQL, and starts the application services once their dependencies are healthy.

### 4. Check container status

```powershell
docker compose ps
```

View the application logs:

```powershell
docker compose logs -f
```

To inspect an individual service:

```powershell
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

Press `Ctrl+C` to stop following the logs.

### 5. Open the application

With the current local Docker Compose configuration:

| Service | URL |
|---|---|
| Portfolio website | http://localhost:8081 |
| API health check | http://localhost:8002/api/health |
| API root | http://localhost:8002/ |
| Swagger UI through Nginx | http://localhost:8081/docs |
| OpenAPI schema through Nginx | http://localhost:8081/openapi.json |

The PostgreSQL service is exposed on host port `5435` for local database tools. The backend and frontend communicate over the internal Docker network.

### 6. Stop the application

Stop the running containers without removing the database volume:

```powershell
docker compose down
```

Start them again later with:

```powershell
docker compose up -d
```

To rebuild after making code or dependency changes:

```powershell
docker compose up -d --build
```

**Database preservation:** The PostgreSQL database uses a named Docker volume. Do not use `docker compose down -v` unless you intentionally want to remove the associated Compose-managed volumes. Always back up important data before making database or volume changes.

## Local Development Without Docker

Docker is the recommended way to run the complete stack. You can also run the frontend and backend separately when developing.

### Backend

From the `backend` directory, create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configure `backend/.env` with a valid database connection URL and the required application settings.

Start the API:

```powershell
uvicorn app.main:app --reload
```

The backend normally runs at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Frontend

In a separate terminal:

```powershell
cd frontend
npm ci
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

The frontend API base URL can be configured using `VITE_API_BASE_URL`. When running outside Docker, it should point to the local backend, for example:

```text
http://127.0.0.1:8000
```

Vite environment variables are embedded into the frontend at build time. Do not put private credentials in frontend environment variables.

## API Endpoints

The following endpoints are provided by the application. Exact request schemas and response details are available in the OpenAPI documentation.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API root status |
| GET | `/api/health` | Health check |
| GET | `/api/projects/` | Retrieve published portfolio projects |
| POST | `/api/auth/login` | Authenticate an admin |
| GET | `/api/auth/me` | Retrieve the authenticated admin |
| GET | `/api/admin/projects/` | List projects for the admin |
| POST | `/api/admin/projects/` | Create a project |
| PATCH | `/api/admin/projects/{slug}` | Update a project |
| DELETE | `/api/admin/projects/{slug}` | Delete a project |

Administrative endpoints require valid authentication. Refer to the API documentation for the required request fields and authentication format.

## Database and Migrations

PostgreSQL stores the portfolio content and administrative account data. SQLAlchemy is used for database operations, while Alembic tracks schema changes.

Migration files are located in:

```text
backend/migrations/versions/
```

Review the current database configuration and migration history before applying migrations:

```powershell
cd backend
alembic current
alembic history
```

Apply pending migrations only when appropriate for the target database:

```powershell
alembic upgrade head
```

Back up the database before applying migrations to an existing or production database. Never assume that a new or existing database can safely be reset.

## Environment and Security

- Keep `.env` files and credentials out of version control.
- Use a strong, unique secret key for token signing.
- Use unique database credentials in production.
- Configure allowed frontend origins for the intended deployment.
- Keep dependencies updated and review security advisories.
- Restrict database access to trusted networks.
- Use HTTPS when deploying publicly.
- Never expose administrative credentials or private environment variables in frontend code.
- Back up persistent database data regularly.

The included Docker Compose configuration is intended for local development and verification. Before public deployment, review its credentials, exposed ports, environment settings, database access, HTTPS configuration, and operational requirements.

## Project Structure

```text
Developer Portfolio/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── ...
│   ├── migrations/
│   │   └── versions/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── package.json
├── docker-compose.yml
└── README.md
```

Some directories and files may vary as the project evolves.

## Troubleshooting

### A container is unhealthy

Inspect the service status and logs:

```powershell
docker compose ps
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

### The API cannot connect to PostgreSQL

Check that the database container is healthy and that the backend uses the Docker service hostname `db` and internal port `5432` for its database connection.

Inside Docker, `localhost` refers to the current container, not the PostgreSQL container.

### The frontend cannot reach the API

Confirm that the frontend was built with the expected API base URL and that Nginx proxies `/api/` to `http://backend:8000`.

After changing build-time frontend environment variables, rebuild the frontend:

```powershell
docker compose up -d --build frontend
```

### Portfolio projects are missing

Confirm that the backend is connected to the intended database and that the expected project records exist. Verify the active Docker volume before attempting database initialization or migrations.

Do not remove volumes or recreate the database as a troubleshooting shortcut.

## Future Improvements

Potential improvements include:

- Automated backend and frontend testing
- GitHub Actions CI/CD
- Improved deployment automation
- Automated database backups
- Production monitoring and structured logging
- Further accessibility and performance improvements

## Author

**Prem Raj Chaudhary**

Software Engineering student interested in full-stack development and building practical software applications.

- GitHub: [@prem231631](https://github.com/prem231631/Portfolio)

---

Built with React, FastAPI, PostgreSQL, and Docker.
