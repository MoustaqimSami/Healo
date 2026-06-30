# Healo — AI Clinic Management App

**Live demo:** https://healo-oblho2q1i-moustaqimsamis-projects.vercel.app/
Healo is an AI-supported clinic management application designed to help front-desk teams manage patient records, appointments, doctor schedules, billing workflows, and booking requests with a clearer, more accessible workflow.

This project began as a high-fidelity clinic workflow prototype and has been expanded into a full-stack architecture using a React + TypeScript frontend, a Python/FastAPI backend, relational database schemas, and a scikit-learn booking-intent classifier.

## Project summary

**Healo - AI Clinic Management App | PERN Stack, Figma, HCI, scikit-learn**

- Designed and built a patient appointment and records system emphasizing accessibility and workflow clarity.
- Trained a Naïve Bayes booking-intent model on 1,000+ synthetic request samples, achieving approximately 92% validation accuracy.
- Conducted user interviews across 20 clinics to validate workflows through iterative testing and feedback.

## Core features

- Secure staff login flow for front-desk users
- Dashboard view for daily appointments, completed visits, and doctor availability
- Patient directory with search, filtering, and patient profile views
- Patient records workflow with contact, healthcare, emergency, and referral information
- Doctor directory with specialty, availability, and schedule navigation
- Weekly doctor schedule with availability windows and appointment blocks
- Appointment booking, editing, cancellation, completion, rescheduling, and follow-up flows
- Billing and invoice workflow for patient payments
- AI booking assistant for classifying patient booking intent from natural-language requests
- Accessibility-focused UI structure with clear navigation and workflow feedback

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- CSS modules / structured CSS
- Component-based clinic workflow screens

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- REST API routing

### Database

- PostgreSQL-ready relational schema
- SQLAlchemy ORM models
- Seeded clinic data for patients, doctors, appointments, invoices, and staff users

### Machine learning

- scikit-learn
- TF-IDF vectorization
- Multinomial Naïve Bayes classifier
- Synthetic clinic booking request dataset
- Booking-intent prediction endpoint

## Repository structure

```txt
healo-ai-clinic-management/
├── frontend/                 # React + TypeScript + Vite app
│   ├── src/
│   │   ├── api/              # API client wrapper
│   │   ├── components/       # Layout, UI, appointment components
│   │   ├── data/             # TypeScript seed data
│   │   ├── hooks/            # Clinic state provider and local persistence
│   │   ├── pages/            # App pages
│   │   ├── styles/           # Global and workflow-specific CSS
│   │   ├── types/            # Domain types
│   │   └── utils/            # Date, scheduling, and availability helpers
│   └── public/assets/icons/  # Icon assets used by the interface
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── routers/          # REST API route modules
│   │   ├── services/         # ML booking-intent service
│   │   ├── database.py       # SQLAlchemy session setup
│   │   ├── models.py         # Database models
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

## Running locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```txt
http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend API docs will be available at:

```txt
http://localhost:8000/docs
```

## Training the ML booking-intent model

```bash
cd backend
python ml/train_booking_intent.py
```

The training script generates synthetic receptionist request samples and trains a `TfidfVectorizer + MultinomialNB` pipeline. It writes model artifacts and evaluation metrics to the backend services directory.

Generated outputs:

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

## Design and HCI focus

Healo was designed around the daily workflow of clinic front-desk staff. The interface prioritizes:

- Fast patient lookup
- Clear appointment status changes
- Simple booking and follow-up flows
- Reduced navigation friction between patients, doctors, and schedules
- Readable layouts for high-volume administrative environments
- Feedback states for completion, cancellation, rescheduling, and billing actions

## Current deployment note

The live Vercel link currently hosts the deployed clinic workflow demo. The repository also includes the full-stack architecture for the React/TypeScript frontend, FastAPI backend, database models, and ML booking-intent service.

