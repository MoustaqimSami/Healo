import { Bell, UserRound } from "lucide-react";
import { useClinicData } from "../../hooks/ClinicDataProvider";

export function Topbar() {
  const { currentStaff } = useClinicData();
  const staff = currentStaff ?? { name: "Selena Doe", roleLabel: "Front Desk Staff" };
  return (
    <header className="topbar">
      <div className="topbar-left" />
      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications"><Bell size={22} /></button>
        <div className="user-chip">
          <div className="avatar-circle"><UserRound size={22} /></div>
          <div className="user-meta">
            <span className="user-name">{staff.name}</span>
            <span className="user-role">{staff.roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
