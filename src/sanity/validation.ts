export function outboundUrl(value: unknown, contact = false): true | string {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return "Enter a valid URL";
  try {
    const url = new URL(value);
    return (url.protocol === "https:" && !!url.hostname) ||
      (contact &&
        url.protocol === "mailto:" &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname))
      ? true
      : "Use HTTPS (or mailto for contact links)";
  } catch {
    return "Enter a valid URL";
  }
}
export function youtubeId(value: unknown): true | string {
  return value == null ||
    value === "" ||
    (typeof value === "string" && /^[A-Za-z0-9_-]{11}$/.test(value))
    ? true
    : "Use the 11-character YouTube ID";
}
export function imageAccessibility(value: unknown): true | string {
  if (value === undefined || value === null) return true;
  const image = value as { alt?: string; decorative?: boolean } | undefined;
  return image?.decorative === true || !!image?.alt?.trim()
    ? true
    : "Add alternative text or mark decorative";
}
export function timezone(value: unknown): true | string {
  try {
    if (typeof value !== "string" || !value) return "Timezone required";
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return "Use an IANA timezone, such as Africa/Windhoek";
  }
}
