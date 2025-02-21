import { verifyToken } from "./users";

export const makeApiRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = await verifyToken();
  if (!token) {
    return { error: "Token no proporcionado" };
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
