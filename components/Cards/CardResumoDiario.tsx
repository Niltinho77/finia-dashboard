// components/Cards/CardResumoDiario.tsx
import { formatCurrency } from "@/lib/formatters";

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
    <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 h-full flex flex-col">
      <header>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          Hoje
        </p>
        <h2 className="text-lg font-semibold mt-1">Resumo do dia</h2>
      </header>

      {hasMovements ? (
        <>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Gasto hoje</span>
              <span className="font-medium text-status-danger">
                {formatCurrency(todaySpent)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Entradas hoje</span>
              <span className="font-medium text-status-success">
                {formatCurrency(todayIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">
                Movimentações
              </span>
              <span className="font-medium">
                {todayTransactions}{" "}
                {todayTransactions === 1 ? "transação" : "transações"}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Continue registrando seus gastos no WhatsApp para manter este painel
            sempre atualizado.
          </p>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-start justify-center gap-2 mt-3">
          <p className="text-sm text-text-muted">
            Você ainda não registrou nenhuma movimentação hoje.
          </p>
          <p className="text-xs text-text-muted">
            Envie uma mensagem como{" "}
            <span className="font-semibold">
              &ldquo;Gastei 45 reais no mercado&rdquo;
            </span>{" "}
            para o FinIA no WhatsApp e veja o resumo aparecer aqui.
          </p>
        </div>
      )}
    </section>
  );
};

export default CardResumoDiario;