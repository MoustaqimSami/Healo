import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useClinicData } from "../hooks/ClinicDataProvider";

export function LoginPage() {
  const { login, currentStaff } = useClinicData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("selena@gmcclinic.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  if (currentStaff) return <Navigate to="/dashboard" replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const staff = login(email, password);
    if (!staff) {
      setMessage("Invalid email or password. Please try again.");
      return;
    }
    setMessage("Login successful!");
    navigate("/dashboard");
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/assets/icons/logo.svg" alt="Healo logo" className="logo-img" />
          <div className="title-text">
            <h1 className="brand-name">HEALO</h1>
            <h4 className="brand-sub">AI CLINIC MANAGEMENT</h4>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="email-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <label>Password</label>
          <div className="password-field">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            <button type="button" className="eye-icon-btn" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <Eye size={20} /> : <EyeOff size={20} />}</button>
          </div>
          <p className={`login-message ${message.includes("Invalid") ? "error" : "success"}`}>{message}</p>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
