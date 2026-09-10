import axios from "../config/axios.js";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext(null);
export const useAdminContext = () => useContext(AdminContext);

const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoggedAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/admin/logged");
        setUser(response.data.admin);
      } catch (err) {
        localStorage.removeItem("adminToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLoggedAdmin();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await axios.post("/admin/login", { username, password });
      const { token, admin } = response.data;
      localStorage.setItem("adminToken", token);
      setUser(admin);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
