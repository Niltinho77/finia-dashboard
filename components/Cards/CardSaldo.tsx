// components/Cards/CardSaldo.tsx
import { formatCurrency } from "@/lib/formatters";

interface CardSaldoProps {
  balance: number;
  monthIncome: number;
  monthExpense: number;
}

const CardSaldo: React.FC<CardSaldoProps> = ({
  balance,
  monthIncome,
  monthExpense,
}) => {
  const netMonth = monthIncome - monthExpense;
  const netPositive = netMonth >= 0;

  return (
    <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 flex flex-col justify-between h-full">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Saldo geral
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mt-1">
            {formatCurrency(balance)}
          </h2>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[11px] text-text-muted">Mês atual</span>
          <span
            className={`text-sm font-medium ${
              netPositive ? "text-status-success" : "text-status-danger"
            }`}
          >
            {netPositive ? "+" : "−"}
            {formatCurrency(Math.abs(netMonth))}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-background-subtle rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-text-muted uppercase tracking-wide">
            Entradas
          </span>
          <span className="text-sm md:text-base font-semibold text-status-success mt-1">
            {formatCurrency(monthIncome)}
          </span>
        </div>

        <div className="bg-background-subtle rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-text-muted uppercase tracking-wide">
            Saídas
          </span>
          <span className="text-sm md:text-base font-semibold text-status-danger mt-1">
            {formatCurrency(monthExpense)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Este painel considera apenas os dados já sincronizados pelo FinIA.
      </p>
    </section>
  );
};

export default CardSaldo;