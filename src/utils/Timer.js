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

// ✅ Calculate only session duration
export const getSessionDuration = (chat_history) => {
  if (!chat_history || chat_history.length === 0) return "N/A";

  // ✅ Filter only valid messages with time property
  const messages = chat_history.filter((msg) => typeof msg === "object" && msg.time);
  if (messages.length < 2) return "N/A";

  const start = parseTime(messages[0].time);
  const end = parseTime(messages[messages.length - 1].time);

  const diffMs = end - start;
  const totalMinutes = diffMs / 60000;

  // ✅ Round off to nearest minute
  const roundedMinutes = Math.round(totalMinutes);

  // ✅ If less than 1 min, show "< 1 min"
  return roundedMinutes > 0 ? `${roundedMinutes} min` : "< 1 min";
};






