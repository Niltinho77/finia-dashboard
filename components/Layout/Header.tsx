// components/Layout/Header.tsx
import { useRouter } from "next/router";
import { PlusCircle } from "lucide-react";

interface HeaderProps {
  userName?: string;
  todaySummary?: string;
  onNovaTransacaoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "Newton",
  todaySummary = "Você ainda não cadastrou gastos hoje.",
  onNovaTransacaoClick,
}) => {
  const router = useRouter();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  const handleNovaTransacao = () => {
    if (onNovaTransacaoClick) {
      onNovaTransacaoClick();
      return;
    }
    // fallback: levar para página de transações
    router.push("/transacoes");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border-subtle bg-background-elevated/70 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {today}
        </p>
        <h1 className="text-lg md:text-xl font-semibold">
          Olá, <span className="text-brand">{userName}</span> 👋
        </h1>
        <p className="hidden md:block text-xs text-text-muted mt-0.5">
          {todaySummary}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleNovaTransacao}
          className="btn-primary gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nova transação</span>
          <span className="inline sm:hidden">Nova</span>
        </button>
      </div>
    </header>
  );
};

export default Header;