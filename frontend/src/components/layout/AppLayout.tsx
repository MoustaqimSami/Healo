import { Navigate, Outlet } from "react-router-dom";
import { useClinicData } from "../../hooks/ClinicDataProvider";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const { currentStaff } = useClinicData();
  if (!currentStaff) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}
