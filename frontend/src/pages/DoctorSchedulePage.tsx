import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { AppointmentModal } from "../components/appointments/AppointmentModal";
import { useClinicData, useDoctor } from "../hooks/ClinicDataProvider";
import type { Appointment } from "../types/domain";
import { getSunday, parseISODateToLocal, toISODate, addDays, formatMonthLabel } from "../utils/date";
import { isSlotAvailable } from "../utils/availability";
import { SCHEDULE_TIME_SLOTS } from "../utils/schedule";

export function DoctorSchedulePage() {
  const { doctorId } = useParams();
  const [params] = useSearchParams();
  const clinic = useClinicData();
  const navigate = useNavigate();
  const doctor = useDoctor(doctorId);
  const [weekStart, setWeekStart] = useState(getSunday(parseISODateToLocal("2025-09-03")));
  const [modalSlot, setModalSlot] = useState<{ date: string; start: string } | null>(() => params.get("open") ? { date: "2025-09-03", start: "10:00" } : null);
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(() => clinic.appointments.find((a) => a.id === params.get("appointmentId")) || null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  const patientIdFromUrl = params.get("patientId") || undefined;
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  if (!doctor) return null;

  function apptFor(date: string, start: string) {
    return clinic.appointments.find((a) => a.doctorId === doctor.id && a.date === date && a.start === start && a.status !== "cancelled");
  }

  function openSlot(date: string, start: string, appt?: Appointment) {
    if (rescheduleId) {
      if (appt) return;
      clinic.updateAppointment(rescheduleId, { date, start });
      setRescheduleId(null);
      return;
    }
    setModalSlot({ date, start });
    setModalAppointment(appt || null);
  }

  return (
    <main className="page">
      {rescheduleId && <div className="appointment-status-stub is-visible appointment-status-stub--info">Rescheduling: select a new empty time slot or close this banner.</div>}
      <header className="page-header page-header--column"><div className="page-nav"><NavLink className="page-title page-title--outer" to="/doctors">Doctors /</NavLink><p className="page-title page-title--inner">{doctor.name}</p></div><h1 className="page-title">{doctor.name}</h1></header>
      <section className="page-body"><div className="schedule-layout">
        <aside className="doctor-card"><div className="doctor-avatar"><img src="/assets/icons/person-black.svg" alt="" className="doctor-avatar-img" /></div><h2 className="doctor-name">{doctor.name}</h2><div className="doctor-info-list"><p><strong>Specialty:</strong> {doctor.specialty}</p><p><strong>Age:</strong> {doctor.age}</p><p><strong>Gender:</strong> {doctor.gender}</p><p><strong>Phone:</strong> {doctor.phone}</p></div><button className="change-doctor-btn" onClick={() => navigate("/doctors")}><Pencil size={18} /> Change Doctor</button></aside>
        <section className="schedule-main"><header className="week-selector"><button className="week-nav" onClick={() => setWeekStart(addDays(weekStart, -7))}>‹</button><h2 className="week-range">{formatMonthLabel(weekStart)}</h2><button className="week-nav" onClick={() => setWeekStart(addDays(weekStart, 7))}>›</button></header>
          <div className="calendar-container"><div className="calendar-grid"><div className="calendar-header"><div className="calendar-header-time" />{weekDates.map((date) => <div className="calendar-header-day" key={toISODate(date)}><span className="calendar-header-date">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><span className="calendar-header-label">{date.toLocaleDateString(undefined, { weekday: "short" })}</span></div>)}</div><div className="calendar-body"><div className="calendar-times">{SCHEDULE_TIME_SLOTS.map((t, i) => <div className={`time-row ${i % 2 === 0 ? "time-row-hour" : "time-row-half"}`} key={t}>{i % 2 === 0 ? t : ""}</div>)}</div><div className="calendar-days">{weekDates.map((date) => <div className="calendar-day-column" key={toISODate(date)}>{SCHEDULE_TIME_SLOTS.map((time) => { const iso = toISODate(date); const appt = apptFor(iso, time); const available = isSlotAvailable(doctor, date.getDay(), time); return <button key={time} className={`slot-row ${available ? "slot-row-available" : "slot-row-unavailable"} ${appt ? `slot--occupied slot--${appt.type}` : ""}`} disabled={!available && !appt} onClick={() => openSlot(iso, time, appt)}>{appt && <div className="slot-appointment"><div className="slot-appointment-patient">{clinic.patients.find((p) => p.id === appt.patientId)?.name}</div></div>}</button>;})}</div>)}</div></div></div></div>
          <div className="schedule-legend"><span className="legend-pill legend-assessment">Assessment</span><span className="legend-pill legend-reports">Reports</span><span className="legend-pill legend-followup">Follow-up</span><span className="legend-pill legend-walkin">Walk-In</span><span className="legend-pill legend-other">Other</span></div>
        </section>
      </div></section>
      <AppointmentModal isOpen={!!modalSlot} slot={modalSlot} appointment={modalAppointment} doctors={clinic.doctors} patients={clinic.patients} defaultDoctorId={doctor.id} defaultPatientId={patientIdFromUrl} onClose={() => { setModalSlot(null); setModalAppointment(null); }} onDelete={() => { if (modalAppointment) clinic.deleteAppointment(modalAppointment.id); setModalSlot(null); }} onReschedule={() => { if (modalAppointment) { setRescheduleId(modalAppointment.id); setModalSlot(null); } }} onSave={(payload) => { if (!modalSlot) return; if (modalAppointment) clinic.updateAppointment(modalAppointment.id, payload); else clinic.createAppointment({ ...payload, date: modalSlot.date, start: modalSlot.start }); setModalSlot(null); setModalAppointment(null); }} />
    </main>
  );
}
