# Database Schema Overview

The FastAPI backend uses SQLAlchemy models in `backend/app/models.py`.

## Entities

### Staff
- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `role_label`
- `avatar_initials`

### Patient
- `id`
- `first_name`
- `last_name`
- `date_of_birth`
- `gender`
- `phone`
- `address`
- `emergency_contact_name`
- `emergency_contact_phone`
- `healthcare_number`
- `family_doctor`
- `referred_by`
- `other_insurance`

### Doctor
- `id`
- `name`
- `specialty`
- `age`
- `gender`
- `phone`

### DoctorAvailabilityWindow
- `id`
- `doctor_id`
- `day_of_week` where Sunday = 0
- `start_time`
- `end_time`

### Appointment
- `id`
- `doctor_id`
- `patient_id`
- `type`
- `date`
- `start_time`
- `end_time`
- `reason`
- `symptoms`
- `notes`
- `status`

### Invoice
- `id`
- `patient_id`
- `appointment_id`
- `service`
- `amount_due`
- `amount_paid`
- `insurance_status`
- `status`

### Payment
- `id`
- `invoice_id`
- `amount`
- `method`
- `processed_by_staff_id`
- `created_at`

## Production notes

The schema is intentionally simple for a portfolio placeholder. A production clinic system would add audit logs, RBAC, appointment conflict constraints, encrypted PHI fields, insurance claim state machines, consent tracking, and data retention policies.
