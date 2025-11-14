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
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Transações",
    href: "/transacoes",
    icon: <Receipt className="w-4 h-4" />,
  },
  {
    label: "Tarefas",
    href: "/tarefas",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: <Settings className="w-4 h-4" />,
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
        className="hidden md:flex flex-col justify-between"
        style={{ width: "260px" }}
      >
        {/* Topo: Logo + Navegação */}
        <div className="h-full flex flex-col border-r border-border-subtle bg-background-elevated/80 backdrop-blur-sm">
          <div className="px-5 pt-6 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
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

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition 
                    ${
                      active
                        ? "bg-brand-muted text-brand shadow-soft"
                        : "text-text-muted hover:bg-background-subtle"
                    }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-lg p-1.5 
                      ${
                        active
                          ? "bg-brand text-white"
                          : "bg-background-subtle text-text-muted"
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé: Info do plano */}
        <div className="px-4 py-3 border-t border-border-subtle bg-background-elevated/90">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-text-muted uppercase tracking-wide">
                Plano atual
              </span>
              <span className="text-xs font-semibold text-brand">
                PREMIUM
              </span>
            </div>
            <span className="text-[11px] text-text-muted">v0.1.0</span>
          </div>
        </div>
      </aside>

      {/* MOBILE: Bottom Navigation fixa */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border-subtle bg-background-elevated/95 backdrop-blur-sm">
        <ul className="flex justify-between items-stretch">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-2 text-[11px] transition
                    ${
                      active
                        ? "text-brand"
                        : "text-text-muted hover:text-text-base"
                    }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full p-1.5 mb-0.5
                      ${
                        active
                          ? "bg-brand/10"
                          : "bg-background-subtle"
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate max-w-[72px]">
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