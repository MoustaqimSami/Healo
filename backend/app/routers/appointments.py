from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Appointment
from app.schemas import AppointmentCreate, AppointmentRead, AppointmentUpdate

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.get("", response_model=list[AppointmentRead])
def list_appointments(date: str | None = None, doctor_id: str | None = None, patient_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Appointment)
    if date:
        query = query.filter(Appointment.date == date)
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    return query.order_by(Appointment.date.asc(), Appointment.start_time.asc()).all()

@router.post("", response_model=AppointmentRead)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    conflict = db.query(Appointment).filter(Appointment.doctor_id == payload.doctor_id, Appointment.date == payload.date, Appointment.start_time == payload.start_time, Appointment.status != "cancelled").first()
    if conflict:
        raise HTTPException(status_code=409, detail="Doctor already has an appointment at this time")
    appt = Appointment(id=f"appt-{uuid4().hex[:8]}", **payload.model_dump())
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

@router.patch("/{appointment_id}", response_model=AppointmentRead)
def update_appointment(appointment_id: str, payload: AppointmentUpdate, db: Session = Depends(get_db)):
    appt = db.get(Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(appt, key, value)
    db.commit()
    db.refresh(appt)
    return appt

@router.post("/{appointment_id}/complete", response_model=AppointmentRead)
def complete_appointment(appointment_id: str, db: Session = Depends(get_db)):
    appt = db.get(Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "completed"
    db.commit()
    db.refresh(appt)
    return appt

@router.post("/{appointment_id}/cancel", response_model=AppointmentRead)
def cancel_appointment(appointment_id: str, db: Session = Depends(get_db)):
    appt = db.get(Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "cancelled"
    db.commit()
    db.refresh(appt)
    return appt

@router.post("/{appointment_id}/follow-up", response_model=AppointmentRead)
def create_follow_up(appointment_id: str, payload: AppointmentCreate, db: Session = Depends(get_db)):
    original = db.get(Appointment, appointment_id)
    if not original:
        raise HTTPException(status_code=404, detail="Appointment not found")
    follow_up = Appointment(id=f"appt-{uuid4().hex[:8]}", type="followup", **payload.model_dump(exclude={"type"}))
    db.add(follow_up)
    db.commit()
    db.refresh(follow_up)
    return follow_up
