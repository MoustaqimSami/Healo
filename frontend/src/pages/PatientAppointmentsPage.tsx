import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";
import { useClinicData, usePatient } from "../hooks/ClinicDataProvider";
import { formatPrettyDate, parseISODateToLocal } from "../utils/date";

export function PatientAppointmentsPage() {
  const { patientId } = useParams();
  const patient = usePatient(patientId);
  const clinic = useClinicData();
  const navigate = useNavigate();
  if (!patient) return null;
  const appts = clinic.appointments.filter((a) => a.patientId === patient.id).sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(a.start));
  const cutoff = parseISODateToLocal("2025-09-03");
  return (
    <main className="page">
      <header className="page-header page-header--column"><div className="page-nav"><NavLink className="page-title page-title--outer" to="/patients">Patients /</NavLink><p className="page-title page-title--inner">{patient.name}</p></div><h1 className="page-title">{patient.name}</h1></header>
      <section className="page-body page-body--innerpage auto-height">
        <aside className="inner-sidebar"><nav className="inner-sidebar-nav"><NavLink className="inner-nav-item" to={`/patients/${patient.id}/profile`}>Profile</NavLink><NavLink className="inner-nav-item inner-nav-item-active" to={`/patients/${patient.id}/appointments`}>Appointments</NavLink><NavLink className="inner-nav-item" to={`/patients/${patient.id}/billing`}>Billing</NavLink></nav></aside>
        <div className="main main--innerpage flexcol-gap24">
          <div className="page-header page-header--twoitems"><h2 className="body-xl-semibold">Appointments</h2><button className="btn" onClick={() => navigate(`/doctors/doc-1/schedule?open=book&patientId=${patient.id}`)}>Book a new appointment</button></div>
          <table className="table"><thead><tr className="table-header"><th>Date</th><th>Doctor</th><th>Type</th><th>Status</th><th /></tr></thead><tbody>{appts.map((appt) => {
            const doctor = clinic.doctors.find((d) => d.id === appt.doctorId);
            const status = appt.status === "cancelled" ? "Cancelled" : parseISODateToLocal(appt.date) < cutoff || appt.status === "completed" ? "Completed" : "Upcoming";
            return <tr className="table-row" key={appt.id}><td>{formatPrettyDate(appt.date)}</td><td>{doctor?.name}</td><td>{appt.type}</td><td>{status}</td><td><button className="icon-only" onClick={() => navigate(`/doctors/${appt.doctorId}/schedule?appointmentId=${appt.id}&patientId=${patient.id}`)}><Eye size={20} /></button></td></tr>;
          })}</tbody></table>
        </div>
      </section>
    </main>
  );
}
