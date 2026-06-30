import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DoctorSchedulePage } from "./pages/DoctorSchedulePage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { LoginPage } from "./pages/LoginPage";
import { MLBookingAssistantPage } from "./pages/MLBookingAssistantPage";
import { PatientAppointmentsPage } from "./pages/PatientAppointmentsPage";
import { PatientBillingPage } from "./pages/PatientBillingPage";
import { PatientProfilePage } from "./pages/PatientProfilePage";
import { PatientsPage } from "./pages/PatientsPage";
import { SchedulePage } from "./pages/SchedulePage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:patientId/profile" element={<PatientProfilePage />} />
        <Route path="/patients/:patientId/appointments" element={<PatientAppointmentsPage />} />
        <Route path="/patients/:patientId/billing" element={<PatientBillingPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:doctorId/schedule" element={<DoctorSchedulePage />} />
        <Route path="/ml-booking-assistant" element={<MLBookingAssistantPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
