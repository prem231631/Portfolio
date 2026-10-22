
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CirclePlus,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  Pencil,
  RefreshCw,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import { useAdminAuth } from "../AdminAuth";
import {
  deleteProject,
  getAdminProjects,
  updateProject,
} from "../../services/api";
import "./admin-projects.css";

const FILTERS = [
  { label: "All projects", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "drafts" },
  { label: "Featured", value: "featured" },
];

export default function AdminProjects() {
  const { token } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    () => location.state?.notice || ""
  );

  const loadProjects = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const data = await getAdminProjects(token);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const message = location.state?.notice;

    if (!message) return;

    setNotice(message);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.title?.toLowerCase().includes(term) ||
        project.slug?.toLowerCase().includes(term) ||
        project.category?.toLowerCase().includes(term) ||
        project.technologies?.some((technology) =>
          technology.toLowerCase().includes(term)
        );

      const matchesFilter =
        filter === "all" ||
        (filter === "published" && project.published) ||
        (filter === "drafts" && !project.published) ||
        (filter === "featured" && project.featured);

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  async function handleQuickUpdate(project, field) {
    if (!token || updatingKey || deletingSlug) return;

    const nextValue = !project[field];
    const actionKey = `${project.slug}:${field}`;

    setUpdatingKey(actionKey);
    setError("");
    setNotice("");

    try {
      const updatedProject = await updateProject(
        token,
        project.slug,
        { [field]: nextValue }
      );

      setProjects((current) =>
        current.map((item) =>
          item.slug === project.slug
            ? { ...item, ...updatedProject }
            : item
        )
      );

      const actionLabel =
        field === "published"
          ? nextValue
            ? "published"
            : "moved to drafts"
          : nextValue
            ? "marked as featured"
            : "removed from featured";

      setNotice(`"${project.title}" was ${actionLabel} successfully.`);
    } catch (err) {
      setError(err.message || "Unable to update this project.");
    } finally {
      setUpdatingKey(null);
    }
  }

  async function handleDelete(project) {
    if (updatingKey || deletingSlug) return;

    const confirmed = window.confirm(
      `Delete "${project.title}" permanently? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingSlug(project.slug);
    setError("");
    setNotice("");

    try {
      await deleteProject(token, project.slug);

      setProjects((current) =>
        current.filter((item) => item.slug !== project.slug)
      );

      setNotice(`"${project.title}" was deleted successfully.`);
    } catch (err) {
      setError(err.message || "Unable to delete this project.");
    } finally {
      setDeletingSlug(null);
    }
  }

  const counts = {
    all: projects.length,
    published: projects.filter((project) => project.published).length,
    drafts: projects.filter((project) => !project.published).length,
    featured: projects.filter((project) => project.featured).length,
  };

  return (
    <main className="admin-projects-page">
      <header className="projects-topbar">
        <Link to="/admin" className="projects-back-link">
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="projects-portfolio-link"
        >
          View portfolio <ExternalLink size={15} />
        </a>
      </header>

      <section className="projects-content">
        <div className="projects-heading">
          <div>
            <span className="projects-eyebrow">
              <FolderKanban size={14} />
              CONTENT MANAGEMENT
            </span>

            <h1>
              Projects<span>.</span>
            </h1>

            <p>
              Manage your work, publication status, and featured projects.
            </p>
          </div>

          <Link
            to="/admin/projects/new"
            className="projects-create-button"
          >
            <CirclePlus size={17} />
            New project
          </Link>
        </div>

        <div className="projects-summary">
          <div className="projects-summary-card">
            <span>Total projects</span>
            <strong>{counts.all}</strong>
          </div>

          <div className="projects-summary-card">
            <span>Published</span>
            <strong>{counts.published}</strong>
          </div>

          <div className="projects-summary-card">
            <span>Drafts</span>
            <strong>{counts.drafts}</strong>
          </div>

          <div className="projects-summary-card">
            <span>Featured</span>
            <strong>{counts.featured}</strong>
          </div>
        </div>

        {error && (
          <div
            className="projects-message projects-message-error"
            role="alert"
          >
            <XCircle size={17} />
            <span>{error}</span>

            <button type="button" onClick={loadProjects}>
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div
            className="projects-message projects-message-success"
            role="status"
          >
            <CheckCircle2 size={17} />
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss success message"
              title="Dismiss notification"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        <section className="projects-panel">
          <div className="projects-toolbar">
            <div className="projects-search">
              <Search size={17} />

              <input
                type="search"
                aria-label="Search projects"
                placeholder="Search projects, categories, technologies..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="projects-refresh-button"
              onClick={() => {
                setNotice("");
                loadProjects();
              }}
              disabled={loading || Boolean(updatingKey) || Boolean(deletingSlug)}
              aria-label="Refresh projects"
              title="Refresh projects"
            >
              <RefreshCw
                size={16}
                className={loading ? "is-spinning" : ""}
              />
            </button>
          </div>

          <div className="projects-filters" aria-label="Filter projects">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? "active" : ""}
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
              >
                {item.label}
                <span>{counts[item.value]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="projects-empty-state">
              <span className="admin-spinner" />
              <p>Loading your projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty-state">
              <FolderKanban size={28} />

              <h2>
                {projects.length
                  ? "No matching projects"
                  : "No projects yet"}
              </h2>

              <p>
                {projects.length
                  ? "Try a different search or filter."
                  : "Create your first project to get started."}
              </p>

              {projects.length === 0 && (
                <Link
                  to="/admin/projects/new"
                  className="projects-create-button"
                >
                  <CirclePlus size={16} />
                  Create project
                </Link>
              )}
            </div>
          ) : (
            <div className="projects-table-wrap">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Order</th>
                    <th className="projects-actions-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => {
                    const isUpdating = updatingKey?.startsWith(
                      `${project.slug}:`
                    );
                    const isDeleting = deletingSlug === project.slug;
                    const isBusy = Boolean(updatingKey) || Boolean(deletingSlug);

                    return (
                      <tr key={project.id}>
                        <td>
                          <div className="projects-name-cell">
                            <div className="projects-project-icon">
                              <FolderKanban size={18} />
                            </div>

                            <div className="projects-name-details">
                              <strong>{project.title}</strong>
                              <span>/{project.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="projects-category">
                            {project.category}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`projects-status ${
                              project.published ? "published" : "draft"
                            }`}
                          >
                            {project.published ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <XCircle size={13} />
                            )}

                            {project.published ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`projects-featured ${
                              project.featured ? "is-featured" : ""
                            }`}
                          >
                            <Star
                              size={14}
                              fill={
                                project.featured ? "currentColor" : "none"
                              }
                            />

                            {project.featured ? "Featured" : "—"}
                          </span>
                        </td>

                        <td className="projects-order-cell">
                          {project.display_order}
                        </td>

                        <td>
                          <div className="projects-row-actions">
                            <button
                              type="button"
                              className="projects-icon-action"
                              onClick={() =>
                                handleQuickUpdate(project, "published")
                              }
                              disabled={isBusy || loading}
                              aria-label={
                                project.published
                                  ? `Unpublish ${project.title}`
                                  : `Publish ${project.title}`
                              }
                              title={
                                project.published
                                  ? "Move to drafts"
                                  : "Publish project"
                              }
                            >
                              {updatingKey ===
                              `${project.slug}:published` ? (
                                <RefreshCw
                                  size={16}
                                  className="is-spinning"
                                />
                              ) : project.published ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              className="projects-icon-action"
                              onClick={() =>
                                handleQuickUpdate(project, "featured")
                              }
                              disabled={isBusy || loading}
                              aria-label={
                                project.featured
                                  ? `Unfeature ${project.title}`
                                  : `Feature ${project.title}`
                              }
                              title={
                                project.featured
                                  ? "Remove featured status"
                                  : "Mark as featured"
                              }
                            >
                              {updatingKey ===
                              `${project.slug}:featured` ? (
                                <RefreshCw
                                  size={16}
                                  className="is-spinning"
                                />
                              ) : (
                                <Star
                                  size={16}
                                  fill={
                                    project.featured ? "currentColor" : "none"
                                  }
                                />
                              )}
                            </button>

                            <Link
                              to={`/admin/projects/${encodeURIComponent(
                                project.slug
                              )}/edit`}
                              className="projects-icon-action"
                              aria-label={`Edit ${project.title}`}
                              title="Edit project"
                            >
                              <Pencil size={16} />
                            </Link>

                            {project.published && (
                              <a
                                href="/#work"
                                target="_blank"
                                rel="noreferrer"
                                className="projects-icon-action"
                                aria-label={`View ${project.title} on portfolio`}
                                title="Open portfolio"
                              >
                                <ArrowUpRight size={17} />
                              </a>
                            )}

                            <button
                              type="button"
                              className="projects-icon-action projects-delete-action"
                              onClick={() => handleDelete(project)}
                              disabled={isBusy || loading}
                              aria-label={`Delete ${project.title}`}
                              title="Delete project"
                            >
                              {isDeleting ? (
                                <RefreshCw
                                  size={16}
                                  className="is-spinning"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>

                          {isUpdating && (
                            <span className="projects-action-progress">
                              Saving…
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProjects.length > 0 && (
            <footer className="projects-table-footer">
              Showing {filteredProjects.length} of {projects.length} projects
            </footer>
          )}
        </section>
      </section>
    </main>
  );
}
