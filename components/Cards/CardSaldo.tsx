// components/Cards/CardSaldo.tsx
import { useState } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
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
  const [hidden, setHidden] = useState(false);
  const netMonth = monthIncome - monthExpense;
  const netPositive = netMonth >= 0;
  const balancePositive = balance >= 0;

  const mask = "R$ •••••";

  return (
    <section
      className="rounded-2xl shadow-medium overflow-hidden h-full flex flex-col"
      style={{
        background: "linear-gradient(135deg, #3a9c64 0%, #4CAF78 55%, #6fd49a 100%)",
      }}
    >
      {/* Cabeçalho do card */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/70 font-medium">
            Saldo total
          </p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-none">
              {hidden ? mask : formatCurrency(balance)}
            </h2>
            <span
              className={`
                mb-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
                ${
                  balancePositive
                    ? "bg-white/20 text-white"
                    : "bg-red-500/30 text-white"
                }
              `}
            >
              {balancePositive ? "▲" : "▼"} acumulado
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
        >
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Divisor */}
      <div className="mx-5 border-t border-white/20" />

      {/* Resumo do mês */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3">
        {/* Entradas */}
        <div className="bg-white/15 rounded-2xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[11px] text-white/70 uppercase tracking-wide font-medium">
              Entradas
            </span>
          </div>
          <span className="text-base font-bold text-white">
            {hidden ? "•••" : formatCurrency(monthIncome)}
          </span>
          <span className="text-[10px] text-white/60">este mês</span>
        </div>

        {/* Saídas */}
        <div className="bg-white/15 rounded-2xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[11px] text-white/70 uppercase tracking-wide font-medium">
              Saídas
            </span>
          </div>
          <span className="text-base font-bold text-white">
            {hidden ? "•••" : formatCurrency(monthExpense)}
          </span>
          <span className="text-[10px] text-white/60">este mês</span>
        </div>
      </div>

      {/* Resultado do mês */}
      <div className="mx-5 mb-4 px-3 py-2 bg-white/10 rounded-xl flex items-center justify-between text-sm">
        <span className="text-white/70 text-xs">Resultado do mês</span>
        <span
          className={`font-bold text-sm ${
            netPositive ? "text-white" : "text-red-200"
          }`}
        >
          {hidden
            ? "•••"
            : `${netPositive ? "+" : "−"}${formatCurrency(Math.abs(netMonth))}`}
        </span>
      </div>
    </section>
  );
};

export default CardSaldo;
