export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  return "http://localhost:3000";
}
