import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProvider from "./context/adminContext";
import InvitationProvider from "./context/invitationContext";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Invitation from "./pages/Invitation";

function App() {
  return (
    <>
      <AdminProvider>
        <InvitationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/invite/" element={<Invitation />} />
              <Route path="/admin/" element={<AdminLogin />} />
              <Route path="/admin/panel/" element={<AdminPanel />} />
              {/* so on */}
            </Routes>
          </BrowserRouter>
        </InvitationProvider>
      </AdminProvider>
    </>
  );
}

export default App;

// Later I will use this to protect the panel
// path="/admin/panel/" element={
//     <ProtectedRoute>
//       <AdminPanel />
//     </ProtectedRoute>
//   }
