// components/Cards/CardTarefas.tsx
import Link from "next/link";
import { Task, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { CheckCircle2, Circle, XCircle, ArrowRight } from "lucide-react";

interface CardTarefasProps {
  tasks: Task[];
}

function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === "DONE")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-status-success/10 text-status-success">
        <CheckCircle2 className="w-3 h-3" />
        Feita
      </span>
    );
  if (status === "CANCELLED")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-status-danger/10 text-status-danger">
        <XCircle className="w-3 h-3" />
        Cancelada
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-status-warning/10 text-status-warning">
      <Circle className="w-3 h-3" />
      Pendente
    </span>
  );
}

const CardTarefas: React.FC<CardTarefasProps> = ({ tasks }) => {
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  const topTasks = tasks
    .filter((t) => t.status === "PENDING")
    .slice(0, 4);

  return (
    <section className="bg-background-elevated rounded-2xl shadow-soft p-5 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-text-muted font-medium">
            Organização
          </p>
          <h2 className="text-base font-semibold mt-0.5">Tarefas</h2>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {pending > 0 && (
            <span className="bg-status-warning/10 text-status-warning text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {pending} pendente{pending !== 1 ? "s" : ""}
            </span>
          )}
          {done > 0 && (
            <span className="text-[10px] text-text-muted">
              {done} concluída{done !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      {topTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
          <div className="w-10 h-10 rounded-2xl bg-background-subtle flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted font-medium">
            {tasks.length === 0
              ? "Nenhuma tarefa ainda"
              : "Tudo em dia! 🎉"}
          </p>
          <p className="text-xs text-text-muted/70 max-w-[180px]">
            {tasks.length === 0
              ? 'Diga "Me lembrar de pagar o cartão amanhã" no WhatsApp.'
              : "Nenhuma tarefa pendente no momento."}
          </p>
        </div>
      ) : (
        <ul className="flex-1 space-y-1">
          {topTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 hover:bg-background-subtle/80 transition"
            >
              <Circle className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                {task.dueDate && (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {formatDate(task.dueDate)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="pt-3 mt-2 border-t border-border-subtle">
        <Link
          href="/tarefas"
          className="flex items-center justify-between text-xs text-brand font-medium hover:opacity-80 transition"
        >
          <span>Ver todas as tarefas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </section>
  );
};

export default CardTarefas;
