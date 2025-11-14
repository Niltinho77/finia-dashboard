// lib/auth.ts
import { User } from "@/lib/api";

const TOKEN_KEY = "finia_token";
const USER_KEY = "finia_user";

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Salva sessão autenticada no navegador.
 * Usado tanto no login por telefone quanto no login por link mágico.
 */
export function setAuthSession(user: User, token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Limpa todos os dados de sessão do usuário.
 */
export function clearAuthSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Retorna o token JWT armazenado (ou null).
 */
export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retorna o usuário salvo no localStorage (ou null).
 */
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

/**
 * Indica se existe um token de autenticação salvo no navegador.
 * Lembrando: só faz sentido ser usado no cliente (dentro de useEffect, por exemplo).
 */
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