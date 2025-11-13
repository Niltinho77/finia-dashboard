// components/Cards/CardTarefas.tsx
import { Task, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

interface CardTarefasProps {
  tasks: Task[];
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "DONE":
      return (
        <CheckCircle2 className="w-4 h-4 text-status-success" />
      );
    case "CANCELLED":
      return <XCircle className="w-4 h-4 text-status-danger" />;
    case "PENDING":
    default:
      return <Circle className="w-4 h-4 text-text-muted" />;
  }
}

const CardTarefas: React.FC<CardTarefasProps> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  const topTasks = tasks.slice(0, 4);

  return (
    <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 h-full flex flex-col">
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Organização
          </p>
          <h2 className="text-lg font-semibold">Tarefas</h2>
        </div>
        <div className="text-right text-xs text-text-muted">
          <div>{total} tarefas</div>
          <div className="text-[11px]">
            {pending} pendentes • {done} concluídas
          </div>
        </div>
      </header>

      {topTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-start justify-center gap-2">
          <p className="text-sm text-text-muted">
            Você ainda não cadastrou tarefas.
          </p>
          <p className="text-xs text-text-muted">
            Use o FinIA para criar lembretes do tipo{" "}
            <span className="font-semibold">
              &ldquo;Me lembrar de pagar o cartão amanhã&rdquo;
            </span>{" "}
            e acompanhe tudo aqui.
          </p>
        </div>
      ) : (
        <ul className="flex-1 space-y-2 mt-1">
          {topTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start gap-2 rounded-xl px-3 py-2 hover:bg-background-subtle/80 transition text-sm"
            >
              <div className="mt-0.5">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1">
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
                {task.dueDate && (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Prazo: {formatDate(task.dueDate)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="pt-3 mt-2 border-t border-border-subtle text-[11px] text-text-muted flex justify-between">
        <span>
          Em breve: arrastar para concluir direto daqui.
        </span>
        <span className="hidden sm:inline">
          Ver todas em <span className="font-semibold">/tarefas</span>
        </span>
      </footer>
    </section>
  );
};

export default CardTarefas;