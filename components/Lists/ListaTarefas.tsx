// components/Lists/ListaTarefas.tsx
import { Task, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { CheckCircle2, Circle, XCircle, Pencil, Trash2 } from "lucide-react";

interface ListaTarefasProps {
  tasks: Task[];
  loading?: boolean;
  onToggleStatus?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "DONE":
      return <CheckCircle2 className="w-4 h-4 text-status-success" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4 text-status-danger" />;
    case "PENDING":
    default:
      return <Circle className="w-4 h-4 text-text-muted" />;
  }
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

  if (tasks.length === 0) {
    return (
      <div className="bg-background-elevated rounded-2xl shadow-soft p-5 text-sm text-text-muted">
        <p>Você ainda não possui tarefas cadastradas.</p>
        <p className="mt-1 text-xs">
          Use o FinIA para criar lembretes e organize aqui o que precisa fazer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-elevated rounded-2xl shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold">Tarefas</h2>
        <span className="text-[11px] text-text-muted">
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="px-4 py-3 flex items-start gap-3 hover:bg-background-subtle/60 transition text-sm"
          >
            <button
              type="button"
              onClick={() => onToggleStatus && onToggleStatus(task)}
              className="mt-0.5 p-1 rounded-full hover:bg-background-subtle"
              aria-label="Alterar status da tarefa"
            >
              {getStatusIcon(task.status)}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`font-medium ${
                  task.status === "DONE"
                    ? "line-through text-text-muted"
                    : ""
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-1 text-[11px] text-text-muted">
                <span className="truncate">
                  Status:{" "}
                  <span className="uppercase">
                    {task.status === "PENDING" && "Pendente"}
                    {task.status === "DONE" && "Concluída"}
                    {task.status === "CANCELLED" && "Cancelada"}
                  </span>
                </span>
                {task.dueDate && (
                  <span>Prazo: {formatDate(task.dueDate)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-full hover:bg-background-subtle text-text-muted"
                  aria-label="Editar tarefa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  className="p-1.5 rounded-full hover:bg-background-subtle text-status-danger"
                  aria-label="Excluir tarefa"
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

export default ListaTarefas;