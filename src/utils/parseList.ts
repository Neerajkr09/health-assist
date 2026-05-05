export const parseList = (raw: unknown): string[] => {
  if (!raw) return [];

  // Case 1: Already clean array (like workout)
  if (Array.isArray(raw) && typeof raw[0] === "string" && !raw[0].includes("[")) {
    return raw.map((item) => item.trim()).filter(Boolean);
  }

  // Case 2: Malformed list like ["['A','B']"]
  const str = Array.isArray(raw) ? raw.join(",") : String(raw);

  return str
    .replace(/[\[\]'"]/g, "")   // remove brackets + quotes
    .split(",")                 // split properly
    .map((s) => s.trim())
    .filter(Boolean);
};