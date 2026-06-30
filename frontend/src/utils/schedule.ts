import { addDays, getEndTime, toISODate } from "./date";

export const SCHEDULE_TIME_SLOTS = Array.from({ length: 26 }, (_, index) => {
  const total = 8 * 60 + index * 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
});

export function buildWeekDates(startSunday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(startSunday, i)));
}

export function makeAppointmentId(): string {
  return `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export { getEndTime };
