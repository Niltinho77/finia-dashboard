// pages/tarefas.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Task,
  TaskStatus,
  fetchTasks,
  updateTask,
  deleteTask,
  ApiError,
} from "@/lib/api";
import ListaTarefas from "@/components/Lists/ListaTarefas";
import ModalNovaTarefa from "@/components/Modals/ModalNovaTarefa";
import ModalEditarTarefa from "@/components/Modals/ModalEditarTarefa";

type StatusFilter = "ALL" | TaskStatus;

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data ?? []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    // 1) Aplica o filtro de status
    const base = tasks.filter((t) => {
      if (statusFilter === "ALL") return true;
      return t.status === statusFilter;
    });

    // 2) Ordena: pendentes primeiro, canceladas no meio, concluídas por último
    const statusOrder: Record<TaskStatus, number> = {
      PENDING: 0,
      CANCELLED: 1,
      DONE: 2,
    };

    return [...base].sort((a, b) => {
      const diff = statusOrder[a.status] - statusOrder[b.status];
      if (diff !== 0) return diff;

      // opcional: se status for igual, pode ordenar por data de criação
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aDate - bDate;
    });
  }, [tasks, statusFilter]);

  const handleToggleStatus = async (task: Task) => {
    let nextStatus: TaskStatus;
    if (task.status === "PENDING") nextStatus = "DONE";
    else if (task.status === "DONE") nextStatus = "PENDING";
    else nextStatus = "PENDING";

    try {
      await updateTask({ id: task.id, status: nextStatus });
      await loadTasks();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao atualizar tarefa.");
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleDelete = async (task: Task) => {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao excluir tarefa.");
    }
  };

  const handleAfterChange = async () => {
    await loadTasks();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Tarefas
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Organize lembretes e pendências ligadas à sua vida financeira
            e rotina.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <select
            className="text-xs md:text-sm rounded-full border border-border-subtle bg-background-elevated px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
          >
            <option value="ALL">Todas</option>
            <option value="PENDING">Pendentes</option>
            <option value="DONE">Concluídas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="btn-primary text-xs md:text-sm"
          >
            Nova tarefa
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      <ListaTarefas
        tasks={filteredTasks}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ModalNovaTarefa
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreated={handleAfterChange}
      />

      <ModalEditarTarefa
        open={showEditModal}
        task={selectedTask}
        onClose={() => setShowEditModal(false)}
        onUpdated={handleAfterChange}
      />
    </div>
  );
}