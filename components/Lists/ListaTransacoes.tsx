// components/Lists/ListaTransacoes.tsx
import { Transaction } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { Pencil, Trash2 } from "lucide-react";

interface ListaTransacoesProps {
  transactions: Transaction[];
  loading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const ListaTransacoes: React.FC<ListaTransacoesProps> = ({
  transactions,
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-4">
        <div className="h-8 bg-background-subtle rounded-xl animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-background-subtle rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-5 text-sm text-text-muted">
        <p>Você ainda não possui transações cadastradas.</p>
        <p className="mt-1 text-xs">
          Registre seus gastos e entradas pelo WhatsApp ou use o botão
          &ldquo;Nova transação&rdquo; para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-elevated rounded-2xl shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold">Transações</h2>
        <span className="text-[11px] text-text-muted">
          {transactions.length}{" "}
          {transactions.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="px-4 py-3 flex items-center gap-3 hover:bg-background-subtle/60 transition text-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium truncate">{t.description}</p>
                <span
                  className={`font-semibold ${
                    t.type === "INCOME"
                      ? "text-status-success"
                      : "text-status-danger"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "−"}
                  {formatCurrency(Math.abs(t.amount))}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-text-muted">
                <span className="truncate">
                  {t.category || "Sem categoria"}
                </span>
                <span>{formatDateTime(t.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(t)}
                  className="p-1.5 rounded-full hover:bg-background-subtle text-text-muted"
                  aria-label="Editar transação"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(t)}
                  className="p-1.5 rounded-full hover:bg-background-subtle text-status-danger"
                  aria-label="Excluir transação"
                >
                  <Trash2 className="w-4 h-4" />
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