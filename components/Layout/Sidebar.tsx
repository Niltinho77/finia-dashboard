// components/Layout/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Início",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Transações",
    href: "/transacoes",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    label: "Tarefas",
    href: "/tarefas",
    icon: <CheckSquare className="w-5 h-5" />,
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Config.",
    href: "/configuracoes",
    icon: <Settings className="w-5 h-5" />,
  },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  const isActive = (href: string) =>
    router.pathname === href ||
    (href !== "/" && router.pathname.startsWith(href));

  return (
    <>
      {/* DESKTOP / TABLET: Sidebar lateral */}
      <aside
        className="
          hidden md:flex flex-col justify-between
          bg-background-elevated/95
          border-r border-border-subtle
          shadow-lg
        "
        style={{ width: "240px" }}
      >
        {/* Topo: Logo + Navegação */}
        <div className="h-full flex flex-col">
          <div className="px-5 pt-6 pb-4 border-b border-border-subtle bg-background-elevated">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-brand flex items-center justify-center shadow-soft">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-text-base">
                  FinIA
                </span>
                <span className="text-[11px] text-text-muted">
                  Seu copiloto financeiro
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                    ${
                      active
                        ? "bg-brand-muted text-brand font-semibold"
                        : "text-text-muted hover:bg-background-subtle hover:text-text-base font-medium"
                    }
                  `}
                >
                  <span
                    className={`
                      flex items-center justify-center rounded-xl p-1.5
                      ${
                        active
                          ? "bg-brand text-white shadow-soft"
                          : "bg-background-subtle text-text-muted"
                      }
                    `}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé */}
        <div className="px-4 py-3 border-t border-border-subtle bg-background-elevated">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-text-muted uppercase tracking-wide">
                Plano atual
              </span>
              <span className="text-xs font-semibold text-brand">PREMIUM</span>
            </div>
            <span className="text-[11px] text-text-muted">v1.2</span>
          </div>
        </div>
      </aside>

      {/* MOBILE: Bottom Navigation fixa — estilo app nativo */}
      <nav
        className="
          md:hidden
          fixed bottom-0 inset-x-0 z-30
          border-t border-border-subtle
          bg-background-elevated/98
          backdrop-blur-md
        "
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="flex justify-around items-stretch px-1 pt-1 pb-2">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl mx-0.5 transition-all
                    ${active ? "text-brand" : "text-text-muted"}
                  `}
                >
                  {/* Bolha de fundo ativa */}
                  <span
                    className={`
                      flex items-center justify-center rounded-2xl transition-all duration-200
                      ${active ? "bg-brand-muted px-4 py-1.5" : "px-2 py-1.5"}
                    `}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      active ? "text-brand" : "text-text-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
