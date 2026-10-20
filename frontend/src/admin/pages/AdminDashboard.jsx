
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  FolderKanban,
  Globe,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getAdminProjects } from "../../services/api";
import { useAdminAuth } from "../AdminAuth";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const { token, admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminProjects(token);
      setProjects(data);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const publishedCount = projects.filter(
    (project) => project.published
  ).length;

  const featuredCount = projects.filter(
    (project) => project.featured
  ).length;

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/admin" className="dashboard-brand">
          <span className="dashboard-brand-mark">P.</span>
          <span>
            <strong>Portfolio</strong>
            <small>CONTROL CENTER</small>
          </span>
        </Link>

        <div className="dashboard-nav-label">WORKSPACE</div>

        <nav className="dashboard-nav">
          <Link to="/admin" className="dashboard-nav-link active">
            <FolderKanban size={17} />
            <span>Overview</span>
          </Link>

          <Link to="/admin/projects" className="dashboard-nav-link">
            <Globe size={17} />
            <span>Projects</span>
            <span className="dashboard-nav-count">{projects.length}</span>
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-admin-profile">
            <div className="dashboard-avatar">
              {(admin?.email?.[0] || "A").toUpperCase()}
            </div>
            <div className="dashboard-admin-details">
              <strong>Administrator</strong>
              <span>{admin?.email || "Signed in"}</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <section className="admin-dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
            <span>Workspace</span>
            <ArrowDownRight size={14} />
            <strong>Overview</strong>
          </div>

          <div className="dashboard-topbar-actions">
            <span className="dashboard-secure-status">
              <ShieldCheck size={15} />
              Secure session
            </span>

            <a
              className="dashboard-view-site"
              href="/"
              target="_blank"
              rel="noreferrer"
            >
              View portfolio <ExternalLink size={14} />
            </a>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">YOUR WORKSPACE / 01</p>
              <h1>Good to have you <span>back.</span></h1>
              <p className="dashboard-welcome-description">
                Manage your work, control what visitors see, and keep your
                portfolio current.
              </p>
            </div>

            <Link
              to="/admin/projects/new"
              className="dashboard-primary-button"
            >
              <Plus size={17} />
              New project
              <ArrowUpRight size={15} />
            </Link>
          </section>

          {error && (
            <div className="dashboard-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={loadProjects}>
                Try again
              </button>
            </div>
          )}

          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>Total projects</span>
                <FolderKanban size={18} />
              </div>
              <strong>{loading ? "—" : projects.length}</strong>
              <p>Projects in your database</p>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>Published</span>
                <Globe size={18} />
              </div>
              <strong>{loading ? "—" : publishedCount}</strong>
              <p>Visible on your public portfolio</p>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>Featured</span>
                <Star size={18} />
              </div>
              <strong>{loading ? "—" : featuredCount}</strong>
              <p>Marked as featured projects</p>
            </article>
          </section>

          <section className="dashboard-project-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">CONTENT MANAGEMENT</p>
                <h2>Your projects</h2>
              </div>

              <button
                type="button"
                className="dashboard-refresh-button"
                onClick={loadProjects}
                disabled={loading}
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            <div className="dashboard-project-list">
              {loading ? (
                <div className="dashboard-empty-state">
                  <span className="admin-spinner" />
                  <p>Loading your projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="dashboard-empty-state">
                  <FolderKanban size={25} />
                  <h3>No projects yet</h3>
                  <p>Your new projects will appear here.</p>
                  <Link to="/admin/projects/new">
                    Create your first project
                  </Link>
                </div>
              ) : (
                projects.map((project) => (
                  <article
                    className="dashboard-project-row"
                    key={project.id}
                  >
                    <div className="dashboard-project-icon">
                      <FolderKanban size={19} />
                    </div>

                    <div className="dashboard-project-info">
                      <h3>{project.title}</h3>
                      <p>
                        {project.category} · /{project.slug}
                      </p>
                    </div>

                    <div className="dashboard-project-status">
                      <span
                        className={
                          project.published
                            ? "dashboard-status published"
                            : "dashboard-status draft"
                        }
                      >
                        <span />
                        {project.published ? "Published" : "Draft"}
                      </span>

                      {project.featured && (
                        <span className="dashboard-featured-tag">
                          <Star size={12} />
                          Featured
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/admin/projects/${encodeURIComponent(project.slug)}/edit`}
                      className="dashboard-edit-link"
                      aria-label={`Edit ${project.title}`}
                    >
                      Edit <ArrowUpRight size={14} />
                    </Link>
                  </article>
                ))
              )}
            </div>

            {!loading && projects.length > 0 && (
              <Link
                to="/admin/projects"
                className="dashboard-all-projects"
              >
                Manage all projects <ArrowUpRight size={15} />
              </Link>
            )}
          </section>

          <footer className="dashboard-footer">
            <span>PORTFOLIO ADMINISTRATION</span>
            <span>CONTENT · PROJECTS · PUBLISHING</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
