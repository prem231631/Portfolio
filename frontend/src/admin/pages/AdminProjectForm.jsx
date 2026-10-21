
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Image,
  LoaderCircle,
  Save,
} from "lucide-react";

import { useAdminAuth } from "../AdminAuth";
import {
  createProject,
  getAdminProjects,
  updateProject,
} from "../../services/api";
import "./admin-project-form.css";

const EMPTY_FORM = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category: "",
  thumbnail_url: "",
  live_url: "",
  repository_url: "",
  technologies: "",
  featured: false,
  published: false,
  display_order: 0,
};

function toFormValues(project) {
  return {
    title: project.title ?? "",
    slug: project.slug ?? "",
    short_description: project.short_description ?? "",
    description: project.description ?? "",
    category: project.category ?? "",
    thumbnail_url: project.thumbnail_url ?? "",
    live_url: project.live_url ?? "",
    repository_url: project.repository_url ?? "",
    technologies: Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : "",
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    display_order: project.display_order ?? 0,
  };
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  return trimmed || null;
}

export default function AdminProjectForm({ mode = "create" }) {
  const isEditing = mode === "edit";
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProject = useCallback(async () => {
    if (!isEditing || !token || !routeSlug) {
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    setError("");

    try {
      const projects = await getAdminProjects(token);
      const project = projects.find((item) => item.slug === routeSlug);

      if (!project) {
        setError("This project could not be found.");
        return;
      }

      setForm(toFormValues(project));
    } catch (err) {
      setError(err.message || "Unable to load this project.");
    } finally {
      setInitialLoading(false);
    }
  }, [isEditing, routeSlug, token]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setForm((current) => {
      const previousGeneratedSlug = current.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const shouldGenerateSlug =
        !isEditing &&
        (!current.slug ||
          current.slug === previousGeneratedSlug);

      return {
        ...current,
        title,
        ...(shouldGenerateSlug
          ? {
              slug: title
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
            }
          : {}),
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const title = form.title.trim();
    const slug = form.slug.trim();
    const shortDescription = form.short_description.trim();
    const category = form.category.trim();

    if (!title || !slug || !shortDescription || !category) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "The slug must contain lowercase letters, numbers, and single hyphens only."
      );
      return;
    }

    const technologies = form.technologies
      .split(/[,\n]/)
      .map((technology) => technology.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      short_description: shortDescription,
      description: form.description.trim() || null,
      category,
      thumbnail_url: normalizeUrl(form.thumbnail_url),
      live_url: normalizeUrl(form.live_url),
      repository_url: normalizeUrl(form.repository_url),
      technologies,
      featured: form.featured,
      published: form.published,
      display_order: Number(form.display_order),
    };

    if (
      !Number.isInteger(payload.display_order) ||
      payload.display_order < 0
    ) {
      setError("Display order must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        await updateProject(token, routeSlug, payload);
        setNotice("Project updated successfully.");
      } else {
        await createProject(token, payload);
        setNotice("Project created successfully.");
      }

      navigate("/admin/projects", {
        replace: true,
        state: {
          notice: isEditing
            ? `"${title}" was updated successfully.`
            : `"${title}" was created successfully.`,
        },
      });
    } catch (err) {
      setError(err.message || "Unable to save this project.");
    } finally {
      setSaving(false);
    }
  }

  if (initialLoading) {
    return (
      <main className="project-form-loading">
        <LoaderCircle size={24} className="project-form-spinner" />
        <p>Loading project details...</p>
      </main>
    );
  }

  return (
    <main className="admin-project-form-page">
      <header className="project-form-topbar">
        <Link to="/admin/projects" className="project-form-back">
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <a href="/" target="_blank" rel="noreferrer">
          View portfolio <ExternalLink size={14} />
        </a>
      </header>

      <div className="project-form-content">
        <div className="project-form-heading">
          <span className="project-form-eyebrow">PROJECT MANAGEMENT</span>
          <h1>{isEditing ? "Edit project" : "New project"}<span>.</span></h1>
          <p>
            {isEditing
              ? "Refine the details and update your portfolio entry."
              : "Add a project to your portfolio from one place."}
          </p>
        </div>

        {error && (
          <div className="project-form-alert" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="project-form-notice" role="status">
            <CheckCircle2 size={16} />
            {notice}
          </div>
        )}

        <form className="project-form" onSubmit={handleSubmit}>
          <section className="project-form-section">
            <div className="project-form-section-heading">
              <span>01</span>
              <div>
                <h2>Project details</h2>
                <p>The core information visitors will see.</p>
              </div>
            </div>

            <div className="project-form-grid">
              <label className="project-form-field">
                <span>Project title <b>*</b></span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  maxLength={150}
                  placeholder="e.g. Developer Portfolio"
                  required
                />
              </label>

              <label className="project-form-field">
                <span>URL slug <b>*</b></span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  maxLength={180}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  title="Use lowercase letters, numbers, and single hyphens."
                  placeholder="developer-portfolio"
                  required
                />
                <small>Lowercase letters and hyphens, no spaces.</small>
              </label>

              <label className="project-form-field">
                <span>Category <b>*</b></span>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="e.g. Full-Stack Development"
                  required
                />
              </label>

              <label className="project-form-field">
                <span>Display order</span>
                <input
                  name="display_order"
                  type="number"
                  min="0"
                  step="1"
                  value={form.display_order}
                  onChange={handleChange}
                />
                <small>Lower numbers appear earlier in ordered lists.</small>
              </label>

              <label className="project-form-field project-form-field-full">
                <span>Short description <b>*</b></span>
                <textarea
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  maxLength={300}
                  rows={3}
                  placeholder="A concise summary of what the project does."
                  required
                />
                <small>{form.short_description.length}/300 characters</small>
              </label>

              <label className="project-form-field project-form-field-full">
                <span>Full description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the purpose, features, architecture, and your contribution."
                />
              </label>
            </div>
          </section>

          <section className="project-form-section">
            <div className="project-form-section-heading">
              <span>02</span>
              <div>
                <h2>Links and media</h2>
                <p>Connect visitors with your project and its source code.</p>
              </div>
            </div>

            <div className="project-form-grid">
              <label className="project-form-field project-form-field-full">
                <span><Image size={14} /> Thumbnail image URL</span>
                <input
                  name="thumbnail_url"
                  type="url"
                  value={form.thumbnail_url}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://example.com/project-image.webp"
                />
                <small>Optional. Use a publicly accessible image URL.</small>
              </label>

              {form.thumbnail_url.trim() && (
                <div className="project-form-preview">
                  <span>Image preview</span>
                  <img
                    src={form.thumbnail_url}
                    alt="Project thumbnail preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

              <label className="project-form-field">
                <span>Live demo URL</span>
                <input
                  name="live_url"
                  type="url"
                  value={form.live_url}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://your-project.example"
                />
              </label>

              <label className="project-form-field">
                <span>Repository URL</span>
                <input
                  name="repository_url"
                  type="url"
                  value={form.repository_url}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://github.com/username/project"
                />
              </label>
            </div>
          </section>

          <section className="project-form-section">
            <div className="project-form-section-heading">
              <span>03</span>
              <div>
                <h2>Technologies</h2>
                <p>List the languages, frameworks, and tools used.</p>
              </div>
            </div>

            <label className="project-form-field">
              <span>Technology stack</span>
              <textarea
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                rows={3}
                placeholder={"React, FastAPI, PostgreSQL, Docker"}
              />
              <small>Separate technologies with commas or new lines.</small>
            </label>
          </section>

          <section className="project-form-section">
            <div className="project-form-section-heading">
              <span>04</span>
              <div>
                <h2>Visibility</h2>
                <p>Choose how this project is presented on your portfolio.</p>
              </div>
            </div>

            <div className="project-form-toggles">
              <label className="project-form-toggle">
                <input
                  type="checkbox"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                />
                <span className="project-form-toggle-indicator" />
                <span className="project-form-toggle-copy">
                  <strong>Publish project</strong>
                  <small>
                    Published projects can appear on the public portfolio.
                  </small>
                </span>
              </label>

              <label className="project-form-toggle">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <span className="project-form-toggle-indicator" />
                <span className="project-form-toggle-copy">
                  <strong>Feature project</strong>
                  <small>
                    Mark this project as featured for the portfolio layout.
                  </small>
                </span>
              </label>
            </div>
          </section>

          <footer className="project-form-actions">
            <Link to="/admin/projects" className="project-form-cancel">
              Cancel
            </Link>

            <button
              type="submit"
              className="project-form-submit"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle size={16} className="project-form-spinner" />
              ) : (
                <Save size={16} />
              )}
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create project"}
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
}
