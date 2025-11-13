// pages/configuracoes.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User, fetchCurrentUser, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { logoutClientSide, isAuthenticated } from "@/lib/auth";

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // se nem token tem, manda pro login
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

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

  const planLabel =
    user?.plan === "TRIAL"
      ? "Plano de testes (TRIAL)"
      : user?.plan === "PREMIUM"
      ? "Plano Premium"
      : "Plano indefinido";

  const planDescription =
    user?.plan === "TRIAL"
      ? "Você está usando a versão de testes do FinIA. O uso é limitado em quantidade de operações."
      : "Você está no plano Premium, com acesso completo aos recursos do FinIA.";

  return (
    <div className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">
          Configurações
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Gerencie seu perfil, plano e sessão do FinIA.
        </p>
      </header>

      {loading && (
        <div className="space-y-3">
          <div className="h-20 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="h-24 bg-background-elevated rounded-2xl animate-pulse" />
          <div className="h-16 bg-background-elevated rounded-2xl animate-pulse" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      {!loading && !error && user && (
        <>
          {/* Perfil */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-3">Perfil</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-muted">Nome: </span>
                <span className="font-medium">{user.name}</span>
              </p>
              {user.phone && (
                <p>
                  <span className="text-text-muted">Telefone: </span>
                  <span className="font-medium">{user.phone}</span>
                </p>
              )}
              {user.createdAt && (
                <p className="text-xs text-text-muted mt-1">
                  Conta criada em{" "}
                  {formatDate(user.createdAt)}
                </p>
              )}
            </div>
          </section>

          {/* Plano */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-3">Plano</h2>
            <p className="text-sm font-medium">{planLabel}</p>
            <p className="text-xs text-text-muted mt-1">
              {planDescription}
            </p>

            {user.plan === "TRIAL" && user.planExpiresAt && (
              <p className="text-xs text-text-muted mt-1">
                Seu período de testes está previsto para encerrar em{" "}
                {formatDate(user.planExpiresAt)}.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {user.plan === "TRIAL" && (
                <button
                  type="button"
                  className="btn-primary"
                  // futuro: abrir checkout / upgrade
                  onClick={() => alert("Fluxo de upgrade ainda não conectado.")}
                >
                  Fazer upgrade para Premium
                </button>
              )}
              {user.plan === "PREMIUM" && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => alert("Gestão de assinatura ainda não configurada.")}
                >
                  Gerenciar assinatura
                </button>
              )}
            </div>
          </section>

          {/* Sessão / Logout */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6 flex items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold">Sessão</p>
              <p className="text-xs text-text-muted">
                Se estiver em um dispositivo compartilhado, lembre-se de sair da conta.
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

          {/* Tema - placeholder */}
          <section className="bg-background-elevated rounded-2xl shadow-soft p-5 md:p-6">
            <h2 className="text-sm font-semibold mb-2">Tema</h2>
            <p className="text-xs text-text-muted">
              No momento o FinIA utiliza apenas o tema claro. No futuro você poderá
              alternar para tema escuro diretamente aqui.
            </p>
          </section>
        </>
      )}
    </div>
  );
}