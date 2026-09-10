import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, User } from "lucide-react";
import { useAdminContext } from "../context/AdminContext";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useAdminContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/admin/panel");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm bg-admin-surface border border-admin-border rounded-2xl p-8">
        <h1 className="text-admin-text text-2xl font-semibold text-center mb-1">
          Admin Login
        </h1>
        <p className="text-admin-text-muted text-sm text-center mb-6">
          Sign in to manage the guest list
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-admin-text-muted text-sm mb-1 block">
              Username
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-admin-bg border border-admin-border text-admin-text rounded-lg py-2.5 pl-10 pr-3 outline-none focus:border-admin-accent transition-colors"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="text-admin-text-muted text-sm mb-1 block">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-admin-bg border border-admin-border text-admin-text rounded-lg py-2.5 pl-10 pr-3 outline-none focus:border-admin-accent transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <p className="text-admin-danger text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-admin-accent text-admin-bg font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
