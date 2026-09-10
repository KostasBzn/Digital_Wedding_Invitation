import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminContext } from "../context/AdminContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAdminContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-bg">
        <Loader2 size={28} className="animate-spin text-admin-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}

export default ProtectedRoute;
