// components/Layout/Header.tsx
import { useRouter } from "next/router";
import { PlusCircle } from "lucide-react";

interface HeaderProps {
  onNovaTransacaoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNovaTransacaoClick }) => {
  const router = useRouter();

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const handleNovaTransacao = () => {
    if (onNovaTransacaoClick) {
      onNovaTransacaoClick();
      return;
    }
    router.push("/transacoes");
  };

  const goHome = () => router.push("/");

  return (
    <header
      className="
        h-16 
        flex items-center justify-between 
        px-4 md:px-6 
        border-b border-border-subtle 
        bg-background-elevated/70 
        backdrop-blur-sm 
        sticky top-0 z-20
      "
    >
      {/* Área clicável → voltar ao Dashboard */}
      <div
        role="button"
        onClick={goHome}
        className="
          flex flex-col 
          cursor-pointer select-none
          transition hover:opacity-80
        "
      >
        <span className="text-[11px] uppercase tracking-wide text-text-muted">
          {today}
        </span>

        <h1 className="text-lg md:text-xl font-semibold leading-tight">
          Painel Administrativo
        </h1>
      </div>

      {/* Botão de Nova Transação */}
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