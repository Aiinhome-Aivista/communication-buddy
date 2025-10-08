import { format, parseISO } from "date-fns";

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ✅ Parse a time string like "10:58:00 AM" into a Date object
export const parseTime = (timeStr) => {
  const today = new Date().toDateString(); // Use today's date for calculation
  return new Date(`${today} ${timeStr}`);
};
export const selectedDateFormat = (dateString) => {
  if (!dateString) return "";
  // ✅ datetime-local gives "YYYY-MM-DDTHH:mm"
  const isoString = dateString;
  return format(parseISO(isoString), "yyyy-MM-dd HH:mm:ss");
};

// Convert various server datetime strings (ISO, RFC) to a value usable by <input type="datetime-local">
export const toDatetimeLocalInput = (value) => {
  if (!value) return "";

  // Try to parse using Date constructor (handles ISO and RFC formats like 'Wed, 08 Oct 2025 18:12:00 GMT')
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    // Build YYYY-MM-DDTHH:MM using UTC components so a GMT timestamp preserves its hour/minute
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Fallback: if value looks like 'YYYY-MM-DD HH:mm:ss', convert space to T and slice
  try {
    const maybeIso = value.replace(" ", "T");
    const d2 = new Date(maybeIso);
    if (!isNaN(d2.getTime())) {
      const year = d2.getFullYear();
      const month = String(d2.getMonth() + 1).padStart(2, "0");
      const day = String(d2.getDate()).padStart(2, "0");
      const hours = String(d2.getHours()).padStart(2, "0");
      const minutes = String(d2.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  } catch (e) {
    // ignore
  }

  return "";
};

export const getDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString();
};
export const getTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Get UTC hours and minutes
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  // Format to 12-hour with AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");
  return `${hours}:${minutes} ${ampm}`;
};
// Time-only format function
export const formatTimeOnly = (timeString) => {
  if (!timeString) return "";

  // Dummy date দিয়ে parse করা
  const date = new Date(`1970-01-01T${timeString}Z`);

  if (isNaN(date.getTime())) return ""; // invalid হলে খালি string

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes} ${ampm}`;
};
