import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, UserPlus } from "lucide-react";
import { AppointmentCard } from "../components/appointments/AppointmentCard";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { Toast } from "../components/ui/Toast";
import { useClinicData } from "../hooks/ClinicDataProvider";
import type { Appointment } from "../types/domain";
import { addDays, formatAppointmentDateTime, formatDayRangeLabel, formatMonthLabel, getSunday, parseISODateToLocal, sameDay, toISODate } from "../utils/date";
import { getDoctorStatusForDate } from "../utils/availability";

export function DashboardPage() {
  const clinic = useClinicData();
  const navigate = useNavigate();
  const firstDate = clinic.appointments[0] ? parseISODateToLocal(clinic.appointments[0].date) : new Date();
  const [selectedDate, setSelectedDate] = useState(firstDate);
  const [weekStart, setWeekStart] = useState(getSunday(firstDate));
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [toast, setToast] = useState({ message: "", variant: "success" as "success" | "danger" | "info" });
  const [confirm, setConfirm] = useState<null | { action: "complete" | "cancel" | "remove" | "followup"; appointment: Appointment }>(null);

  const todaysAppointments = clinic.appointments.filter((a) => a.date === toISODate(selectedDate));
  const upcoming = todaysAppointments.filter((a) => a.status !== "completed" && a.status !== "cancelled").sort((a, b) => a.start.localeCompare(b.start));
  const completed = todaysAppointments.filter((a) => a.status === "completed").sort((a, b) => a.start.localeCompare(b.start));

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  function shiftWeek(delta: number) {
    const next = addDays(weekStart, delta * 7);
    setWeekStart(next);
    setSelectedDate(addDays(selectedDate, delta * 7));
  }

  function findPatient(id: string) { return clinic.patients.find((p) => p.id === id); }
  function findDoctor(id: string) { return clinic.doctors.find((d) => d.id === id); }

  function runConfirm() {
    if (!confirm) return;
    const { action, appointment } = confirm;
    if (action === "complete") {
      clinic.updateAppointment(appointment.id, { status: "completed" });
      setToast({ message: "Appointment marked as completed.", variant: "success" });
    } else if (action === "cancel") {
      clinic.updateAppointment(appointment.id, { status: "cancelled" });
      setToast({ message: "Appointment cancelled.", variant: "danger" });
    } else if (action === "remove") {
      clinic.deleteAppointment(appointment.id);
      setToast({ message: "Appointment removed from completed.", variant: "success" });
    } else if (action === "followup") {
      navigate(`/doctors/${appointment.doctorId}/schedule?open=bookFollowup&patientId=${appointment.patientId}`);
    }
    setConfirm(null);
  }

  const modalContext = confirm ? {
    patientName: findPatient(confirm.appointment.patientId)?.name,
    doctorName: findDoctor(confirm.appointment.doctorId)?.name,
    timeLabel: formatAppointmentDateTime(confirm.appointment.date, confirm.appointment.start)
  } : undefined;

  return (
    <main className="page">
      <header className="page-header page-header--twoitems">
        <h1 className="page-title">Good morning, {clinic.currentStaff?.name.split(" ")[0] ?? "Selena"}</h1>
        <div className="week-view"><span>{formatDayRangeLabel(weekStart)}</span></div>
      </header>

      <div className="home-shortcuts-box">
        <button className="quick-action" onClick={() => navigate("/doctors/doc-1/schedule?open=book")}>
          <div className="quick-action-iconbox quick-action-iconbox--orange"><CalendarPlus /></div>
          <div className="quick-action-text"><p>Book Appointment</p><span>›</span></div>
        </button>
        <button className="quick-action" onClick={() => navigate("/patients?open=addPatient")}>
          <div className="quick-action-iconbox quick-action-iconbox--teal"><UserPlus /></div>
          <div className="quick-action-text"><p>Add Patient</p><span>›</span></div>
        </button>
        <div className="week-calendar">
          <div className="week-calendar-header">
            <p className="body-xl-semibold">{formatMonthLabel(weekStart)}</p>
            <div className="flexrow-gap8">
              <button className="week-nav-btn" onClick={() => shiftWeek(-1)}>‹</button>
              <button className="week-nav-btn" onClick={() => shiftWeek(1)}>›</button>
            </div>
          </div>
          <div className="flexrow-gap8 week-days-container">
            {weekDays.map((date) => (
              <button key={toISODate(date)} className="week-day" onClick={() => setSelectedDate(date)}>
                <div className={`day-label ${sameDay(date, selectedDate) ? "day-label--selected" : ""}`}>{date.toLocaleDateString(undefined, { weekday: "short" })}</div>
                <div className={`day-number ${sameDay(date, selectedDate) ? "day-number--selected" : ""}`}>{date.getDate()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <section className="page-body page-body--section appointments-section">
          <div className="flexcol-gap12">
            <h2 className="body-xl-semibold">Appointments</h2>
            <div className="tabs">
              <button className={`tab ${tab === "upcoming" ? "tab--active" : ""}`} onClick={() => setTab("upcoming")}>Upcoming</button>
              <button className={`tab ${tab === "completed" ? "tab--active" : ""}`} onClick={() => setTab("completed")}>Completed</button>
            </div>
          </div>
          <div className="appointments-div">
            <div className="tab-panel tab-panel--active custom-scroll">
              {(tab === "upcoming" ? upcoming : completed).length === 0 ? <p className="muted">No {tab} appointments for this day.</p> : null}
              {(tab === "upcoming" ? upcoming : completed).map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} mode={tab} patient={findPatient(appt.patientId)} doctor={findDoctor(appt.doctorId)} onComplete={() => setConfirm({ action: "complete", appointment: appt })} onCancel={() => setConfirm({ action: "cancel", appointment: appt })} onFollowUp={() => setConfirm({ action: "followup", appointment: appt })} onRemove={() => setConfirm({ action: "remove", appointment: appt })} />
              ))}
            </div>
          </div>
        </section>
        <section className="page-body page-body--section doctors-today-section">
          <h2 className="body-xl-semibold">Doctors Today</h2>
          <div className="doctors-today-list custom-scroll">
            {clinic.doctors.map((doctor) => {
              const status = getDoctorStatusForDate(doctor, selectedDate, clinic.appointments);
              return (
                <div className="availability-card" key={doctor.id}>
                  <p className="availability-card-doctor">{doctor.name}</p>
                  <div className="availability-card-info">
                    <div className={`availability-card-tag ${status.tagClass}`}>{status.tagText}</div>
                    {status.showTime && <div className="availability-card-time">Available at: {status.timeText}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Toast message={toast.message} variant={toast.variant} />
      {confirm && <ConfirmModal title={confirm.action === "complete" ? "Mark as Completed" : confirm.action === "followup" ? "Start Follow-up" : confirm.action === "remove" ? "Remove from Completed" : "Cancel Appointment"} message={confirm.action === "followup" ? "This will start a follow-up flow for this appointment." : "Please confirm this appointment action."} confirmLabel={confirm.action === "complete" ? "Mark completed" : confirm.action === "followup" ? "Start Follow-up" : confirm.action === "remove" ? "Remove Appointment" : "Cancel Appointment"} variant={confirm.action === "complete" || confirm.action === "followup" ? "teal" : "primary"} context={modalContext} onConfirm={runConfirm} onCancel={() => setConfirm(null)} />}
    </main>
  );
}
