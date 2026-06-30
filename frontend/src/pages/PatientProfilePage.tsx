import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Pencil, CalendarPlus } from "lucide-react";
import { usePatient } from "../hooks/ClinicDataProvider";

export function PatientProfilePage() {
  const { patientId } = useParams();
  const patient = usePatient(patientId);
  const navigate = useNavigate();
  if (!patient) return null;
  const [first, ...rest] = patient.name.split(" ");
  const last = rest.join(" ");
  const ei = patient.extendedInfo;
  return (
    <main className="page">
      <header className="page-header page-header--column"><div className="page-nav"><NavLink className="page-title page-title--outer" to="/patients">Patients /</NavLink><p className="page-title page-title--inner">{patient.name}</p></div><h1 className="page-title">{patient.name}</h1></header>
      <section className="page-body page-body--innerpage auto-height">
        <aside className="inner-sidebar"><nav className="inner-sidebar-nav"><NavLink className="inner-nav-item inner-nav-item-active" to={`/patients/${patient.id}/profile`}>Profile</NavLink><NavLink className="inner-nav-item" to={`/patients/${patient.id}/appointments`}>Appointments</NavLink><NavLink className="inner-nav-item" to={`/patients/${patient.id}/billing`}>Billing</NavLink><div className="inner-sidebar-bottom"><button className="btn btn--small btn--danger-txt-red">Delete Account</button></div></nav></aside>
        <div className="main main--innerpage flexcol-gap24">
          <h2 className="body-xl-semibold">Profile</h2>
          <div className="item"><div className="profile-name-area"><div className="patient-avatar"><img src="/assets/icons/person-black.svg" alt="" className="patient-avatar-img" /></div><span className="patient-name">{patient.name}</span></div><button className="edit-profile-button"><Pencil size={16} /> Edit Profile</button></div>
          <ProfileSection title="Personal Information" cells={[['First name', first], ['Last name', last], ['Date of birth', patient.dob], ['Phone', patient.phone]]} />
          <ProfileSection title="Contact Information" cells={[['Address', ei.address], ['Phone Number', ei.phoneNumber], ['Emergency Contact', ei.emergencyContactName], ['Emergency Phone', ei.emergencyContactPhone]]} />
          <ProfileSection title="Healthcare Information" cells={[['Alberta Healthcare Number', ei.healthcareNumber], ['Family Doctor', ei.familyDoctor], ['Referred by', ei.referredBy], ['Other Healthcare Insurance', ei.otherInsurance]]} />
          <footer className="item-footer"><button className="book-appointment-btn" onClick={() => navigate(`/doctors/doc-1/schedule?open=book&patientId=${patient.id}`)}><CalendarPlus size={18} /> Book Appointment</button></footer>
        </div>
      </section>
    </main>
  );
}

function ProfileSection({ title, cells }: { title: string; cells: [string, string | number][] }) {
  return <div className="item--personal"><div className="item-header"><h3>{title}</h3></div>{cells.map(([label, value], idx) => <div className={`content-${idx + 1}`} key={label}>{label}<br /><strong>{value || "Not on file"}</strong></div>)}</div>;
}
