// components/Layout/Header.tsx
import { useRouter } from "next/router";
import { PlusCircle, ChevronLeft } from "lucide-react";

interface HeaderProps {
  onNovaTransacaoClick?: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Início",
  "/transacoes": "Transações",
  "/tarefas": "Tarefas",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

const Header: React.FC<HeaderProps> = ({ onNovaTransacaoClick }) => {
  const router = useRouter();

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const pageTitle = pageTitles[router.pathname] ?? "FinIA";
  const isHome = router.pathname === "/";

  const handleNovaTransacao = () => {
    if (onNovaTransacaoClick) {
      onNovaTransacaoClick();
      return;
    }
    router.push("/transacoes");
  };

  return (
    <header
      className="
        h-14 md:h-16
        flex items-center justify-between
        px-4 md:px-6
        border-b border-border-subtle
        bg-background-elevated/80
        backdrop-blur-sm
        sticky top-0 z-20
      "
    >
      {/* Esquerda: título ou botão voltar */}
      <div className="flex items-center gap-2">
        {/* Botão voltar — só aparece em sub-páginas no mobile */}
        {!isHome && (
          <button
            type="button"
            onClick={() => router.back()}
            className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-background-subtle text-text-muted transition"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col">
          {/* Data — visível só no desktop */}
          <span className="hidden md:block text-[11px] uppercase tracking-wide text-text-muted">
            {today}
          </span>

          {/* Título dinâmico por rota */}
          <h1 className="text-base md:text-lg font-semibold leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Direita: ação contextual */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleNovaTransacao}
          className="btn-primary text-xs md:text-sm gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nova transação</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
