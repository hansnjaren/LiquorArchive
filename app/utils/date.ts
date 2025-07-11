export function getNowISOStringWithMs() {
  const now = new Date();
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return now
    .toISOString()
    .replace("Z", `.${ms}Z`)
    .replace(/\.\d{3}\./, ".");
}
