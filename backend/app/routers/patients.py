from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient
from app.schemas import PatientCreate, PatientRead

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("", response_model=list[PatientRead])
def list_patients(q: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Patient)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Patient.first_name.ilike(like), Patient.last_name.ilike(like), Patient.phone.ilike(like), Patient.healthcare_number.ilike(like)))
    return query.order_by(Patient.last_name.asc()).all()

@router.post("", response_model=PatientRead)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(id=f"pat-{uuid4().hex[:8]}", **payload.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
