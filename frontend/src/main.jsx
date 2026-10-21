
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { AdminAuthProvider } from "./admin/AdminAuth";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProjects from "./admin/pages/AdminProjects.jsx";


function ApplicationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <ApplicationRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
