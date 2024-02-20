/** seconds to hh:mm:ss.mmm */
export function formatTime(number = 0) {
  return (
    new Date(1000 * number).toISOString().substring(14, 19) +
    "." +
    String(Math.round((number % 1) * 1000)).padEnd(3, "0")
  );
}
