from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from app.database import get_db
from app.models import Doctor
from app.schemas import AvailabilityWindowRead, DoctorRead

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.get("", response_model=list[DoctorRead])
def list_doctors(specialty: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Doctor).options(selectinload(Doctor.availability_windows))
    if specialty:
        query = query.filter(Doctor.specialty == specialty)
    return query.order_by(Doctor.name.asc()).all()

@router.get("/{doctor_id}", response_model=DoctorRead)
def get_doctor(doctor_id: str, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).options(selectinload(Doctor.availability_windows)).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.get("/{doctor_id}/availability", response_model=list[AvailabilityWindowRead])
def get_availability(doctor_id: str, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).options(selectinload(Doctor.availability_windows)).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor.availability_windows
