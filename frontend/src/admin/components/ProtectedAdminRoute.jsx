
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../AdminAuth";

export default function ProtectedAdminRoute() {
  const { loading, isAuthenticated } = useAdminAuth();

  if (loading) {
    return (
      <main className="admin-loading">
        <span className="admin-spinner" />
        <p>Verifying administrator access...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
