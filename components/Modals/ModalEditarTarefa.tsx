// components/Modals/ModalEditarTarefa.tsx
import { useEffect, useState } from "react";
import { Task, TaskStatus, updateTask, ApiError } from "@/lib/api";

interface ModalEditarTarefaProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated?: () => void;
}

const toDateLocal = (isoDate: string) => {
  const d = new Date(isoDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

const ModalEditarTarefa: React.FC<ModalEditarTarefaProps> = ({
  open,
  task,
  onClose,
  onUpdated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setDueDate(task.dueDate ? toDateLocal(task.dueDate) : null);
      setError(null);
    }
  }, [task, open]);

  if (!open || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Título é obrigatório.");
      return;
    }

    try {
      setSubmitting(true);
      await updateTask({
        id: task.id,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao atualizar tarefa.");
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
          <h2 className="text-lg font-semibold">Editar tarefa</h2>
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
              Título
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Descrição
            </label>
            <textarea
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Status
            </label>
            <select
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="PENDING">Pendente</option>
              <option value="DONE">Concluída</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted">
              Prazo
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm bg-background-base focus:outline-none focus:ring-1 focus:ring-brand"
              value={dueDate ?? ""}
              onChange={(e) => setDueDate(e.target.value || null)}
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
              {submitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarTarefa;