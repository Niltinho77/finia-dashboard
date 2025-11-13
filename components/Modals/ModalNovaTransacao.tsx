// components/Modals/ModalNovaTransacao.tsx
import { useState } from "react";
import {
  TransactionType,
  createTransaction,
  ApiError,
} from "@/lib/api";

interface ModalNovaTransacaoProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const defaultDateTimeLocal = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const ModalNovaTransacao: React.FC<ModalNovaTransacaoProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [description, setDescription] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState("");
  const [dateTime, setDateTime] = useState(defaultDateTimeLocal());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const raw = amountStr.replace(".", "").replace(",", ".");
    const amount = Number(raw);

    if (!description.trim()) {
      setError("Descrição é obrigatória.");
      return;
    }

    if (!amount || Number.isNaN(amount)) {
      setError("Informe um valor válido.");
      return;
    }

    if (!category.trim()) {
      setError("Categoria é obrigatória.");
      return;
    }

    try {
      setSubmitting(true);
      const isoDate = new Date(dateTime).toISOString();

      await createTransaction({
        description: description.trim(),
        amount,
        type,
        category: category.trim(),
        date: isoDate,
      });

      if (onCreated) onCreated();

      // limpa e fecha
      setDescription("");
      setAmountStr("");
      setCategory("");
      setDateTime(defaultDateTimeLocal());
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao criar transação.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-background-elevated rounded-2xl shadow-medium w-full max-w-md mx-4 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nova transação</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-muted text-sm hover:text-text-base"
          >
            Fechar
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Descrição
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Mercado, aluguel, salário..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Valor (R$)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Ex.: 120,50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Tipo
              </label>
              <select
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TransactionType)
                }
              >
                <option value="EXPENSE">Saída</option>
                <option value="INCOME">Entrada</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Categoria
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex.: Mercado, Moradia, Lazer..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Data e hora
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-xs text-status-danger bg-status-danger/5 border border-status-danger/30 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovaTransacao;