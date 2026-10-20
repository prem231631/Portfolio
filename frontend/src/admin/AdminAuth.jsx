
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentAdmin, loginAdmin } from "../services/api";

const AdminAuthContext = createContext(null);
const TOKEN_KEY = "portfolio_admin_token";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!token) {
        if (active) {
          setAdmin(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const currentAdmin = await getCurrentAdmin(token);

        if (active) {
          setAdmin(currentAdmin);
        }
      } catch {
        if (active) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setAdmin(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const result = await loginAdmin(email, password);

    sessionStorage.setItem(TOKEN_KEY, result.access_token);
    setToken(result.access_token);

    const currentAdmin = await getCurrentAdmin(result.access_token);
    setAdmin(currentAdmin);

    return currentAdmin;
  }, []);

  const value = {
    token,
    admin,
    loading,
    isAuthenticated: Boolean(token && admin),
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
}
