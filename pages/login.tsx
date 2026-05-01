// pages/login.tsx
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  requestLoginLink,
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
  const [linkSentMessage, setLinkSentMessage] = useState<string | null>(null);
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
    if (!router.isReady) return;
    if (magicTried) return;

    if (typeof token !== "string" || !token.trim()) {
      return;
    }

    async function doMagicLogin(tokenStr: string) {
      try {
        setLoading(true);
        setError(null);

        const { user, token: jwt } = await loginWithMagicToken(tokenStr);
        setAuthSession(user, jwt);
        router.replace("/");
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.message ??
            "Não foi possível entrar com o link. Solicite um novo abaixo."
        );
        setMagicTried(true);
      } finally {
        setLoading(false);
      }
    }

    setMagicTried(true);
    doMagicLogin(token);
  }, [router, token, magicTried]);

  /**
   * Normaliza o telefone: deixa só dígitos, prefixa com "+".
   */
  const normalizePhone = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (!digits) return "";
    return `+${digits}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLinkSentMessage(null);

    if (!phone.trim()) {
      setError("Informe seu número de telefone.");
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    // Mesma validação E.164 do backend (+ e 10–15 dígitos)
    if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
      setError("Telefone inválido. Use o formato +5551999999999.");
      return;
    }

    try {
      setLoading(true);
      const { message } = await requestLoginLink(normalizedPhone);
      setLinkSentMessage(
        message ??
          "Se o telefone estiver cadastrado, você receberá um link de acesso pelo WhatsApp em alguns segundos."
      );
      setPhone("");
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.message ??
          "Não foi possível solicitar o link. Tente novamente em instantes."
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

        {isMagicFlow && !error ? (
          <p className="text-xs text-text-muted mb-4">
            Validando seu link de acesso seguro...
          </p>
        ) : (
          <p className="text-xs text-text-muted mb-4">
            Informe o telefone cadastrado no FinIA e enviaremos um link de
            acesso seguro pelo WhatsApp. Sem senha, sem código.
          </p>
        )}

        {error && (
          <div className="text-xs text-status-danger bg-status-danger/5 border border-status-danger/30 rounded-2xl px-3 py-2 mb-3">
            {error}
          </div>
        )}

        {linkSentMessage && (
          <div className="text-xs text-brand bg-brand/5 border border-brand/30 rounded-2xl px-3 py-3 mb-3">
            <p className="font-medium mb-1">📲 Link enviado!</p>
            <p>{linkSentMessage}</p>
            <p className="mt-2 text-text-muted">
              Abra o WhatsApp, clique no link recebido e você cairá direto no
              painel. Ele expira em 15 minutos.
            </p>
          </div>
        )}

        {/* Formulário sempre aparece quando não estamos no fluxo de link mágico,
            ou quando o link mágico falhou. */}
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
                disabled={loading}
              />
              <p className="text-[11px] text-text-muted mt-1">
                Você pode usar espaços, parênteses ou traços — nós removemos
                automaticamente.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-brand text-white text-sm font-medium py-2.5 mt-2 shadow-soft hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Enviando link..." : "Receber link no WhatsApp"}
            </button>
          </form>
        )}

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
          <p className="mt-2">
            Ainda não tem conta? Mande uma mensagem para a Lume no WhatsApp e
            ela cuida do resto.
          </p>
        </div>
      </div>
    </div>
  );
}
