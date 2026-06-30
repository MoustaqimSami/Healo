import type { Appointment, Doctor, Patient } from "../../types/domain";
import { formatAppointmentDateTime, getPatientInitials } from "../../utils/date";

interface AppointmentCardProps {
  appointment: Appointment;
  patient?: Patient;
  doctor?: Doctor;
  mode: "upcoming" | "completed";
  onComplete?: () => void;
  onCancel?: () => void;
  onFollowUp?: () => void;
  onRemove?: () => void;
}

export function AppointmentCard({ appointment, patient, doctor, mode, onComplete, onCancel, onFollowUp, onRemove }: AppointmentCardProps) {
  const patientName = patient?.name ?? "Unknown patient";
  return (
    <div className="appointment-card">
      <div className="flexrow-gap12" style={{ alignItems: "center" }}>
        <div className="avatar">{getPatientInitials(patientName)}</div>
        <div className="appointment-card-info">
          <p className="appointment-card-patient">{patientName}</p>
          <p className="appointment-card-doctor">{doctor?.name ?? "Unknown doctor"}</p>
          <p className="appointment-card-time">{appointment.start} - {appointment.end}</p>
          <p className="appointment-card-time">{formatAppointmentDateTime(appointment.date, appointment.start)}</p>
        </div>
      </div>
      <div className="flexrow-gap4">
        {mode === "upcoming" ? (
          <>
            <button className="btn btn--small btn--txt" onClick={onComplete}>Complete</button>
            <button className="btn btn--small btn--danger-txt" onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn btn--small btn--sec-txt" onClick={onFollowUp}>Follow-up</button>
            <button className="btn btn--small btn--danger-txt" onClick={onRemove}>Remove</button>
          </>
        )}
      </div>
    </div>
  );
}
