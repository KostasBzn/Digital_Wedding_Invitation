import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProvider from "./context/AdminContext";
import GuestProvider from "./context/GuestContext";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <AdminProvider>
        <GuestProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Invitation />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/admin/panel"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              {/* so on */}
            </Routes>
          </BrowserRouter>
        </GuestProvider>
      </AdminProvider>
    </>
  );
}

export default App;
