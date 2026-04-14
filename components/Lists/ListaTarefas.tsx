// components/Lists/ListaTarefas.tsx
import { Task, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { CheckCircle2, Circle, XCircle, Pencil, Trash2, Calendar } from "lucide-react";

interface ListaTarefasProps {
  tasks: Task[];
  loading?: boolean;
  onToggleStatus?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function StatusChip({ status }: { status: TaskStatus }) {
  if (status === "DONE")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">
        <CheckCircle2 className="w-3 h-3" />
        Concluída
      </span>
    );
  if (status === "CANCELLED")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-danger/10 text-status-danger">
        <XCircle className="w-3 h-3" />
        Cancelada
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-warning/10 text-status-warning">
      <Circle className="w-3 h-3" />
      Pendente
    </span>
  );
}

const ListaTarefas: React.FC<ListaTarefasProps> = ({
  tasks,
  loading = false,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-background-subtle animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-background-subtle rounded-lg animate-pulse w-3/4" />
              <div className="h-2.5 bg-background-subtle rounded-lg animate-pulse w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm font-medium text-text-base">Nenhuma tarefa aqui</p>
        <p className="mt-1 text-xs text-text-muted">
          Use o FinIA no WhatsApp para criar lembretes e organize tudo por aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-elevated rounded-2xl shadow-soft overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold">Tarefas</h2>
        <span className="text-[11px] text-text-muted bg-background-subtle px-2 py-0.5 rounded-full">
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="px-4 py-3.5 flex items-start gap-3 hover:bg-background-subtle/50 active:bg-background-subtle transition"
          >
            {/* Botão toggle status */}
            <button
              type="button"
              onClick={() => onToggleStatus && onToggleStatus(task)}
              className={`
                mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition active:scale-90
                ${
                  task.status === "DONE"
                    ? "border-status-success bg-status-success"
                    : task.status === "CANCELLED"
                    ? "border-status-danger bg-status-danger"
                    : "border-border-strong bg-transparent hover:border-brand"
                }
              `}
              aria-label="Alterar status da tarefa"
            >
              {task.status === "DONE" && (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              )}
              {task.status === "CANCELLED" && (
                <XCircle className="w-3.5 h-3.5 text-white" />
              )}
            </button>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.status === "DONE"
                    ? "line-through text-text-muted"
                    : "text-text-base"
                }`}
              >
                {task.title}
              </p>

              {task.description && (
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusChip status={task.status} />

                {task.dueDate && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-0.5 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="p-2 rounded-xl hover:bg-background-subtle text-text-muted transition active:scale-90"
                  aria-label="Editar tarefa"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  className="p-2 rounded-xl hover:bg-status-danger/10 text-status-danger transition active:scale-90"
                  aria-label="Excluir tarefa"
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

export default ListaTarefas;
