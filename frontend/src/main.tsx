import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClinicDataProvider } from "./hooks/ClinicDataProvider";
import { App } from "./App";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/login.css";
import "./styles/patients.css";
import "./styles/schedule.css";
import "./styles/appointmentModal.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClinicDataProvider>
        <App />
      </ClinicDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
