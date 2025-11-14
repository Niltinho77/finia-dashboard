// pages/login.tsx
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  loginWithPhone,
  loginWithMagicToken,
  ApiError,
  User,
} from "@/lib/api";
import {
  isAuthenticated,
  setAuthSession,
  getCurrentUser,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { token } = router.query; // token do link mágico (?token=...)

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicTried, setMagicTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Se já estiver logado, manda para o dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  // Após montar no cliente, pega usuário salvo no localStorage (evita erro de hidratação)
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  /**
   * Tenta login automático via link mágico (?token=...)
   */
  useEffect(() => {
    // só roda no client quando o router estiver pronto
    if (!router.isReady) return;

    // se já tentamos uma vez, não tenta de novo
    if (magicTried) return;

    // token precisa ser string
    if (typeof token !== "string" || !token.trim()) {
      return;
    }

    async function doMagicLogin(tokenStr: string) {
      try {
        setLoading(true);
        setError(null);

        const { user, token: jwt } = await loginWithMagicToken(tokenStr);

        // salva sessão
        setAuthSession(user, jwt);

        // redireciona para o dashboard
        router.replace("/");
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.message ??
            "Não foi possível entrar com o link mágico. Você pode tentar entrar informando seu telefone abaixo."
        );
        setMagicTried(true); // marca que já tentamos login mágico
      } finally {
        setLoading(false);
      }
    }

    // tenta login mágico apenas uma vez
    setMagicTried(true);
    doMagicLogin(token);
  }, [router, token, magicTried]);

  /**
   * Normaliza o telefone removendo todos os caracteres que não sejam dígitos
   * e prefixando com "+" se necessário. Ex.:
   *  "+55 51 99999-9999" -> "+5551999999999"
   *  "55 51 999999999"   -> "+5551999999999"
   */
  const normalizePhone = (input: string): string => {
    const raw = input.trim();
    const digits = raw.replace(/\D/g, ""); // remove tudo exceto dígitos
    if (!digits) return "";
    // se o valor original já começar com "+", apenas adiciona o +
    return raw.startsWith("+") ? `+${digits}` : `+${digits}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Informe seu número de telefone.");
      return;
    }

    // Sanitiza/normaliza o telefone antes de enviar para o back-end
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      setError("Número de telefone inválido.");
      return;
    }

    try {
      setLoading(true);

      const { user, token } = await loginWithPhone(normalizedPhone);

      // salva sessão no front-end
      setAuthSession(user, token);

      // redireciona para o dashboard
      router.push("/");
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.message ??
          "Não foi possível entrar. Verifique o número informado."
      );
    } finally {
      setLoading(false);
    }
  };

  const isMagicFlow = typeof token === "string" && token.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FBF8] to-[#E3F5EC] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-soft p-6 md:p-8">
        {/* Logo / marca */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-brand/10 flex items-center justify-center">
            <span className="text-brand font-bold text-lg">F</span>
          </div>
          <div>
            <p className="text-sm font-semibold">FinIA Dashboard</p>
            <p className="text-xs text-text-muted">
              Controle visual do seu assistente financeiro.
            </p>
          </div>
        </div>

        <h1 className="text-lg md:text-xl font-semibold mb-2">
          Entrar no painel
        </h1>

        {isMagicFlow ? (
          <p className="text-xs text-text-muted mb-4">
            Validando seu link de acesso seguro...
          </p>
        ) : (
          <p className="text-xs text-text-muted mb-4">
            Informe o telefone cadastrado no FinIA para visualizar seus dados
            de transações, tarefas e relatórios.
          </p>
        )}

        {/* Mensagem de erro (tanto do link mágico quanto do login por telefone) */}
        {error && (
          <div className="text-xs text-status-danger bg-status-danger/5 border border-status-danger/30 rounded-2xl px-3 py-2 mb-3">
            {error}
          </div>
        )}

        {/* Formulário de telefone:
            - sempre aparece quando NÃO estamos no fluxo de link mágico
            - ou quando o link mágico falhou (magicTried true + erro)
        */}
        {(!isMagicFlow || (isMagicFlow && error)) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="text-xs font-medium text-text-muted"
              >
                Telefone com DDI/DDD
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-2xl border border-border-subtle px-3 py-2.5 text-sm bg-background-base focus:outline-none focus:ring-2 focus:ring-brand/60"
                placeholder="Ex.: +55 51 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-[11px] text-text-muted mt-1">
                Você pode usar espaços, parênteses ou traços: nós removeremos
                automaticamente para validar.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-brand text-white text-sm font-medium py-2.5 mt-2 shadow-soft hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>
          </form>
        )}

        {/* Rodapé / ajuda */}
        <div className="mt-5 text-[11px] text-text-muted">
          {currentUser && (
            <p>
              Usuário atual salvo:{" "}
              <span className="font-semibold">
                {currentUser.nome ?? "Usuário"}
              </span>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}