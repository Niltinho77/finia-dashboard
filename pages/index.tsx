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
import {
  formatCurrency,
  formatShortName,
} from "@/lib/formatters";
import CardSaldo from "@/components/Cards/CardSaldo";
import CardResumoDiario from "@/components/Cards/CardResumoDiario";
import CardTarefas from "@/components/Cards/CardTarefas";

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

  const shortName = formatShortName(user?.name);
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
          <p className="text-sm text-text-muted mt-1">
            {headerSummary}
          </p>
        </div>
        {user && (
          <div className="text-xs text-right text-text-muted">
            <span className="uppercase tracking-wide">
              Plano{" "}
              <span className="font-semibold text-brand">
                {user.plan}
              </span>
            </span>
            {user.plan === "TRIAL" && user.planExpiresAt && (
              <p className="mt-0.5">
                Seu período de testes termina em{" "}
                {new Date(user.planExpiresAt).toLocaleDateString(
                  "pt-BR"
                )}
                .
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

      {!loading && !error && (
        <>
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

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              {/* Placeholder para gráfico futuro */}
              <div className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 h-full flex flex-col">
                <header className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">
                      Visão geral
                    </p>
                    <h2 className="text-lg font-semibold">
                      Gastos por categoria
                    </h2>
                  </div>
                  <span className="text-xs text-text-muted">
                    Em breve: gráfico interativo aqui
                  </span>
                </header>
                <p className="text-sm text-text-muted">
                  Assim que conectarmos as categorias de transações do
                  FinIA, este espaço exibirá um gráfico de pizza e barras
                  comparando seus principais tipos de gasto.
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CardTarefas tasks={tasks} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}