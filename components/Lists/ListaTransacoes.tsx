// components/Lists/ListaTransacoes.tsx
import { Transaction } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface ListaTransacoesProps {
  transactions: Transaction[];
  loading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

/** Gera iniciais ou emoji para o avatar da categoria */
function categoryAvatar(category: string, type: "INCOME" | "EXPENSE") {
  const emojis: Record<string, string> = {
    alimentacao: "🍔",
    mercado: "🛒",
    transporte: "🚗",
    saude: "💊",
    lazer: "🎮",
    educacao: "📚",
    moradia: "🏠",
    roupas: "👕",
    salario: "💼",
    freelance: "💻",
    investimento: "📈",
    outros: "📦",
  };

  const key = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  for (const [k, emoji] of Object.entries(emojis)) {
    if (key.includes(k)) return emoji;
  }

  return type === "INCOME" ? "💰" : "💸";
}

const ListaTransacoes: React.FC<ListaTransacoesProps> = ({
  transactions,
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-background-subtle animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-background-subtle rounded-lg animate-pulse w-3/4" />
              <div className="h-2.5 bg-background-subtle rounded-lg animate-pulse w-1/2" />
            </div>
            <div className="h-4 w-16 bg-background-subtle rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-6 text-center">
        <p className="text-2xl mb-2">💳</p>
        <p className="text-sm font-medium text-text-base">
          Nenhuma transação encontrada
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Registre seus gastos e entradas pelo WhatsApp ou clique em{" "}
          "Nova transação".
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-elevated rounded-2xl shadow-soft overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold">Transações</h2>
        <span className="text-[11px] text-text-muted bg-background-subtle px-2 py-0.5 rounded-full">
          {transactions.length}{" "}
          {transactions.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="px-4 py-3.5 flex items-center gap-3 hover:bg-background-subtle/50 active:bg-background-subtle transition"
          >
            {/* Avatar com emoji da categoria */}
            <div
              className={`
                w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg
                ${
                  t.type === "INCOME"
                    ? "bg-status-success/10"
                    : "bg-status-danger/10"
                }
              `}
            >
              {categoryAvatar(t.category || "outros", t.type)}
            </div>

            {/* Conteúdo central */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{t.description}</p>
                <span
                  className={`text-sm font-bold shrink-0 ${
                    t.type === "INCOME"
                      ? "text-status-success"
                      : "text-status-danger"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "−"}
                  {formatCurrency(Math.abs(t.amount))}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                {/* Chip tipo */}
                <span
                  className={`
                    inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                    ${
                      t.type === "INCOME"
                        ? "bg-status-success/10 text-status-success"
                        : "bg-status-danger/10 text-status-danger"
                    }
                  `}
                >
                  {t.type === "INCOME" ? (
                    <ArrowDownLeft className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  )}
                  {t.type === "INCOME" ? "Entrada" : "Saída"}
                </span>

                {/* Categoria */}
                <span className="text-[11px] text-text-muted truncate">
                  {t.category || "Sem categoria"}
                </span>

                {/* Data — empurra para direita */}
                <span className="ml-auto text-[11px] text-text-muted shrink-0">
                  {formatDateTime(t.date)}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-0.5 ml-1 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(t)}
                  className="p-2 rounded-xl hover:bg-background-subtle text-text-muted transition active:scale-90"
                  aria-label="Editar transação"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(t)}
                  className="p-2 rounded-xl hover:bg-status-danger/10 text-status-danger transition active:scale-90"
                  aria-label="Excluir transação"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaTransacoes;
