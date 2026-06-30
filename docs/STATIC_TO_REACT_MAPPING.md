# Static Prototype → React/TypeScript Mapping

This document explains the 1-to-1 conversion from the uploaded static clinic prototype into the placeholder React + TypeScript architecture.

| Uploaded static source | New React/TypeScript target | Notes |
|---|---|---|
| `index.html` | `frontend/index.html`, `src/main.tsx` | Static redirect replaced by a React root entry point. |
| `login.html`, `login.js`, `loginstyle.css`, `staff-database.js` | `pages/LoginPage.tsx`, `hooks/ClinicDataProvider.tsx`, `styles/login.css`, backend `/api/auth/login` | Credential validation moved into typed staff seed data and backend auth route. |
| `dashboard.html`, `dashboard-*.js` | `pages/DashboardPage.tsx`, `components/appointments/AppointmentCard.tsx`, `components/ui/ConfirmModal.tsx`, `utils/date.ts` | Calendar, appointment tabs, complete/cancel/follow-up and doctors-today logic converted into React state updates. |
| `patients.html`, `patients.js` | `pages/PatientsPage.tsx` | Search, gender filter, sort, add-patient modal, active patient selection, and local persistence converted to typed React handlers. |
| `patients-profile.html`, `patient-page.js`, `patient-book-appointment.js` | `pages/PatientProfilePage.tsx` | Profile rendering, active-patient lookup, and book-appointment navigation are now component state + route params. |
| `patients-appointments.html`, `patients-appointments.js` | `pages/PatientAppointmentsPage.tsx` | Patient appointment table, computed status, view action, and booking shortcut moved into typed component logic. |
| `patients-billing.html`, `patients-billing-process-payment.html`, `billing.css` | `pages/PatientBillingPage.tsx`, backend `/api/billing/*` | Static invoice table converted into invoice/payment domain models. |
| `doctors.html`, `doctors-page.js` | `pages/DoctorsPage.tsx`, `utils/availability.ts` | Doctor filtering, specialty/gender/status filters, and schedule navigation converted to React. |
| `doctorsSchedule.html`, `doctors-schedule.js`, `week-selector.js` | `pages/DoctorSchedulePage.tsx`, `components/appointments/AppointmentModal.tsx`, `utils/schedule.ts` | Weekly grid, available/occupied slots, week navigation, reschedule mode, and selected doctor state converted to TS. |
| `appointmentModal-core.js`, `appointmentModal-buttons.js`, `appointmentModal-doctorSearch.js`, `appointmentModal-patientSearch.js` | `components/appointments/AppointmentModal.tsx` | Modal state machine is now a single controlled React component with typed props and callbacks. |
| `appointments-database.js`, `patients-database.js`, `doctors-database.js` | `frontend/src/data/seedData.ts`, `backend/app/seed.py`, `backend/app/models.py` | In-memory JS structures converted into typed seed data and relational backend schema. |
| `style.css`, `template.css`, `components.css`, `patients.css`, `scheduleStyle.css`, `scheduleTemplate.css`, `doctorsSchedule.css`, `appointmentPopup.css` | `frontend/src/styles/*.css` | Original design language retained: Figtree, teal/coral palette, side nav, cards, tables, modals, status toasts. |
| `assets/icons/*` | `frontend/public/assets/icons/*` | Placeholder SVG icons included so the app renders without missing assets. |

## Design preservation goals

- Keep the receptionist-first workflow from the original prototype.
- Preserve the green/teal healthcare palette and simple card/table layout.
- Keep fast dashboard actions: booking, add patient, complete/cancel appointment, follow-up.
- Keep appointment lifecycle consistency across dashboard, patient views, doctor views, and billing.

## Engineering upgrades

- Plain JavaScript functions became typed utilities, hooks, and components.
- Global `window.*Database` objects became context state and backend schema tables.
- LocalStorage remains as a frontend demo persistence layer, while backend SQLAlchemy models show the production direction.
- ML booking intent is now a real scikit-learn pipeline with training and prediction routes.
