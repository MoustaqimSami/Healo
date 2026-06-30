import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useClinicData } from "../hooks/ClinicDataProvider";
import type { Gender } from "../types/domain";

export function PatientsPage() {
  const clinic = useClinicData();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(params.get("open") === "addPatient");
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const patients = useMemo(() => {
    return clinic.patients
      .filter((p) => !gender || p.gender === gender)
      .filter((p) => `${p.name} ${p.phone} ${p.dob} ${p.extendedInfo.healthcareNumber}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sortBy === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  }, [clinic.patients, gender, query, sortBy]);

  function submitPatient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const patient = clinic.addPatient({
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      dateOfBirth: String(form.get("dateOfBirth") || ""),
      gender: String(form.get("gender") || "Other") as Gender,
      phoneNumber: String(form.get("phoneNumber") || ""),
      address: String(form.get("address") || ""),
      emergencyContact: String(form.get("emergencyContact") || ""),
      emergencyPhone: String(form.get("emergencyPhone") || ""),
      healthcareNumber: String(form.get("healthcareNumber") || ""),
      familyDoctor: String(form.get("familyDoctor") || ""),
      referredBy: String(form.get("referredBy") || ""),
      otherInsurance: String(form.get("otherInsurance") || "N/A")
    });
    navigate(`/patients/${patient.id}/profile`);
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">Patients</h1>
        <button className="new-pat-btn" onClick={() => setIsModalOpen(true)}><UserPlus size={20} /> Add Patient</button>
      </header>
      <section className="page-body">
        <div className="search-box">
          <div className="search-wrapper"><input className="search-input" placeholder="Search patients (name, phone, DOB, AHS)..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <select className="filter-select" value={gender} onChange={(e) => setGender(e.target.value)}><option value="">All genders</option><option>Male</option><option>Female</option><option>Other</option></select>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="name-asc">Name (A–Z)</option><option value="name-desc">Name (Z–A)</option></select>
        </div>
        <table className="table patient-table">
          <thead><tr className="table-header"><th>First Name</th><th>Last Name</th><th>Date of Birth</th><th>Phone Number</th><th>Gender</th></tr></thead>
          <tbody>
            {patients.map((p) => {
              const [first, ...rest] = p.name.split(" ");
              return <tr className="table-row clickable" key={p.id} onClick={() => navigate(`/patients/${p.id}/profile`)}><td>{first}</td><td>{rest.join(" ")}</td><td>{p.dob}</td><td>{p.phone}</td><td>{p.gender}</td></tr>;
            })}
          </tbody>
        </table>
      </section>
      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header"><h2>Add New Patient</h2><button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button></div>
            <form className="modal-form" onSubmit={submitPatient}>
              {[
                ["Personal Information", ["firstName", "lastName", "dateOfBirth", "gender"]],
                ["Contact Information", ["phoneNumber", "address", "emergencyContact", "emergencyPhone"]],
                ["Healthcare Information", ["healthcareNumber", "familyDoctor", "referredBy", "otherInsurance"]]
              ].map(([title, fields]) => (
                <div className="item--personal" key={String(title)}>
                  <div className="item-header"><h3>{title}</h3></div>
                  {(fields as string[]).map((field, idx) => (
                    <label className={`content-${idx + 1}`} key={field}>{field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                      {field === "gender" ? <select name="gender" required><option>Female</option><option>Male</option><option>Other</option></select> : <input name={field} type={field === "dateOfBirth" ? "date" : "text"} required={field !== "otherInsurance"} />}
                    </label>
                  ))}
                </div>
              ))}
              <div className="modal-actions"><button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn--primary">Add Patient</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
