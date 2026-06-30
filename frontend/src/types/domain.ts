export type AppointmentType = "assessment" | "reports" | "followup" | "walkin" | "other";
export type AppointmentStatus = "scheduled" | "upcoming" | "completed" | "cancelled";
export type Gender = "Male" | "Female" | "Other";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "front-desk" | "doctor" | "admin";
  roleLabel: string;
  avatarInitials: string;
}

export interface PatientExtendedInfo {
  address: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  healthcareNumber: string;
  familyDoctor: string;
  referredBy: string;
  otherInsurance: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  dob: string;
  lastAppointment?: string;
  extendedInfo: PatientExtendedInfo;
}

export interface AvailabilityWindow {
  day: number; // Sunday = 0
  start: string;
  end: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  age: number;
  gender: Gender;
  phone: string;
  avatarIcon?: string;
  availabilityWindows: AvailabilityWindow[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  type: AppointmentType;
  date: string;
  start: string;
  end: string;
  reason: string;
  symptoms?: string;
  notes: string;
  status: AppointmentStatus;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  invoiceNumber: string;
  service: string;
  date: string;
  amountDue: number;
  amountPaid: number;
  insuranceStatus: "Billed" | "Not billed" | "Rejected";
  status: "Pending" | "Paid" | "Partial";
}

export interface BookingIntentPrediction {
  intent: string;
  confidence: number;
  recommendedAction: string;
}

export interface ClinicStateSnapshot {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  invoices: Invoice[];
  currentStaff: StaffMember | null;
}
