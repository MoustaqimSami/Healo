import { useState } from "react";
import { useClinicData } from "../hooks/ClinicDataProvider";
import { addDays, formatPrettyDate, toISODate } from "../utils/date";

const timeSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30"];

export function SchedulePage() {
  const clinic = useClinicData();
  const [date, setDate] = useState(new Date("2025-09-03T00:00:00"));
  const iso = toISODate(date);
  const appts = clinic.appointments.filter((a) => a.date === iso && a.status !== "cancelled");
  return (
    <main className="page"><header className="page-header"><h1 className="page-title">Schedule</h1></header><section className="page-body"><div className="schedule-wrapper"><div className="schedule-header-row"><button className="nav-btn" onClick={() => setDate(addDays(date, -1))}>‹</button><h2 className="schedule-date">{formatPrettyDate(iso)}</h2><button className="nav-btn" onClick={() => setDate(addDays(date, 1))}>›</button></div><div className="schedule-container"><div className="time-header-row">{timeSlots.map((t) => <div className="time-header" key={t}>{t}</div>)}</div><div className="schedule-grid">{appts.map((a, i) => { const col = timeSlots.indexOf(a.start) + 1; const row = (i % 8) + 1; const patient = clinic.patients.find((p) => p.id === a.patientId); const doctor = clinic.doctors.find((d) => d.id === a.doctorId); return <div key={a.id} className={`appointment ${a.type === "assessment" ? "green" : a.type === "reports" ? "yellow" : a.type === "followup" ? "blue" : a.type === "walkin" ? "grey" : "red"}`} style={{ gridColumn: col, gridRow: row }}><p className="p-name">{patient?.name}</p><small>Phone: {patient?.phone}</small><small>Doctor: {doctor?.name}</small></div>; })}</div></div></div></section></main>
  );
}
