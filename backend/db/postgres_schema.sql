-- Healo PostgreSQL schema placeholder for PERN-aligned deployment.
-- The FastAPI backend uses SQLAlchemy models that map to the same entities.

CREATE TABLE staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  role_label TEXT NOT NULL,
  avatar_initials TEXT NOT NULL
);

CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  emergency_contact_name TEXT DEFAULT '',
  emergency_contact_phone TEXT DEFAULT '',
  healthcare_number TEXT,
  family_doctor TEXT,
  referred_by TEXT,
  other_insurance TEXT DEFAULT 'N/A'
);

CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE doctor_availability_windows (
  id SERIAL PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  patient_id TEXT NOT NULL REFERENCES patients(id),
  type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT DEFAULT '',
  symptoms TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled'
);

CREATE UNIQUE INDEX idx_no_double_booking
ON appointments(doctor_id, date, start_time)
WHERE status <> 'cancelled';

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
  appointment_id TEXT REFERENCES appointments(id),
  invoice_number TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  amount_due NUMERIC(10, 2) DEFAULT 0,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  insurance_status TEXT DEFAULT 'Billed',
  status TEXT DEFAULT 'Pending'
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  amount NUMERIC(10, 2) NOT NULL,
  method TEXT DEFAULT 'card',
  processed_by_staff_id TEXT REFERENCES staff(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
