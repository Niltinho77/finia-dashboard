// lib/auth.ts
import { User } from "@/lib/api";

const TOKEN_KEY = "finia_token";
const USER_KEY = "finia_user";

function isBrowser() {
  return typeof window !== "undefined";
}

export function setAuthSession(user: User, token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  const token = getAuthToken();
  return Boolean(token);
}

/**
 * Helper simples pra logout no front.
 */
export function logoutClientSide() {
  clearAuthSession();
}