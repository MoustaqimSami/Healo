export function parseISODateToLocal(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

export function toISODate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function sameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

export function getSunday(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function formatDayRangeLabel(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const startMonth = weekStart.toLocaleDateString(undefined, { month: "short" });
  const endMonth = end.toLocaleDateString(undefined, { month: "short" });
  if (weekStart.getMonth() === end.getMonth()) {
    return `${weekStart.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
  }
  return `${weekStart.getDate()} ${startMonth} ${weekStart.getFullYear()} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function formatAppointmentDateTime(dateStr: string, timeStr: string): string {
  const d = new Date(`${dateStr}T${timeStr}`);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const date = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  return `${time} - ${date}`;
}

export function formatPrettyDate(dateStr: string): string {
  return parseISODateToLocal(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatTimeTo12h(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const suffix = h >= 12 ? "PM" : "AM";
  h = ((h + 11) % 12) + 1;
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function getEndTime(start: string, minutes = 30): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nextH = Math.floor(total / 60);
  const nextM = total % 60;
  return `${String(nextH).padStart(2, "0")}:${String(nextM).padStart(2, "0")}`;
}

export function getPatientInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
