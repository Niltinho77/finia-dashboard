// pages/cancel.tsx
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-white">
          Pagamento não concluído
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Parece que você cancelou o checkout do plano Premium.
        </p>

        <p className="mt-3 text-xs text-slate-400">
          Você pode continuar usando a versão gratuita normalmente. Se quiser
          ativar o Premium depois, é só acessar novamente a área de assinatura.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-800 px-4 py-2 text-xs font-medium text-slate-100 transition hover:bg-slate-700"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}