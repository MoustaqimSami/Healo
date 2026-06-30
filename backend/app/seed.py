from datetime import date, time
from sqlalchemy.orm import Session
from app.models import Appointment, Doctor, DoctorAvailabilityWindow, Invoice, Patient, Staff


def t(value: str) -> time:
    h, m = value.split(":")
    return time(int(h), int(m))


def d(value: str) -> date:
    return date.fromisoformat(value)


def seed_database(db: Session) -> None:
    if db.query(Staff).first():
        return

    db.add_all([
        Staff(id="staff-1", name="Selena Doe", email="selena@gmcclinic.com", password_hash="password123", role="front-desk", role_label="Front Desk Staff", avatar_initials="SD"),
        Staff(id="staff-2", name="Admin User", email="admin@gmcclinic.com", password_hash="admin123", role="admin", role_label="Clinic Administrator", avatar_initials="AU"),
    ])

    patients = [
        Patient(id="pat-1", first_name="Janet", last_name="Dean", date_of_birth=d("1947-12-04"), gender="Female", phone="825 288 8888", address="172 Glacier Ridge NW, Calgary, AB", emergency_contact_name="Hannah Dean", emergency_contact_phone="825-712-4290", healthcare_number="99251673", family_doctor="Dr. Nelson James", referred_by="Dr. John Whale", other_insurance="N/A"),
        Patient(id="pat-2", first_name="Michael", last_name="Brown", date_of_birth=d("1979-12-04"), gender="Male", phone="825 555 1010", address="45 Maple Avenue SW, Calgary, AB", emergency_contact_name="Sarah Brown", emergency_contact_phone="403-555-9876", healthcare_number="10293847", family_doctor="Dr. Emily Stone", referred_by="Dr. Alan Grant", other_insurance="Blue Cross"),
        Patient(id="pat-3", first_name="Aisha", last_name="Khan", date_of_birth=d("1993-12-04"), gender="Female", phone="825 555 2020", address="889 Coral Springs Blvd NE, Calgary, AB", emergency_contact_name="Omar Khan", emergency_contact_phone="587-555-4321", healthcare_number="56473829", family_doctor="Dr. Rajiv Patel", referred_by="N/A", other_insurance="Sun Life"),
        Patient(id="pat-4", first_name="Chloe", last_name="Davies", date_of_birth=d("1984-12-04"), gender="Female", phone="825 555 8080", address="321 Bridgeland Ave NE, Calgary, AB", emergency_contact_name="Tom Davies", emergency_contact_phone="587-111-2222", healthcare_number="22334455", family_doctor="Dr. Fiona Apple", referred_by="N/A", other_insurance="Desjardins"),
    ]
    db.add_all(patients)

    doctors = [
        Doctor(id="doc-1", name="Dr. Pamela Anderson", specialty="Orthopedics", age=55, gender="Female", phone="825 288 8888"),
        Doctor(id="doc-2", name="Dr. Din Kim", specialty="Physical Medicine", age=34, gender="Male", phone="825 288 7888"),
        Doctor(id="doc-3", name="Dr. Eleanor Vance", specialty="Cardiology", age=48, gender="Female", phone="825 311 4001"),
        Doctor(id="doc-4", name="Dr. Sarah Chen", specialty="Dermatology", age=30, gender="Female", phone="825 311 4003"),
    ]
    db.add_all(doctors)

    windows = [
        ("doc-1", 0, "10:00", "18:00"), ("doc-1", 1, "13:00", "21:00"), ("doc-1", 3, "09:30", "19:00"),
        ("doc-2", 1, "13:00", "21:00"), ("doc-2", 2, "09:30", "19:00"), ("doc-2", 4, "09:30", "19:00"),
        ("doc-3", 1, "08:00", "16:00"), ("doc-3", 2, "08:00", "16:00"), ("doc-3", 3, "08:00", "16:00"),
        ("doc-4", 0, "09:00", "17:00"), ("doc-4", 1, "09:00", "17:00"), ("doc-4", 2, "09:00", "17:00"),
    ]
    db.add_all([DoctorAvailabilityWindow(doctor_id=doc, day_of_week=day, start_time=t(start), end_time=t(end)) for doc, day, start, end in windows])

    db.add_all([
        Appointment(id="appt-1", doctor_id="doc-1", patient_id="pat-1", type="assessment", date=d("2025-09-03"), start_time=t("10:00"), end_time=t("10:30"), reason="Initial assessment for knee pain.", symptoms="Pain when climbing stairs.", notes="Assess mobility and consider imaging.", status="completed"),
        Appointment(id="appt-2", doctor_id="doc-1", patient_id="pat-2", type="followup", date=d("2025-09-03"), start_time=t("11:00"), end_time=t("11:30"), reason="Follow-up after physiotherapy.", notes="Check range of motion and pain level.", status="completed"),
        Appointment(id="appt-3", doctor_id="doc-4", patient_id="pat-4", type="walkin", date=d("2025-09-03"), start_time=t("14:30"), end_time=t("15:00"), reason="Evaluation of allergic rash.", notes="Patient has hives on arms and neck.", status="scheduled"),
    ])

    db.add_all([
        Invoice(id="inv-1", patient_id="pat-1", appointment_id="appt-1", invoice_number="103258", service="Consult", date=d("2025-09-03"), amount_due=450, amount_paid=350, insurance_status="Billed", status="Partial"),
        Invoice(id="inv-2", patient_id="pat-1", invoice_number="106358", service="Sick note", date=d("2025-09-03"), amount_due=30, amount_paid=0, insurance_status="Not billed", status="Pending"),
    ])

    db.commit()
