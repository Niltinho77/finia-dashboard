// lib/formatters.ts

/**
 * Formata um valor numérico como moeda BRL.
 * Ex.: formatCurrency(1234.5) -> "R$ 1.234,50"
 */
export function formatCurrency(value: number, withSign: boolean = false): string {
  if (Number.isNaN(value)) return "R$ 0,00";

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);

  if (!withSign) return formatted;
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign} ${formatted}`;
}

/**
 * Formata data no padrão brasileiro: dd/MM/yyyy
 */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formata data e hora: dd/MM/yyyy às HH:mm
 */
export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";

  const d = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const t = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${d} às ${t}`;
}

/**
 * Formata um número entre 0 e 1 ou 0 e 100 como porcentagem.
 * Ex.: formatPercent(0.25) -> "25 %", formatPercent(25, true) -> "25 %"
 */
export function formatPercent(value: number, alreadyInPercent: boolean = false): string {
  const v = alreadyInPercent ? value : value * 100;
  return `${v.toFixed(1).replace(".", ",")} %`;
}

/**
 * Gera um nome curto para exibir no Header / Sidebar.
 * Ex.: "Newton Cardoso Neto" -> "Newton Cardoso"
 */
export function formatShortName(fullName?: string | null): string {
  if (!fullName) return "Usuário";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1]}`;
}

/**
 * Mascara simples de telefone brasileiro.
 * Ex.: "5599999999999" -> "+55 (99) 99999-9999"
 */
export function formatPhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 10) return phone;

  const country = digits.length > 11 ? digits.slice(0, digits.length - 11) : "55";
  const ddd = digits.slice(-11, -9);
  const first = digits.slice(-9, -4);
  const last = digits.slice(-4);

  return `+${country} (${ddd}) ${first}-${last}`;
}