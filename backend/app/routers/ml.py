from fastapi import APIRouter
from app.schemas import BookingIntentRequest, BookingIntentResponse
from app.services.booking_intent import predict_intent, train_and_persist_model

router = APIRouter(prefix="/ml", tags=["ml"])

@router.post("/booking-intent/predict", response_model=BookingIntentResponse)
def predict_booking_intent(payload: BookingIntentRequest):
    return predict_intent(payload.text)

@router.post("/booking-intent/train")
def train_booking_intent():
    return train_and_persist_model()
