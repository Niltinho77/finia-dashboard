// pages/success.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query; // se quiser usar depois

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-white">
          🎉 Plano Premium ativado com sucesso!
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Seu pagamento foi confirmado e sua conta{" "}
          <span className="font-semibold" style={{ color: "#34d399" }}>
            FinIA Premium
          </span>{" "}
          já está liberada.
        </p>

        <p className="mt-3 text-xs text-slate-400">
          Agora é só continuar falando com o FinIA no WhatsApp. Ele já sabe que
          você é Premium e vai liberar todos os recursos automaticamente.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href="https://wa.me/5555991856277"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            Abrir conversa com o FinIA
          </a>

          <Link
            href="/transacoes"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/70"
          >
            Ir para o painel (transações)
          </Link>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Se o Premium ainda não aparecer, aguarde alguns segundos e atualize a
          página. Caso persista, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}