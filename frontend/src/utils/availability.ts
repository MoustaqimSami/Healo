import type { Appointment, Doctor } from "../types/domain";
import { toISODate } from "./date";

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function getCapacitySlotsForDay(doc: Doctor, dayIndex: number): number {
  return doc.availabilityWindows
    .filter((w) => w.day === dayIndex)
    .reduce((sum, w) => {
      const diff = timeToMinutes(w.end) - timeToMinutes(w.start);
      if (diff <= 0) return sum;
      return sum + Math.floor(diff / 30);
    }, 0);
}

export type DoctorStatusKey = "available" | "busy" | "booked" | "out";

export interface DoctorStatus {
  key: DoctorStatusKey;
  tagText: string;
  tagClass: string;
  showTime: boolean;
  timeText?: string;
}

export function getDoctorStatusForDate(doc: Doctor, selectedDate: Date, appointments: Appointment[]): DoctorStatus {
  const dayIndex = selectedDate.getDay();
  const iso = toISODate(selectedDate);
  const hasAvailability = doc.availabilityWindows.some((w) => w.day === dayIndex);
  if (!hasAvailability) {
    return { key: "out", tagText: "Out of office", tagClass: "availability-card-tag--out", showTime: false };
  }

  const todaysAppts = appointments
    .filter((a) => a.doctorId === doc.id && a.date === iso && a.status !== "cancelled")
    .sort((a, b) => a.start.localeCompare(b.start));

  const capacity = getCapacitySlotsForDay(doc, dayIndex);
  if (todaysAppts.length === 0) {
    return { key: "available", tagText: "Available now", tagClass: "availability-card-tag--available", showTime: false };
  }
  if (!capacity || todaysAppts.length < capacity) {
    return { key: "busy", tagText: "In appointment", tagClass: "availability-card-tag--busy", showTime: true, timeText: todaysAppts.at(-1)?.end };
  }
  return { key: "booked", tagText: "Fully booked", tagClass: "availability-card-tag--booked", showTime: false };
}

export function isSlotAvailable(doc: Doctor, dayIndex: number, time: string): boolean {
  const minutes = timeToMinutes(time);
  return doc.availabilityWindows.some((win) => {
    if (win.day !== dayIndex) return false;
    const start = timeToMinutes(win.start);
    const end = timeToMinutes(win.end);
    return minutes >= start && minutes < end;
  });
}
