import axios from "../config/axios.js";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminContext = createContext(null);
export const useAdminContext = () => useContext(AdminContext);

const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // to prevent logout on refresh
  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/admin/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("adminToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
