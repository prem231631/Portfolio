
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep the fallback message if the response isn't JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Public portfolio API
export function getProjects() {
  return apiRequest("/api/projects/");
}

// Admin authentication
export async function loginAdmin(email, password) {
  const formData = new URLSearchParams();
  formData.set("username", email);
  formData.set("password", password);

  return apiRequest("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
}

export function getCurrentAdmin(token) {
  return apiRequest("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Admin project management
export function getAdminProjects(token) {
  return apiRequest("/api/admin/projects/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createProject(token, project) {
  return apiRequest("/api/admin/projects/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export function updateProject(token, slug, project) {
  return apiRequest(
    `/api/admin/projects/${encodeURIComponent(slug)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    }
  );
}

export function deleteProject(token, slug) {
  return apiRequest(
    `/api/admin/projects/${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
