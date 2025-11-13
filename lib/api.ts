// lib/api.ts
import axios, { AxiosError, AxiosInstance } from "axios";

/**
 * TIPOS GERAIS
 */
export type PlanType = "TRIAL" | "PREMIUM";

export interface User {
  id: string;
  nome: string;
  telefone?: string;
  idioma?: string;
  plano: PlanType;
  trialExpiraEm?: string | null;
  premiumExpiraEm?: string | null;
  criadoEm?: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  description: string;
  amount: number; // valor em reais (ex.: 120.5 = R$ 120,50)
  type: TransactionType;
  category: string;
  date: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = "PENDING" | "DONE" | "CANCELLED";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

/**
 * CONFIGURAÇÃO DO AXIOS
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://finja-app-production.up.railway.app/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Anexa token automaticamente (quando existir)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("finia_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normaliza erros
function normalizeError(error: AxiosError): ApiError {
  const status = error.response?.status;
  const data = error.response?.data;
  let message = "Ocorreu um erro inesperado. Tente novamente.";

  if (data && typeof data === "object" && "message" in data) {
    message = String((data as any).message);
  } else if (typeof data === "string") {
    message = data;
  } else if (error.message) {
    message = error.message;
  }

  return { message, status, data };
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error));
  }
);

/**
 * WRAPPERS GENÉRICOS
 */
async function get<T>(url: string, params?: unknown): Promise<T> {
  const response = await api.get<T>(url, { params });
  return response.data;
}

async function post<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await api.post<T>(url, body);
  return response.data;
}

async function put<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await api.put<T>(url, body);
  return response.data;
}

async function del<T>(url: string): Promise<T> {
  const response = await api.delete<T>(url);
  return response.data;
}

/**
 * ENDPOINTS DE AUTENTICAÇÃO / USUÁRIO
 */
interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Efetua login enviando o telefone (conforme o back-end espera).
 * Ajuste o nome do campo se sua rota aceitar um token em vez de telefone.
 */
export async function loginWithPhone(telefone: string): Promise<LoginResponse> {
  return post<LoginResponse, { telefone: string }>("/auth/login", { telefone });
}

/**
 * Retorna o usuário autenticado.
 */
export async function fetchCurrentUser(): Promise<User> {
  return get<User>("/auth/me");
}

/**
 * ENDPOINTS DE TRANSAÇÕES
 */
export interface TransactionFilters {
  from?: string; // ISO date
  to?: string;   // ISO date
  type?: TransactionType;
  category?: string;
}

export async function fetchTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  return get<Transaction[]>("/transactions", filters);
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO
}

export async function createTransaction(
  payload: CreateTransactionInput
): Promise<Transaction> {
  return post<Transaction, CreateTransactionInput>("/transactions", payload);
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string;
}

export async function updateTransaction(
  payload: UpdateTransactionInput
): Promise<Transaction> {
  const { id, ...data } = payload;
  return put<Transaction, Partial<CreateTransactionInput>>(
    `/transactions/${id}`,
    data
  );
}

export async function deleteTransaction(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/transactions/${id}`);
}

/**
 * ENDPOINTS DE TAREFAS
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: TaskStatus;
}

export async function fetchTasks(): Promise<Task[]> {
  return get<Task[]>("/tasks");
}

export async function createTask(payload: CreateTaskInput): Promise<Task> {
  return post<Task, CreateTaskInput>("/tasks", payload);
}

export async function updateTask(payload: UpdateTaskInput): Promise<Task> {
  const { id, ...data } = payload;
  return put<Task, Partial<UpdateTaskInput>>(`/tasks/${id}`, data);
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/tasks/${id}`);
}

/**
 * ENDPOINTS AUXILIARES (ex.: Stripe, IA, etc.)
 */
export interface CheckoutSessionResponse {
  checkoutUrl: string;
}

export async function createCheckoutSession(userId: string) {
  return post<CheckoutSessionResponse, { userId: string }>(
    "/stripe/checkout",
    { userId }
  );
}

export interface IaAnalyzeResponse {
  resposta: string;
  comando?: string;
  tipo?: string;
}

export async function analyzeIaMessage(mensagem: string, telefone?: string) {
  return post<IaAnalyzeResponse, { mensagem: string; telefone?: string }>(
    "/ia/analisar",
    { mensagem, telefone }
  );
}

export { api, normalizeError };
