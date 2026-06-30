import type { Appointment, Doctor, Invoice, Patient, StaffMember } from "../types/domain";

export const staffSeed: StaffMember[] = [
  {
    id: "staff-1",
    name: "Selena Doe",
    email: "selena@gmcclinic.com",
    password: "password123",
    role: "front-desk",
    roleLabel: "Front Desk Staff",
    avatarInitials: "SD"
  },
  {
    id: "staff-2",
    name: "Admin User",
    email: "admin@gmcclinic.com",
    password: "admin123",
    role: "admin",
    roleLabel: "Clinic Administrator",
    avatarInitials: "AU"
  }
];

export const patientsSeed: Patient[] = [
  {
    id: "pat-1",
    name: "Janet Dean",
    age: 78,
    gender: "Female",
    phone: "825 288 8888",
    dob: "1947-12-04",
    lastAppointment: "2025-09-03",
    extendedInfo: {
      address: "172 Glacier Ridge NW, Calgary, AB",
      phoneNumber: "503-825-7620",
      emergencyContactName: "Hannah Dean",
      emergencyContactPhone: "825-712-4290",
      healthcareNumber: "99251673",
      familyDoctor: "Dr. Nelson James",
      referredBy: "Dr. John Whale",
      otherInsurance: "N/A"
    }
  },
  {
    id: "pat-2",
    name: "Michael Brown",
    age: 46,
    gender: "Male",
    phone: "825 555 1010",
    dob: "1979-12-04",
    lastAppointment: "2025-09-03",
    extendedInfo: {
      address: "45 Maple Avenue SW, Calgary, AB",
      phoneNumber: "825-555-1010",
      emergencyContactName: "Sarah Brown",
      emergencyContactPhone: "403-555-9876",
      healthcareNumber: "10293847",
      familyDoctor: "Dr. Emily Stone",
      referredBy: "Dr. Alan Grant",
      otherInsurance: "Blue Cross"
    }
  },
  {
    id: "pat-3",
    name: "Aisha Khan",
    age: 32,
    gender: "Female",
    phone: "825 555 2020",
    dob: "1993-12-04",
    extendedInfo: {
      address: "889 Coral Springs Blvd NE, Calgary, AB",
      phoneNumber: "825-555-2020",
      emergencyContactName: "Omar Khan",
      emergencyContactPhone: "587-555-4321",
      healthcareNumber: "56473829",
      familyDoctor: "Dr. Rajiv Patel",
      referredBy: "N/A",
      otherInsurance: "Sun Life"
    }
  },
  {
    id: "pat-4",
    name: "Chloe Davies",
    age: 41,
    gender: "Female",
    phone: "825 555 8080",
    dob: "1984-12-04",
    extendedInfo: {
      address: "321 Bridgeland Ave NE, Calgary, AB",
      phoneNumber: "825-555-8080",
      emergencyContactName: "Tom Davies",
      emergencyContactPhone: "587-111-2222",
      healthcareNumber: "22334455",
      familyDoctor: "Dr. Fiona Apple",
      referredBy: "N/A",
      otherInsurance: "Desjardins"
    }
  },
  {
    id: "pat-5",
    name: "Sofia Martinez",
    age: 27,
    gender: "Female",
    phone: "825 555 4040",
    dob: "1998-12-04",
    extendedInfo: {
      address: "776 Beltline Road SE, Calgary, AB",
      phoneNumber: "825-555-4040",
      emergencyContactName: "Carlos Martinez",
      emergencyContactPhone: "587-999-8888",
      healthcareNumber: "11223344",
      familyDoctor: "Dr. Maria Gonzalez",
      referredBy: "N/A",
      otherInsurance: "N/A"
    }
  },
  {
    id: "pat-6",
    name: "Robert Taylor",
    age: 65,
    gender: "Male",
    phone: "825 555 5050",
    dob: "1960-12-04",
    extendedInfo: {
      address: "2234 Varsity Dr NW, Calgary, AB",
      phoneNumber: "825-555-5050",
      emergencyContactName: "Linda Taylor",
      emergencyContactPhone: "403-444-5555",
      healthcareNumber: "99887766",
      familyDoctor: "Dr. Robert Smith",
      referredBy: "Dr. Alice Cooper",
      otherInsurance: "Green Shield"
    }
  },
  {
    id: "pat-7",
    name: "Emily Wilson",
    age: 19,
    gender: "Female",
    phone: "825 555 6060",
    dob: "2006-12-04",
    extendedInfo: {
      address: "101 University Way NW, Calgary, AB",
      phoneNumber: "825-555-6060",
      emergencyContactName: "James Wilson",
      emergencyContactPhone: "403-777-8888",
      healthcareNumber: "55443322",
      familyDoctor: "Dr. Karen White",
      referredBy: "N/A",
      otherInsurance: "Student Care"
    }
  },
  {
    id: "pat-8",
    name: "Daniel Chen",
    age: 50,
    gender: "Male",
    phone: "825 555 9090",
    dob: "1975-12-04",
    extendedInfo: {
      address: "990 Panorama Hills Blvd NW, Calgary, AB",
      phoneNumber: "825-555-9090",
      emergencyContactName: "Lisa Chen",
      emergencyContactPhone: "403-666-7777",
      healthcareNumber: "77665544",
      familyDoctor: "Dr. Bruce Lee",
      referredBy: "N/A",
      otherInsurance: "Great-West Life"
    }
  }
];

export const doctorsSeed: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Pamela Anderson",
    specialty: "Orthopedics",
    age: 55,
    gender: "Female",
    phone: "825 288 8888",
    availabilityWindows: [
      { day: 0, start: "10:00", end: "18:00" },
      { day: 1, start: "13:00", end: "21:00" },
      { day: 3, start: "09:30", end: "19:00" },
      { day: 5, start: "14:00", end: "20:00" },
      { day: 6, start: "09:30", end: "19:00" }
    ]
  },
  {
    id: "doc-2",
    name: "Dr. Din Kim",
    specialty: "Physical Medicine",
    age: 34,
    gender: "Male",
    phone: "825 288 7888",
    availabilityWindows: [
      { day: 0, start: "10:00", end: "18:00" },
      { day: 1, start: "13:00", end: "21:00" },
      { day: 2, start: "09:30", end: "19:00" },
      { day: 3, start: "14:00", end: "20:00" },
      { day: 4, start: "09:30", end: "19:00" }
    ]
  },
  {
    id: "doc-3",
    name: "Dr. Eleanor Vance",
    specialty: "Cardiology",
    age: 48,
    gender: "Female",
    phone: "825 311 4001",
    availabilityWindows: [
      { day: 1, start: "08:00", end: "16:00" },
      { day: 2, start: "08:00", end: "16:00" },
      { day: 3, start: "08:00", end: "16:00" },
      { day: 4, start: "08:00", end: "16:00" }
    ]
  },
  {
    id: "doc-4",
    name: "Dr. Sarah Chen",
    specialty: "Dermatology",
    age: 30,
    gender: "Female",
    phone: "825 311 4003",
    availabilityWindows: [
      { day: 0, start: "09:00", end: "17:00" },
      { day: 1, start: "09:00", end: "17:00" },
      { day: 2, start: "09:00", end: "17:00" },
      { day: 3, start: "09:00", end: "17:00" },
      { day: 4, start: "09:00", end: "17:00" }
    ]
  },
  {
    id: "doc-5",
    name: "Dr. Marcus Reed",
    specialty: "Neurology",
    age: 51,
    gender: "Male",
    phone: "825 311 4004",
    availabilityWindows: [
      { day: 1, start: "10:30", end: "18:30" },
      { day: 3, start: "10:30", end: "18:30" },
      { day: 5, start: "09:00", end: "17:00" }
    ]
  },
  {
    id: "doc-6",
    name: "Dr. Maya Gupta",
    specialty: "Allergy and Immunology",
    age: 32,
    gender: "Female",
    phone: "825 311 4017",
    availabilityWindows: [
      { day: 0, start: "09:00", end: "13:00" },
      { day: 2, start: "14:00", end: "18:00" },
      { day: 4, start: "09:00", end: "13:00" },
      { day: 6, start: "14:00", end: "18:00" }
    ]
  }
];

export const appointmentsSeed: Appointment[] = [
  {
    id: "appt-1",
    doctorId: "doc-1",
    patientId: "pat-1",
    type: "assessment",
    date: "2025-09-03",
    start: "10:00",
    end: "10:30",
    reason: "Initial assessment for knee pain.",
    symptoms: "Pain when climbing stairs.",
    notes: "Assess mobility and consider imaging.",
    status: "completed"
  },
  {
    id: "appt-2",
    doctorId: "doc-1",
    patientId: "pat-2",
    type: "followup",
    date: "2025-09-03",
    start: "11:00",
    end: "11:30",
    reason: "Follow-up after physiotherapy.",
    notes: "Check range of motion and pain level.",
    status: "completed"
  },
  {
    id: "appt-3",
    doctorId: "doc-4",
    patientId: "pat-4",
    type: "walkin",
    date: "2025-09-03",
    start: "14:30",
    end: "15:00",
    reason: "Evaluation of allergic rash.",
    notes: "Patient has hives on arms and neck.",
    status: "scheduled"
  },
  {
    id: "appt-4",
    doctorId: "doc-2",
    patientId: "pat-3",
    type: "assessment",
    date: "2025-09-04",
    start: "09:30",
    end: "10:00",
    reason: "Sports injury rehab assessment.",
    notes: "Patient recovering from ACL tear.",
    status: "scheduled"
  },
  {
    id: "appt-5",
    doctorId: "doc-3",
    patientId: "pat-6",
    type: "reports",
    date: "2025-09-04",
    start: "11:00",
    end: "11:30",
    reason: "Review Holter monitor results.",
    notes: "Discuss medication options.",
    status: "scheduled"
  },
  {
    id: "appt-6",
    doctorId: "doc-5",
    patientId: "pat-7",
    type: "assessment",
    date: "2025-09-05",
    start: "10:30",
    end: "11:00",
    reason: "Chronic migraine consultation.",
    notes: "Discuss triggers and prior treatments.",
    status: "scheduled"
  },
  {
    id: "appt-7",
    doctorId: "doc-1",
    patientId: "pat-5",
    type: "walkin",
    date: "2025-09-06",
    start: "09:30",
    end: "10:00",
    reason: "Walk-in for acute ankle sprain.",
    notes: "Swelling present.",
    status: "scheduled"
  },
  {
    id: "appt-8",
    doctorId: "doc-6",
    patientId: "pat-8",
    type: "other",
    date: "2025-09-07",
    start: "14:00",
    end: "14:30",
    reason: "Documentation request.",
    notes: "Prepare letter for treatment to date.",
    status: "scheduled"
  }
];

export const invoicesSeed: Invoice[] = [
  {
    id: "inv-1",
    patientId: "pat-1",
    appointmentId: "appt-1",
    invoiceNumber: "103258",
    service: "Consult",
    date: "2025-09-03",
    amountDue: 450,
    amountPaid: 350,
    insuranceStatus: "Billed",
    status: "Partial"
  },
  {
    id: "inv-2",
    patientId: "pat-1",
    invoiceNumber: "106358",
    service: "Sick note",
    date: "2025-09-03",
    amountDue: 30,
    amountPaid: 0,
    insuranceStatus: "Not billed",
    status: "Pending"
  },
  {
    id: "inv-3",
    patientId: "pat-4",
    appointmentId: "appt-3",
    invoiceNumber: "109862",
    service: "Walk-in consult",
    date: "2025-09-03",
    amountDue: 180,
    amountPaid: 0,
    insuranceStatus: "Billed",
    status: "Pending"
  }
];
