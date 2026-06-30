import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClinicData } from "../hooks/ClinicDataProvider";
import { getDoctorStatusForDate } from "../utils/availability";
import { getPatientInitials } from "../utils/date";

export function DoctorsPage() {
  const clinic = useClinicData();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const patientId = params.get("patientId");
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const today = new Date("2025-09-03T00:00:00");

  const specialties = [...new Set(clinic.doctors.map((d) => d.specialty))].sort();
  const filtered = useMemo(() => clinic.doctors.filter((d) => {
    if (query && !`${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (specialty && d.specialty !== specialty) return false;
    if (gender && d.gender !== gender) return false;
    if (status && getDoctorStatusForDate(d, today, clinic.appointments).key !== status) return false;
    return true;
  }), [clinic.doctors, clinic.appointments, query, specialty, gender, status]);

  function go(doctorId: string) {
    navigate(`/doctors/${doctorId}/schedule${patientId ? `?patientId=${patientId}` : ""}`);
  }

  return (
    <main className="page">
      <header className="page-header"><h1 className="page-title">Doctors</h1></header>
      <div className="search-box">
        <div className="search-wrapper"><input className="search-input" placeholder="Search doctors..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <select className="filter-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}><option value="">All specialties</option>{specialties.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="filter-select" value={gender} onChange={(e) => setGender(e.target.value)}><option value="">All genders</option><option>Male</option><option>Female</option></select>
        <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any status</option><option value="available">Available today</option><option value="busy">In appointment</option><option value="booked">Fully booked</option><option value="out">Out of office</option></select>
      </div>
      <section className="doctors-list">
        {Array.from({ length: Math.ceil(filtered.length / 3) }, (_, rowIdx) => filtered.slice(rowIdx * 3, rowIdx * 3 + 3)).map((row, idx) => <div className="doctors-list-row" key={idx}>{row.map((doc) => {
          const docStatus = getDoctorStatusForDate(doc, today, clinic.appointments);
          return <button key={doc.id} className="doctor-profile-card" onClick={() => go(doc.id)}><div className="doctor-profile-card-content"><div className="flexrow-gap8"><div className="avatar avatar--medium">{getPatientInitials(doc.name.replace("Dr. ", ""))}</div><div className="doctor-profile-card-details"><p className="doctor-profile-card-name">{doc.name}</p><div className="doctor-profile-card-tag">{doc.specialty}</div></div></div><div className="doctor-profile-card-availability"><div className={`availability-card-tag ${docStatus.tagClass}`}>{docStatus.tagText}</div>{docStatus.showTime && <p className="availability-card-time">Available at: {docStatus.timeText}</p>}</div></div><div className="doctor-profile-card-action"><span className="btn btn--txt">View Schedule ›</span></div></button>;
        })}</div>)}
      </section>
    </main>
  );
}
