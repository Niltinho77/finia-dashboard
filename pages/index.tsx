// pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Transaction,
  Task,
  fetchCurrentUser,
  fetchTransactions,
  fetchTasks,
  ApiError,
} from "@/lib/api";
import { formatCurrency, formatShortName } from "@/lib/formatters";
import CardSaldo from "@/components/Cards/CardSaldo";
import CardResumoDiario from "@/components/Cards/CardResumoDiario";
import CardTarefas from "@/components/Cards/CardTarefas";
import GraficoPizzaGastos from "@/components/Charts/GraficoPizzaGastos";
import GraficoLinhaEvolucao from "@/components/Charts/GraficoLinhaEvolucao";

function isSameDay(dateStr: string, target: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth() &&
    d.getDate() === target.getDate()
  );
}

function isSameMonth(dateStr: string, target: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth()
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [userRes, transactionsRes, tasksRes] = await Promise.all([
          fetchCurrentUser().catch(() => null),
          fetchTransactions().catch(() => []),
          fetchTasks().catch(() => []),
        ]);

        if (!isMounted) return;

        if (userRes) setUser(userRes);
        setTransactions(transactionsRes ?? []);
        setTasks(tasksRes ?? []);
      } catch (err) {
        const apiError = err as ApiError;
        if (!isMounted) return;
        setError(apiError.message ?? "Erro ao carregar dados do painel.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const today = new Date();

  // === MÉTRICAS NUMÉRICAS PRINCIPAIS (saldo, hoje, mês) ===
  const {
    balance,
    monthIncome,
    monthExpense,
    todaySpent,
    todayIncome,
    todayTransactions,
  } = useMemo<{
    balance: number;
    monthIncome: number;
    monthExpense: number;
    todaySpent: number;
    todayIncome: number;
    todayTransactions: number;
  }>(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let incomeMonth = 0;
    let expenseMonth = 0;
    let spentToday = 0;
    let incomeToday = 0;
    let todayCount = 0;

    transactions.forEach((t) => {
      const amount = t.amount ?? 0;

      if (t.type === "INCOME") incomeTotal += amount;
      if (t.type === "EXPENSE") expenseTotal += amount;

      if (isSameMonth(t.date, today)) {
        if (t.type === "INCOME") incomeMonth += amount;
        if (t.type === "EXPENSE") expenseMonth += amount;
      }

      if (isSameDay(t.date, today)) {
        todayCount += 1;
        if (t.type === "EXPENSE") spentToday += amount;
        if (t.type === "INCOME") incomeToday += amount;
      }
    });

    return {
      balance: incomeTotal - expenseTotal,
      monthIncome: incomeMonth,
      monthExpense: expenseMonth,
      todaySpent: spentToday,
      todayIncome: incomeToday,
      todayTransactions: todayCount,
    };
  }, [transactions, today]);

  // === DADOS PARA GRÁFICO DE PIZZA (gastos por categoria no mês) ===
  const categoriaData = useMemo(
    () => {
      const map = new Map<string, number>();

      transactions.forEach((t) => {
        if (t.type !== "EXPENSE") return;
        if (!isSameMonth(t.date, today)) return;

        const category = t.category || "Outros";
        const amount = t.amount ?? 0;

        map.set(category, (map.get(category) ?? 0) + amount);
      });

      return Array.from(map.entries()).map(([category, amount]) => ({
        category,
        amount,
      }));
    },
    [transactions, today]
  );

  // === DADOS PARA GRÁFICO DE LINHA (últimos 7 dias: entrada x saída) ===
const evolucaoData = useMemo(
  () => {
    const days: {
      key: string;       // yyyy-mm-dd para comparação
      dateLabel: string; // label exibido no gráfico
      income: number;
      expense: number;
    }[] = [];

    // cria vetor dos últimos 7 dias (do mais antigo para o mais recente)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = d.toISOString().slice(0, 10); // yyyy-mm-dd
      const dateLabel = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      days.push({
        key,
        dateLabel,
        income: 0,
        expense: 0,
      });
    }

    // agrupa income/expense por dia
    transactions.forEach((t) => {
      const txDate = new Date(t.date);
      const key = txDate.toISOString().slice(0, 10);

      const day = days.find((d) => d.key === key);
      if (!day) return;

      const amount = t.amount ?? 0;
      if (t.type === "INCOME") {
        day.income += amount;
      } else if (t.type === "EXPENSE") {
        day.expense += amount;
      }
    });

    // remove o campo interno `key` e retorna no formato esperado pelo gráfico
    return days.map(({ key, ...rest }) => rest);
  },
  [transactions, today]
);

  const shortName = formatShortName(user?.nome);
  const headerSummary =
    todayTransactions > 0
      ? `Hoje você registrou ${todayTransactions} ${
          todayTransactions === 1 ? "transação" : "transações"
        } e gastou ${formatCurrency(todaySpent)}.`
      : "Você ainda não cadastrou gastos hoje.";

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Título da página (além do Header global) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Olá, <span className="text-brand">{shortName}</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">{headerSummary}</p>
        </div>
        {user && (
          <div className="text-xs text-right text-text-muted">
            <span className="uppercase tracking-wide">
              Plano{" "}
              <span className="font-semibold text-brand">
                {user.plano}
              </span>
            </span>
            {user.plano === "TRIAL" && user.trialExpiraEm && (
              <p className="mt-0.5">
                Seu período de testes termina em{" "}
                {new Date(user.trialExpiraEm).toLocaleDateString("pt-BR")}.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Estados de loading / erro */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 h-40 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="h-40 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-40 bg-background-elevated rounded-2xl animate-pulse" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      {!loading && !error && (
        <>
          {/* Cards principais */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <CardSaldo
                balance={balance}
                monthIncome={monthIncome}
                monthExpense={monthExpense}
              />
            </div>
            <div className="lg:col-span-1">
              <CardResumoDiario
                todaySpent={todaySpent}
                todayIncome={todayIncome}
                todayTransactions={todayTransactions}
              />
            </div>
          </section>

          {/* Gráficos + tarefas */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Bloco de gráficos */}
            <div className="lg:col-span-2 space-y-4">
              {/* Pizza de gastos por categoria */}
              <div className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
                <header className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">
                      Visão geral
                    </p>
                    <h2 className="text-lg font-semibold">
                      Gastos por categoria (mês atual)
                    </h2>
                  </div>
                </header>

                {categoriaData.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    Ainda não há gastos cadastrados neste mês para exibir no gráfico.
                  </p>
                ) : (
                  <div className="h-64">
                    <GraficoPizzaGastos data={categoriaData} />
                  </div>
                )}
              </div>

              {/* Linha de evolução últimos 7 dias */}
              <div className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
                <header className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">
                      Evolução recente
                    </p>
                    <h2 className="text-lg font-semibold">
                      Entradas vs saídas (últimos 7 dias)
                    </h2>
                  </div>
                </header>

                {evolucaoData.every(
                  (d) => d.income === 0 && d.expense === 0
                ) ? (
                  <p className="text-sm text-text-muted">
                    Ainda não há movimentações suficientes nos últimos dias para exibir o gráfico.
                  </p>
                ) : (
                  <div className="h-64">
                    <GraficoLinhaEvolucao data={evolucaoData} />
                  </div>
                )}
              </div>
            </div>

            {/* Coluna de tarefas */}
            <div className="lg:col-span-1">
              <CardTarefas tasks={tasks} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}