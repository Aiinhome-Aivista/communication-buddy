import { format, parseISO } from 'date-fns';

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
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
  return format(parseISO(isoString), 'yyyy-MM-dd HH:mm:ss');
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
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, '0');
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








