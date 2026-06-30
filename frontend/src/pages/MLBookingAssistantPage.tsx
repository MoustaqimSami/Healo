import { FormEvent, useState } from "react";
import { apiClient } from "../api/client";
import type { BookingIntentPrediction } from "../types/domain";

const fallbackRules = [
  ["cancel", "cancel_appointment"],
  ["reschedule", "reschedule_appointment"],
  ["move", "reschedule_appointment"],
  ["book", "book_appointment"],
  ["appointment", "book_appointment"],
  ["invoice", "billing_question"],
  ["bill", "billing_question"],
  ["record", "records_request"],
  ["check in", "check_in"]
] as const;

export function MLBookingAssistantPage() {
  const [text, setText] = useState("I need to book an appointment with Dr. Chen tomorrow morning.");
  const [prediction, setPrediction] = useState<BookingIntentPrediction | null>(null);
  const [error, setError] = useState("");

  async function predict(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setPrediction(await apiClient.predictBookingIntent(text));
    } catch {
      const rule = fallbackRules.find(([needle]) => text.toLowerCase().includes(needle));
      const intent = rule?.[1] || "general_question";
      setPrediction({ intent, confidence: 0.78, recommendedAction: "Backend offline: using frontend fallback. Start the matching receptionist workflow." });
      setError("Backend is not running, so this used a local fallback rule. Start FastAPI for the scikit-learn model.");
    }
  }

  return (
    <main className="page"><header className="page-header page-header--column"><h1 className="page-title">AI Booking Assistant</h1><p className="muted">Naïve Bayes booking-intent classifier for receptionist requests.</p></header><section className="page-body page-body--section"><form className="ml-card" onSubmit={predict}><label className="appointment-field-label">Patient request</label><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} /><button className="btn">Classify request</button></form>{error && <p className="appointment-status-stub appointment-status-stub--info is-visible inline-status">{error}</p>}{prediction && <div className="ml-result"><h2>Prediction</h2><p><strong>Intent:</strong> {prediction.intent}</p><p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p><p><strong>Recommended action:</strong> {prediction.recommendedAction}</p></div>}</section></main>
  );
}
