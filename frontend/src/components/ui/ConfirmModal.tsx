import { getPatientInitials } from "../../utils/date";

interface ConfirmContext {
  patientName?: string;
  doctorName?: string;
  timeLabel?: string;
}

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "primary" | "teal";
  context?: ConfirmContext;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ title, message, confirmLabel, cancelLabel = "Go back", variant = "primary", context, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="confirm-modal-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onCancel()}>
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        {context && (
          <div className="confirm-appt-card">
            <div className="confirm-appt-avatar">{getPatientInitials(context.patientName || "?")}</div>
            <div className="confirm-appt-text">
              <div className="confirm-appt-patient">{context.patientName}</div>
              <div className="confirm-appt-doctor">{context.doctorName}</div>
              <div className="confirm-appt-time">{context.timeLabel}</div>
            </div>
          </div>
        )}
        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn confirm-modal-btn--secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={`confirm-modal-btn ${variant === "teal" ? "confirm-modal-btn--teal" : "confirm-modal-btn--primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
