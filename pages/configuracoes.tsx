// pages/configuracoes.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User, fetchCurrentUser, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { logoutClientSide } from "@/lib/auth";

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega usuário autenticado; se 401 → manda pro login
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCurrentUser();
        if (!isMounted) return;

        setUser(data);
      } catch (err) {
        const apiError = err as ApiError;
        if (!isMounted) return;

        // se o back devolver 401, limpa sessão e redireciona
        if (apiError.status === 401) {
          logoutClientSide();
          router.replace("/login");
          return;
        }

        setError(
          apiError.message ??
            "Não foi possível carregar seus dados. Faça login novamente."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    logoutClientSide();
    router.push("/login");
  };

  // 🔖 Label do plano
  const planLabel =
    user?.plano === "TRIAL"
      ? "Plano de Testes (TRIAL)"
      : user?.plano === "PREMIUM"
      ? "Plano Premium"
      : user?.plano === "TESTER"
      ? "Plano Tester"
      : user?.plano === "BLOQUEADO"
      ? "Plano bloqueado"
      : "Plano indefinido";

  // 📄 Descrição do plano
  const planDescription =
    user?.plano === "TRIAL"
      ? "Você está usando a versão de testes do FinIA. O uso é limitado em quantidade de operações."
      : user?.plano === "PREMIUM"
      ? "Você está no plano Premium, com acesso completo aos recursos do FinIA."
      : user?.plano === "TESTER"
      ? "Você está em um plano especial de testes, com acesso liberado para avaliar novos recursos."
      : user?.plano === "BLOQUEADO"
      ? "Sua conta está bloqueada. Entre em contato com o suporte para entender o motivo e reativar o acesso."
      : "Ainda não foi possível identificar seu plano. Caso o problema persista, fale com o suporte.";

  // Badge de status do plano
  const planBadgeClass =
    user?.plano === "PREMIUM"
      ? "bg-emerald-100 text-emerald-800"
      : user?.plano === "TRIAL"
      ? "bg-amber-100 text-amber-800"
      : user?.plano === "TESTER"
      ? "bg-sky-100 text-sky-800"
      : user?.plano === "BLOQUEADO"
      ? "bg-rose-100 text-rose-800"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-text-muted mt-1">
          Gerencie seu perfil, plano e sessão do FinIA.
        </p>
      </header>

      {/* Skeleton enquanto carrega */}
      {loading && (
        <div className="space-y-3">
          <div className="h-20 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="h-24 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="h-16 bg-background-elevated rounded-2xl animate-pulse" />
        </div>
      )}

      {/* Erro genérico (se não foi 401, porque 401 já redirecionou) */}
      {error && !loading && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* Conteúdo principal */}
      {!loading && !error && user && (
        <>
          {/* Perfil */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-3">Perfil</h2>

            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-muted">Nome: </span>
                <span className="font-medium">
                  {user.nome ?? "Não informado"}
                </span>
              </p>

              {user.telefone && (
                <p>
                  <span className="text-text-muted">Telefone: </span>
                  <span className="font-medium">{user.telefone}</span>
                </p>
              )}

              {user.criadoEm && (
                <p className="text-xs text-text-muted mt-1">
                  Conta criada em {formatDate(user.criadoEm)}
                </p>
              )}
            </div>
          </section>

          {/* Plano */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold mb-1">Plano</h2>
                <p className="text-xs text-text-muted">
                  Acompanhe qual plano está ativo na sua conta FinIA.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${planBadgeClass}`}>
                {user.plano ?? "INDEFINIDO"}
              </span>
            </div>

            <p className="text-sm font-medium mt-2">{planLabel}</p>
            <p className="text-xs text-text-muted mt-1">{planDescription}</p>

            {user.plano === "TRIAL" && user.trialExpiraEm && (
              <p className="text-xs text-text-muted mt-1">
                Seu período de testes encerra em{" "}
                <span className="font-medium">
                  {formatDate(user.trialExpiraEm)}
                </span>
                .
              </p>
            )}

            {user.plano === "PREMIUM" && user.premiumExpiraEm && (
              <p className="text-xs text-text-muted mt-1">
                Sua assinatura Premium está ativa até{" "}
                <span className="font-medium">
                  {formatDate(user.premiumExpiraEm)}
                </span>
                .
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {user.plano === "TRIAL" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    alert("Fluxo de upgrade para Premium será ativado em breve.")
                  }
                >
                  Fazer upgrade para Premium
                </button>
              )}

              {user.plano === "PREMIUM" && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    alert("Gestão da assinatura será disponibilizada em breve.")
                  }
                >
                  Gerenciar assinatura
                </button>
              )}

              {user.plano === "BLOQUEADO" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    alert(
                      "Entre em contato com o suporte do FinIA para revisar sua conta."
                    )
                  }
                >
                  Falar com suporte
                </button>
              )}
            </div>
          </section>

          {/* Conta & idioma */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-3">Conta & idioma</h2>

            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-muted">ID do usuário: </span>
                <span className="font-mono text-xs bg-background-subtle px-2 py-0.5 rounded">
                  {user.id}
                </span>
              </p>

              <p>
                <span className="text-text-muted">Idioma preferido: </span>
                <span className="font-medium">
                  {user.idioma?.toUpperCase() ?? "pt-BR"}
                </span>
              </p>
            </div>

            <p className="text-xs text-text-muted mt-3">
              Em versões futuras você poderá personalizar o idioma e outras
              preferências da experiência FinIA.
            </p>
          </section>

          {/* Sessão */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold">Sessão</p>
              <p className="text-xs text-text-muted">
                Se estiver em um dispositivo compartilhado, lembre-se de sair da conta
                após usar o painel.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-status-danger text-white text-sm font-medium shadow-soft hover:opacity-90 transition"
            >
              Sair da conta
            </button>
          </section>

          {/* Tema */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-2">Tema</h2>
            <p className="text-xs text-text-muted">
              No momento o FinIA utiliza apenas o tema claro. Tema escuro e outras
              personalizações visuais serão adicionadas futuramente.
            </p>
          </section>
        </>
      )}
    </div>
  );
}