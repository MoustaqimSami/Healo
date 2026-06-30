import type { BookingIntentPrediction } from "../types/domain";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `API request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  predictBookingIntent(text: string): Promise<BookingIntentPrediction> {
    return request<BookingIntentPrediction>("/ml/booking-intent/predict", {
      method: "POST",
      body: JSON.stringify({ text })
    });
  }
};
