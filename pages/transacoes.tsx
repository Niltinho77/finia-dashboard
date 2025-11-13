// pages/transacoes.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Transaction,
  fetchTransactions,
  ApiError,
} from "@/lib/api";
import ListaTransacoes from "@/components/Lists/ListaTransacoes";
import ModalNovaTransacao from "@/components/Modals/ModalNovaTransacao";
import ModalEditarTransacao from "@/components/Modals/ModalEditarTransacao";
import ModalExcluirConfirmacao from "@/components/Modals/ModalExcluirConfirmacao";

type PeriodFilter = "ALL" | "TODAY" | "MONTH";
type TypeFilter = "ALL" | "INCOME" | "EXPENSE";

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

export default function TransacoesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      let ok = true;

      if (typeFilter !== "ALL" && t.type !== typeFilter) {
        ok = false;
      }

      if (periodFilter === "TODAY" && !isSameDay(t.date, today)) {
        ok = false;
      }

      if (periodFilter === "MONTH" && !isSameMonth(t.date, today)) {
        ok = false;
      }

      return ok;
    });
  }, [transactions, periodFilter, typeFilter, today]);

  const handleOpenNew = () => {
    setShowNewModal(true);
  };

  const handleEdit = (t: Transaction) => {
    setSelectedTransaction(t);
    setShowEditModal(true);
  };

  const handleDelete = (t: Transaction) => {
    setSelectedTransaction(t);
    setShowDeleteModal(true);
  };

  const handleAfterChange = async () => {
    await loadTransactions();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Transações
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Veja, filtre e gerencie todas as suas entradas e saídas
            registradas pelo FinIA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <select
            className="text-xs md:text-sm rounded-full border border-border-subtle bg-background-elevated px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
            value={periodFilter}
            onChange={(e) =>
              setPeriodFilter(e.target.value as PeriodFilter)
            }
          >
            <option value="ALL">Todo período</option>
            <option value="TODAY">Hoje</option>
            <option value="MONTH">Mês atual</option>
          </select>

          <select
            className="text-xs md:text-sm rounded-full border border-border-subtle bg-background-elevated px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as TypeFilter)
            }
          >
            <option value="ALL">Entradas e saídas</option>
            <option value="INCOME">Apenas entradas</option>
            <option value="EXPENSE">Apenas saídas</option>
          </select>

          <button
            type="button"
            onClick={handleOpenNew}
            className="btn-primary text-xs md:text-sm"
          >
            Nova transação
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      <ListaTransacoes
        transactions={filteredTransactions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ModalNovaTransacao
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreated={handleAfterChange}
      />

      <ModalEditarTransacao
        open={showEditModal}
        transaction={selectedTransaction}
        onClose={() => setShowEditModal(false)}
        onUpdated={handleAfterChange}
      />

      <ModalExcluirConfirmacao
        open={showDeleteModal}
        transaction={selectedTransaction}
        onClose={() => setShowDeleteModal(false)}
        onDeleted={handleAfterChange}
      />
    </div>
  );
}