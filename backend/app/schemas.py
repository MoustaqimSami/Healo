from datetime import date as DateType, time as TimeType
from pydantic import BaseModel, ConfigDict

class StaffRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    email: str
    role: str
    role_label: str
    avatar_initials: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    staff: StaffRead

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: DateType
    gender: str
    phone: str
    address: str = ""
    emergency_contact_name: str = ""
    emergency_contact_phone: str = ""
    healthcare_number: str = ""
    family_doctor: str = ""
    referred_by: str = ""
    other_insurance: str = "N/A"

class PatientCreate(PatientBase):
    pass

class PatientRead(PatientBase):
    model_config = ConfigDict(from_attributes=True)
    id: str

class AvailabilityWindowRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    doctor_id: str
    day_of_week: int
    start_time: TimeType
    end_time: TimeType

class DoctorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    specialty: str
    age: int
    gender: str
    phone: str
    availability_windows: list[AvailabilityWindowRead] = []

class AppointmentBase(BaseModel):
    doctor_id: str
    patient_id: str
    type: str
    date: DateType
    start_time: TimeType
    end_time: TimeType
    reason: str = ""
    symptoms: str = ""
    notes: str = ""
    status: str = "scheduled"

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    doctor_id: str | None = None
    patient_id: str | None = None
    type: str | None = None
    date: DateType | None = None
    start_time: TimeType | None = None
    end_time: TimeType | None = None
    reason: str | None = None
    symptoms: str | None = None
    notes: str | None = None
    status: str | None = None

class AppointmentRead(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: str

class InvoiceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    patient_id: str
    appointment_id: str | None
    invoice_number: str
    service: str
    date: DateType
    amount_due: float
    amount_paid: float
    insurance_status: str
    status: str

class PaymentCreate(BaseModel):
    invoice_id: str
    amount: float
    method: str = "card"
    processed_by_staff_id: str | None = None

class BookingIntentRequest(BaseModel):
    text: str

class BookingIntentResponse(BaseModel):
    intent: str
    confidence: float
    recommendedAction: str
