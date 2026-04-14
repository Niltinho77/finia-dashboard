// components/Cards/CardResumoDiario.tsx
import { formatCurrency } from "@/lib/formatters";
import { ArrowDownLeft, ArrowUpRight, Activity } from "lucide-react";

interface CardResumoDiarioProps {
  todaySpent: number;
  todayIncome: number;
  todayTransactions: number;
}

const CardResumoDiario: React.FC<CardResumoDiarioProps> = ({
  todaySpent,
  todayIncome,
  todayTransactions,
}) => {
  const hasMovements = todayTransactions > 0;

  return (
    <section className="bg-background-elevated rounded-2xl shadow-soft p-5 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-text-muted font-medium">
            Hoje
          </p>
          <h2 className="text-base font-semibold mt-0.5">Resumo do dia</h2>
        </div>
        <div className="w-8 h-8 rounded-xl bg-brand-muted flex items-center justify-center">
          <Activity className="w-4 h-4 text-brand" />
        </div>
      </header>

      {hasMovements ? (
        <div className="flex flex-col gap-2.5 flex-1">
          {/* Gastos hoje */}
          <div className="flex items-center gap-3 bg-status-danger/5 border border-status-danger/15 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-status-danger/10 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 text-status-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-text-muted">Gasto hoje</p>
              <p className="text-sm font-bold text-status-danger">
                {formatCurrency(todaySpent)}
              </p>
            </div>
          </div>

          {/* Entradas hoje */}
          <div className="flex items-center gap-3 bg-status-success/5 border border-status-success/15 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-status-success/10 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4 text-status-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-text-muted">Entradas hoje</p>
              <p className="text-sm font-bold text-status-success">
                {formatCurrency(todayIncome)}
              </p>
            </div>
          </div>

          {/* Contador de movimentações */}
          <div className="mt-auto pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
            <span>Movimentações</span>
            <span className="bg-brand-muted text-brand font-semibold px-2 py-0.5 rounded-full text-[11px]">
              {todayTransactions}{" "}
              {todayTransactions === 1 ? "transação" : "transações"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
          <div className="w-10 h-10 rounded-2xl bg-background-subtle flex items-center justify-center">
            <Activity className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted font-medium">
            Nenhuma movimentação hoje
          </p>
          <p className="text-xs text-text-muted/70 max-w-[180px]">
            Envie{" "}
            <span className="font-semibold text-text-muted">
              "Gastei R$45 no mercado"
            </span>{" "}
            no WhatsApp para registrar.
          </p>
        </div>
      )}
    </section>
  );
};

export default CardResumoDiario;
