import { NavLink } from "react-router-dom";
import { CalendarDays, Home, LogOut, Stethoscope, Users, HelpCircle } from "lucide-react";
import { useClinicData } from "../../hooks/ClinicDataProvider";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope }
];

export function Sidebar() {
  const { logout } = useClinicData();
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <NavLink to="/dashboard" className="brand-button" aria-label="Healo home">
            <img src="/assets/icons/logo.svg" alt="Healo logo" className="brand-logo" />
          </NavLink>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
              <Icon className="nav-icon-react" size={24} />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item nav-button" type="button">
            <HelpCircle className="nav-icon-react" size={24} />
            <span className="nav-label">Help center</span>
          </button>
          <button className="nav-item nav-button" type="button" onClick={logout}>
            <LogOut className="nav-icon-react" size={24} />
            <span className="nav-label">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
