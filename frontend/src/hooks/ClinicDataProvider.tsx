import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { appointmentsSeed, doctorsSeed, invoicesSeed, patientsSeed, staffSeed } from "../data/seedData";
import type { Appointment, AppointmentType, ClinicStateSnapshot, Doctor, Invoice, Patient, StaffMember } from "../types/domain";
import { getEndTime } from "../utils/date";
import { makeAppointmentId } from "../utils/schedule";

const STORAGE_KEY = "healo_clinic_state_v1";

interface NewPatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Patient["gender"];
  phoneNumber: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  healthcareNumber: string;
  familyDoctor: string;
  referredBy: string;
  otherInsurance: string;
}

interface AppointmentInput {
  doctorId: string;
  patientId: string;
  type: AppointmentType;
  date: string;
  start: string;
  reason: string;
  symptoms?: string;
  notes: string;
}

interface ClinicDataContextValue extends ClinicStateSnapshot {
  login: (email: string, password: string) => StaffMember | null;
  logout: () => void;
  addPatient: (input: NewPatientInput) => Patient;
  updateAppointment: (id: string, changes: Partial<Appointment>) => Appointment | null;
  deleteAppointment: (id: string) => boolean;
  createAppointment: (input: AppointmentInput) => Appointment;
  processPayment: (invoiceId: string, amount: number) => void;
  resetDemoData: () => void;
}

const ClinicDataContext = createContext<ClinicDataContextValue | null>(null);

function loadInitialState(): ClinicStateSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ClinicStateSnapshot;
  } catch {
    // fall through to seed data
  }
  return {
    patients: patientsSeed,
    doctors: doctorsSeed,
    appointments: appointmentsSeed,
    invoices: invoicesSeed,
    currentStaff: null
  };
}

function saveState(state: ClinicStateSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // local demo persistence is optional
  }
}

export function ClinicDataProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<ClinicStateSnapshot>(() => loadInitialState());

  function commit(next: ClinicStateSnapshot): void {
    setSnapshot(next);
    saveState(next);
  }

  const value = useMemo<ClinicDataContextValue>(() => ({
    ...snapshot,
    login(email, password) {
      const staff = staffSeed.find((s) => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password);
      if (!staff) return null;
      commit({ ...snapshot, currentStaff: staff });
      return staff;
    },
    logout() {
      commit({ ...snapshot, currentStaff: null });
    },
    addPatient(input) {
      const maxId = snapshot.patients.reduce((max, p) => {
        const n = Number(p.id.split("-").at(-1));
        return Number.isFinite(n) ? Math.max(max, n) : max;
      }, 0);
      const patient: Patient = {
        id: `pat-${maxId + 1}`,
        name: `${input.firstName} ${input.lastName}`.trim(),
        age: input.dateOfBirth ? new Date().getFullYear() - new Date(input.dateOfBirth).getFullYear() : 0,
        gender: input.gender,
        phone: input.phoneNumber,
        dob: input.dateOfBirth,
        extendedInfo: {
          address: input.address,
          phoneNumber: input.phoneNumber,
          emergencyContactName: input.emergencyContact,
          emergencyContactPhone: input.emergencyPhone,
          healthcareNumber: input.healthcareNumber,
          familyDoctor: input.familyDoctor,
          referredBy: input.referredBy,
          otherInsurance: input.otherInsurance || "N/A"
        }
      };
      commit({ ...snapshot, patients: [...snapshot.patients, patient] });
      return patient;
    },
    updateAppointment(id, changes) {
      let updated: Appointment | null = null;
      const appointments = snapshot.appointments.map((appt) => {
        if (appt.id !== id) return appt;
        updated = { ...appt, ...changes };
        return updated;
      });
      commit({ ...snapshot, appointments });
      return updated;
    },
    deleteAppointment(id) {
      const before = snapshot.appointments.length;
      const appointments = snapshot.appointments.filter((a) => a.id !== id);
      commit({ ...snapshot, appointments });
      return appointments.length !== before;
    },
    createAppointment(input) {
      const appt: Appointment = {
        id: makeAppointmentId(),
        status: "scheduled",
        end: getEndTime(input.start),
        ...input
      };
      commit({ ...snapshot, appointments: [...snapshot.appointments, appt] });
      return appt;
    },
    processPayment(invoiceId, amount) {
      const invoices = snapshot.invoices.map((invoice) => {
        if (invoice.id !== invoiceId) return invoice;
        const amountPaid = Math.min(invoice.amountDue, invoice.amountPaid + amount);
        return {
          ...invoice,
          amountPaid,
          status: amountPaid >= invoice.amountDue ? "Paid" as const : "Partial" as const
        };
      });
      commit({ ...snapshot, invoices });
    },
    resetDemoData() {
      const next: ClinicStateSnapshot = {
        patients: patientsSeed,
        doctors: doctorsSeed,
        appointments: appointmentsSeed,
        invoices: invoicesSeed,
        currentStaff: null
      };
      commit(next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [snapshot]);

  return <ClinicDataContext.Provider value={value}>{children}</ClinicDataContext.Provider>;
}

export function useClinicData(): ClinicDataContextValue {
  const ctx = useContext(ClinicDataContext);
  if (!ctx) throw new Error("useClinicData must be used inside ClinicDataProvider");
  return ctx;
}

export function usePatient(patientId?: string): Patient | undefined {
  const { patients } = useClinicData();
  return patients.find((p) => p.id === patientId) || patients[0];
}

export function useDoctor(doctorId?: string): Doctor | undefined {
  const { doctors } = useClinicData();
  return doctors.find((d) => d.id === doctorId) || doctors[0];
}
