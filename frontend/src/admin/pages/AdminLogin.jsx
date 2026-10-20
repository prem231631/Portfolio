
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../AdminAuth";
import "./admin.css";

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="admin-loading">
        <span className="admin-spinner" />
        <p>Verifying administrator session...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <a href="/" className="admin-login-back">
        <ArrowLeft size={16} />
        <span>Back to portfolio</span>
      </a>

      <section className="admin-login-shell">
        <div className="admin-login-brand">
          <div className="admin-brand-mark">P.</div>
          <span>PORTFOLIO / MANAGEMENT</span>
        </div>

        <div className="admin-login-heading">
          <div className="admin-login-icon">
            <LockKeyhole size={22} strokeWidth={1.7} />
          </div>

          <p className="admin-eyebrow">RESTRICTED ACCESS</p>
          <h1>Welcome <span>back.</span></h1>
          <p className="admin-login-description">
            Sign in to manage your projects and keep your portfolio up to date.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Administrator email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={submitting}
          />

          <div className="admin-password-label">
            <label htmlFor="admin-password">Password</label>
          </div>

          <div className="admin-password-input">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={submitting}
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={submitting}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={submitting}
          >
            <span>{submitting ? "Signing in..." : "Sign in securely"}</span>
            {!submitting && <ArrowRight size={17} />}
          </button>
        </form>

        <div className="admin-login-security">
          <ShieldCheck size={17} />
          <span>Protected administrator access</span>
        </div>
      </section>

      <footer className="admin-login-footer">
        <span>PERSONAL PORTFOLIO</span>
        <span>ADMINISTRATION · SECURE AREA</span>
      </footer>
    </main>
  );
}
