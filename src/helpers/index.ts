const ALLOWED_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
const ALLOWED_SVG_EXTS = [".svg"];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];

const ALLOWED_SVG_TYPE = [
  "image/svg",
];

export function hasAllowedExtension(name: string) {
  const lower = name.toLowerCase();
  return ALLOWED_IMAGE_EXTS.some((ext) => lower.endsWith(ext));
}

export function hasAllowedSvgExtension(name: string) {
  const lower = name.toLowerCase();
  return ALLOWED_SVG_EXTS.some((ext) => lower.endsWith(ext));
}

export function isAllowedMimeType(type: string | undefined) {
  if (!type) return false;
  return ALLOWED_IMAGE_TYPES.includes(type);
}

export function isAllowedSvgMimeType(type: string | undefined) {
  if (!type) return false;
  return ALLOWED_SVG_TYPE.includes(type);
}

export function guessMimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  return "application/octet-stream";
}

export function guessSvgMimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg";
  return "application/octet-stream";
}

export const formatUSD = (amountInCents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
};

