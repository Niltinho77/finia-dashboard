// pages/relatorios.tsx
import { useEffect, useMemo, useState } from "react";
import { Transaction, fetchTransactions, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import GraficoPizzaGastos, {
  CategoriaGasto,
} from "@/components/Charts/GraficoPizzaGastos";
import GraficoLinhaEvolucao, {
  EvolucaoDia,
} from "@/components/Charts/GraficoLinhaEvolucao";
import GraficoBarrasCategorias, {
  CategoriaComparativo,
} from "@/components/Charts/GraficoBarrasCategorias";

function isSameMonth(dateStr: string, ref: Date) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

function isPreviousMonth(dateStr: string, ref: Date) {
  const d = new Date(dateStr);
  const prevMonth = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  return d.getFullYear() === prevMonth.getFullYear() && d.getMonth() === prevMonth.getMonth();
}

function getDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function RelatoriosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      setTransactions(data ?? []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const {
    totalIncome,
    totalExpense,
    categoriaGastos,
    evolucaoDias,
    categoriasComparativo,
  } = useMemo(() => {
    let income = 0;
    let expense = 0;

    const gastosPorCategoriaMesAtual = new Map<string, number>();
    const gastosPorCategoriaMesAnterior = new Map<string, number>();
    const evolucaoDiaMap = new Map<
      string,
      { income: number; expense: number }
    >();

    const lastNDays = 30;
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - lastNDays);

    transactions.forEach((t) => {
      const amount = t.amount ?? 0;

      // totais gerais
      if (t.type === "INCOME") income += amount;
      if (t.type === "EXPENSE") expense += amount;

      // pizza de gastos: só mês atual e só saídas
      if (t.type === "EXPENSE" && isSameMonth(t.date, today)) {
        const prev = gastosPorCategoriaMesAtual.get(t.category) ?? 0;
        gastosPorCategoriaMesAtual.set(t.category || "Outros", prev + amount);
      }

      // comparativo de meses (somente saídas)
      if (t.type === "EXPENSE") {
        if (isSameMonth(t.date, today)) {
          const prev = gastosPorCategoriaMesAtual.get(t.category) ?? 0;
          gastosPorCategoriaMesAtual.set(t.category || "Outros", prev + amount);
        } else if (isPreviousMonth(t.date, today)) {
          const prev = gastosPorCategoriaMesAnterior.get(t.category) ?? 0;
          gastosPorCategoriaMesAnterior.set(
            t.category || "Outros",
            prev + amount
          );
        }
      }

      // linha de evolução: últimos N dias
      const txDate = new Date(t.date);
      if (txDate >= cutoff) {
        const label = getDateLabel(t.date);
        const entry = evolucaoDiaMap.get(label) ?? { income: 0, expense: 0 };
        if (t.type === "INCOME") entry.income += amount;
        if (t.type === "EXPENSE") entry.expense += amount;
        evolucaoDiaMap.set(label, entry);
      }
    });

    const categoriaGastos: CategoriaGasto[] = Array.from(
      gastosPorCategoriaMesAtual.entries()
    ).map(([category, amount]) => ({
      category,
      amount,
    }));

    const evolucaoDias: EvolucaoDia[] = Array.from(
      evolucaoDiaMap.entries()
    )
      .map(([dateLabel, values]) => ({
        dateLabel,
        income: values.income,
        expense: values.expense,
      }))
      // ordena por data (dd/MM -> converte pra Date)
      .sort((a, b) => {
        const [da, ma] = a.dateLabel.split("/").map(Number);
        const [db, mb] = b.dateLabel.split("/").map(Number);
        const year = today.getFullYear();
        const dA = new Date(year, (ma ?? 1) - 1, da ?? 1);
        const dB = new Date(year, (mb ?? 1) - 1, db ?? 1);
        return dA.getTime() - dB.getTime();
      });

    const categoriasSet = new Set<string>();
    gastosPorCategoriaMesAtual.forEach((_, cat) => categoriasSet.add(cat));
    gastosPorCategoriaMesAnterior.forEach((_, cat) => categoriasSet.add(cat));

    const categoriasComparativo: CategoriaComparativo[] = Array.from(
      categoriasSet
    ).map((category) => ({
      category,
      current: gastosPorCategoriaMesAtual.get(category) ?? 0,
      previous: gastosPorCategoriaMesAnterior.get(category) ?? 0,
    }));

    return {
      totalIncome: income,
      totalExpense: expense,
      categoriaGastos,
      evolucaoDias,
      categoriasComparativo,
    };
  }, [transactions, today]);

  const saldo = totalIncome - totalExpense;

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Relatórios
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Acompanhe sua evolução, distribuição de gastos e compare meses.
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* Cards Resumo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-background-elevated rounded-2xl shadow-soft p-4">
          <p className="text-xs text-text-muted uppercase mb-1">
            Saldo consolidado
          </p>
          <p className="text-lg font-semibold">{formatCurrency(saldo)}</p>
        </div>
        <div className="bg-background-elevated rounded-2xl shadow-soft p-4">
          <p className="text-xs text-text-muted uppercase mb-1">
            Total de entradas
          </p>
          <p className="text-lg font-semibold text-status-success">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-background-elevated rounded-2xl shadow-soft p-4">
          <p className="text-xs text-text-muted uppercase mb-1">
            Total de saídas
          </p>
          <p className="text-lg font-semibold text-status-danger">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
          <header className="mb-3">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Gastos por categoria (mês atual)
            </p>
            <h2 className="text-sm font-semibold">Distribuição de saídas</h2>
          </header>
          <GraficoPizzaGastos data={categoriaGastos} />
        </div>

        <div className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
          <header className="mb-3">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Últimos 30 dias
            </p>
            <h2 className="text-sm font-semibold">Evolução diária</h2>
          </header>
          <GraficoLinhaEvolucao data={evolucaoDias} />
        </div>
      </section>

      <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
        <header className="mb-3">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Comparativo de meses
          </p>
          <h2 className="text-sm font-semibold">
            Gastos por categoria — mês atual x mês anterior
          </h2>
        </header>
        <GraficoBarrasCategorias data={categoriasComparativo} />
      </section>
    </div>
  );
}