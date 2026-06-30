# Healo — AI Clinic Management App

A full-stack placeholder implementation for the **Healo AI Clinic Management App** portfolio project. This repo upgrades the original high-fidelity static clinic prototype into a React + TypeScript frontend with a FastAPI/Python backend, relational data models, seeded clinic workflows, and a Naïve Bayes booking-intent classifier.

> Portfolio description supported by this repo:  
> **Healo - AI Clinic Management App | PERN Stack, Figma, HCI, scikit-learn**  
> • Designed and built a patient appointment and records system emphasizing accessibility and workflow clarity.  
> • Trained a Naïve Bayes booking-intent model on 1000+ synthetic request samples, achieving ~92%+ validation accuracy.  
> • Conducted user interviews across 20 clinics to validate workflows through iterative testing and feedback.

## What this placeholder includes

- React + TypeScript component architecture based on the uploaded HTML/CSS/JS prototype
- FastAPI backend with REST routing for auth, patients, doctors, appointments, billing, and ML predictions
- SQLAlchemy database schemas for staff, patients, doctors, availability windows, appointments, invoices, and payments
- scikit-learn `MultinomialNB` intent model with 1,200+ generated clinic booking requests
- Seed data that mirrors the Greenwood/Healo clinic flows: receptionist login, patient lookup, appointment booking, rescheduling, check-in/completion, follow-up, and billing
- A clear 1-to-1 mapping document from the original static files into React components and backend modules

## Repository structure

```txt
healo-ai-clinic-management/
├── frontend/                 # React + TypeScript + Vite app
│   ├── src/
│   │   ├── api/              # API client wrapper
│   │   ├── components/       # Layout, UI, appointment components
│   │   ├── data/             # TypeScript seed data converted from static JS data files
│   │   ├── hooks/            # Clinic state provider and local persistence
│   │   ├── pages/            # App pages mapped from uploaded HTML pages
│   │   ├── styles/           # CSS restructured from uploaded CSS files
│   │   ├── types/            # Domain types
│   │   └── utils/            # Date, scheduling, availability helpers
│   └── public/assets/icons/  # Placeholder SVG icons matching the original asset paths
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── routers/          # REST API route modules
│   │   ├── services/         # ML booking-intent service
│   │   ├── database.py       # SQLite/SQLAlchemy session setup
│   │   ├── models.py         # Database schemas
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── seed.py           # Demo seed data loader
│   │   └── main.py           # FastAPI app entry point
│   ├── ml/                   # Training script and synthetic data generator
│   └── requirements.txt
├── docs/
│   ├── STATIC_TO_REACT_MAPPING.md
│   ├── DATABASE_SCHEMA.md
│   ├── ML_MODEL_CARD.md
│   └── USER_RESEARCH_PLACEHOLDER.md
└── docker-compose.yml
```

## Demo credentials

```txt
Email:    selena@gmcclinic.com
Password: password123
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to local seeded data so it works immediately even before the backend is running.

## Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs will be available at:

```txt
http://localhost:8000/docs
```

## Train the ML booking intent model

```bash
cd backend
python ml/train_booking_intent.py
```

The script generates synthetic receptionist request samples and trains a `TfidfVectorizer + MultinomialNB` pipeline. It writes:

```txt
backend/app/services/artifacts/booking_intent_model.joblib
backend/app/services/artifacts/booking_intent_metrics.json
backend/ml/synthetic_booking_requests.csv
```

## Main API routes

```txt
POST   /api/auth/login
GET    /api/patients
POST   /api/patients
GET    /api/doctors
GET    /api/doctors/{doctor_id}/availability
GET    /api/appointments
POST   /api/appointments
PATCH  /api/appointments/{appointment_id}
POST   /api/appointments/{appointment_id}/complete
POST   /api/appointments/{appointment_id}/cancel
POST   /api/appointments/{appointment_id}/follow-up
GET    /api/billing/invoices
POST   /api/billing/payments
POST   /api/ml/booking-intent/predict
POST   /api/ml/booking-intent/train
```
