from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Invoice, Payment
from app.schemas import InvoiceRead, PaymentCreate

router = APIRouter(prefix="/billing", tags=["billing"])

@router.get("/invoices", response_model=list[InvoiceRead])
def list_invoices(patient_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Invoice)
    if patient_id:
        query = query.filter(Invoice.patient_id == patient_id)
    return query.order_by(Invoice.date.desc()).all()

@router.post("/payments", response_model=InvoiceRead)
def process_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    invoice = db.get(Invoice, payload.invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    payment = Payment(**payload.model_dump())
    invoice.amount_paid = min(invoice.amount_due, invoice.amount_paid + payload.amount)
    invoice.status = "Paid" if invoice.amount_paid >= invoice.amount_due else "Partial"
    db.add(payment)
    db.commit()
    db.refresh(invoice)
    return invoice
