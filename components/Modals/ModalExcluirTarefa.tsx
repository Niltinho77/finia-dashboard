// components/Modals/ModalExcluirTarefa.tsx
import { useState } from "react";
import { Task, deleteTask, ApiError } from "@/lib/api";

interface ModalExcluirTarefaProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onDeleted?: () => void;
}

const ModalExcluirTarefa: React.FC<ModalExcluirTarefaProps> = ({
  open,
  task,
  onClose,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !task) return null;

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    setError(null);
    try {
      setLoading(true);
      await deleteTask(task.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao excluir tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-background-elevated rounded-t-3xl sm:rounded-2xl shadow-medium w-full max-w-sm sm:mx-4 p-5 md:p-6">
        <h2 className="text-base font-semibold mb-1">Excluir tarefa</h2>
        <p className="text-sm text-text-muted">
          Esta ação não pode ser desfeita.
        </p>

        <div className="mt-3 p-3 rounded-xl bg-background-subtle text-sm">
          <p className="font-medium">{task.title}</p>
          {task.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
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
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-status-danger text-white text-sm font-medium shadow-soft hover:opacity-90 active:scale-95 transition"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExcluirTarefa;
