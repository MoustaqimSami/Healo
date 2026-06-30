import { useMemo, useState } from "react";
import type { Appointment, AppointmentType, Doctor, Patient } from "../../types/domain";
import { formatTimeTo12h } from "../../utils/date";

interface AppointmentModalProps {
  isOpen: boolean;
  slot: { date: string; start: string } | null;
  appointment?: Appointment | null;
  doctors: Doctor[];
  patients: Patient[];
  defaultDoctorId?: string;
  defaultPatientId?: string;
  onClose: () => void;
  onSave: (payload: { doctorId: string; patientId: string; type: AppointmentType; reason: string; symptoms?: string; notes: string }) => void;
  onDelete?: () => void;
  onReschedule?: () => void;
}

const appointmentTabs: AppointmentType[] = ["assessment", "reports", "followup", "walkin", "other"];

export function AppointmentModal({ isOpen, slot, appointment, doctors, patients, defaultDoctorId, defaultPatientId, onClose, onSave, onDelete, onReschedule }: AppointmentModalProps) {
  const [type, setType] = useState<AppointmentType>(appointment?.type || "assessment");
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || defaultDoctorId || doctors[0]?.id || "");
  const [patientId, setPatientId] = useState(appointment?.patientId || defaultPatientId || patients[0]?.id || "");
  const [reason, setReason] = useState(appointment?.reason || "");
  const [symptoms, setSymptoms] = useState(appointment?.symptoms || "");
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [editing, setEditing] = useState(!appointment);

  const selectedDoctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId, doctors]);
  const selectedPatient = useMemo(() => patients.find((p) => p.id === patientId), [patientId, patients]);

  if (!isOpen || !slot) return null;

  return (
    <div className="appointment-modal is-open" role="presentation">
      <div className="appointment-modal-dialog" role="dialog" aria-modal="true">
        <header className="appointment-modal-header">
          <div className="appointment-header-main">
            <button className="appointment-header-block clickable-reset" onClick={onReschedule} disabled={!appointment} title="Click to reschedule">
              <span className="appointment-header-text-main">{formatTimeTo12h(slot.start)}</span>
            </button>
            <button className="appointment-header-block clickable-reset" onClick={onReschedule} disabled={!appointment} title="Click to reschedule">
              <span className="appointment-header-text-main">{slot.date}</span>
              <span className="appointment-header-text-sub">{appointment ? "Reschedule" : "New booking"}</span>
            </button>
          </div>
          <button className="appointment-close-btn" onClick={onClose}>×</button>
        </header>
        <div className="appointment-modal-body">
          <aside className="appointment-side appointment-side--left">
            <label className="appointment-field-label">Doctor</label>
            <select className="appointment-search-input-field bordered-input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} disabled={!editing}>
              {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} — {doctor.specialty}</option>)}
            </select>
            <div className="appointment-profile">
              <div className="appointment-avatar"><img src="/assets/icons/person-black.svg" alt="" className="appointment-avatar-icon" /></div>
              <div className="appointment-profile-name">{selectedDoctor?.name}</div>
              <div className="appointment-profile-detail">Specialty: {selectedDoctor?.specialty}</div>
              <div className="appointment-profile-detail">Phone: {selectedDoctor?.phone}</div>
            </div>
          </aside>
          <main className="appointment-main">
            <nav className="appointment-tabs">
              {appointmentTabs.map((tab) => (
                <button key={tab} className={`appointment-tab ${type === tab ? "is-active" : ""}`} disabled={!editing} onClick={() => setType(tab)}>{tab === "followup" ? "Follow-up" : tab}</button>
              ))}
            </nav>
            <section className="appointment-form">
              <h2 className="appointment-form-title">{appointment ? "Appointment Details" : "Create Appointment"}</h2>
              <div className="appointment-field field-large">
                <label className="appointment-field-label">Reason for visit</label>
                <div className="appointment-field-control"><textarea disabled={!editing} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
              </div>
              <div className="appointment-field field-small">
                <label className="appointment-field-label">Symptoms duration</label>
                <div className="appointment-field-control"><input disabled={!editing} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} /></div>
              </div>
              <div className="appointment-field field-large">
                <label className="appointment-field-label">Additional comments</label>
                <div className="appointment-field-control"><textarea disabled={!editing} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              </div>
            </section>
            <div className="appointment-actions">
              <div className="appointment-actions-left">
                {appointment && <button className="appointment-btn appointment-btn-edit" onClick={() => setEditing(true)}>Edit</button>}
                <button className="appointment-btn appointment-btn-delete" onClick={appointment ? onDelete : onClose}>{appointment ? "Delete" : "Cancel"}</button>
              </div>
              <button className="appointment-btn appointment-btn-save" disabled={!editing} onClick={() => onSave({ doctorId, patientId, type, reason, symptoms, notes })}>{appointment ? "Save" : "Add"}</button>
            </div>
          </main>
          <aside className="appointment-side appointment-side--right">
            <label className="appointment-field-label">Patient</label>
            <select className="appointment-search-input-field bordered-input" value={patientId} onChange={(e) => setPatientId(e.target.value)} disabled={!editing}>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} — {patient.phone}</option>)}
            </select>
            <div className="appointment-profile">
              <div className="appointment-avatar"><img src="/assets/icons/person-black.svg" alt="" className="appointment-avatar-icon" /></div>
              <div className="appointment-profile-name">{selectedPatient?.name}</div>
              <div className="appointment-profile-detail">Age: {selectedPatient?.age}</div>
              <div className="appointment-profile-detail">Gender: {selectedPatient?.gender}</div>
              <div className="appointment-profile-detail">Phone: {selectedPatient?.phone}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
