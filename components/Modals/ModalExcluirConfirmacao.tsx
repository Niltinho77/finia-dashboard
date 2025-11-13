// components/Modals/ModalExcluirConfirmacao.tsx
import { useState } from "react";
import { Transaction, deleteTransaction, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";

interface ModalExcluirConfirmacaoProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onDeleted?: () => void;
}

const ModalExcluirConfirmacao: React.FC<ModalExcluirConfirmacaoProps> = ({
  open,
  transaction,
  onClose,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !transaction) return null;

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleDelete = async () => {
    if (!transaction) return;
    setError(null);

    try {
      setLoading(true);
      await deleteTransaction(transaction.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao excluir transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-background-elevated rounded-2xl shadow-medium w-full max-w-sm mx-4 p-5 md:p-6">
        <h2 className="text-base font-semibold mb-2">
          Confirmar exclusão
        </h2>
        <p className="text-sm text-text-muted">
          Tem certeza de que deseja excluir esta transação?
        </p>

        <div className="mt-3 p-3 rounded-xl bg-background-subtle text-sm">
          <p className="font-medium">{transaction.description}</p>
          <p className="text-xs text-text-muted mt-1">
            {transaction.category || "Sem categoria"} •{" "}
            {formatCurrency(transaction.amount)} •{" "}
            {transaction.type === "INCOME" ? "Entrada" : "Saída"}
          </p>
        </div>

        {error && (
          <div className="mt-3 text-xs text-status-danger bg-status-danger/5 border border-status-danger/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-status-danger text-white text-sm font-medium shadow-soft hover:opacity-90 transition"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExcluirConfirmacao;