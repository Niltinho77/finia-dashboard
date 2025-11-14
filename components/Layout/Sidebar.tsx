import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  Menu,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Transações", href: "/transacoes", icon: <Receipt className="w-4 h-4" /> },
  { label: "Tarefas", href: "/tarefas", icon: <CheckSquare className="w-4 h-4" /> },
  { label: "Relatórios", href: "/relatorios", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Configurações", href: "/configuracoes", icon: <Settings className="w-4 h-4" /> },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside
      className="
        hidden md:flex flex-col justify-between 
        w-[260px]
        bg-background-elevated shadow-lg
        border-r border-border-subtle
        backdrop-blur-md
        sticky top-0 h-screen
        z-30
      "
    >
      {/* Topo */}
      <div>
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-border-subtle bg-background-elevated/90">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold text-text-base">
                FinIA • Dashboard
              </p>
              <p className="text-[11px] text-text-muted leading-none">
                Seu copiloto financeiro
              </p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="mt-3 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              router.pathname === item.href ||
              (item.href !== "/" && router.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 
                  rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-brand-muted text-brand shadow-sm"
                      : "text-text-muted hover:bg-background-subtle"
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center rounded-lg p-2 
                    ${
                      isActive
                        ? "bg-brand text-white shadow-md"
                        : "bg-background-elevated text-text-muted"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé da Sidebar */}
      <div className="px-4 py-3 border-t border-border-subtle bg-background-elevated/90">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase text-text-muted tracking-wide">
              Plano atual
            </p>
            <p className="text-xs font-semibold text-brand">
              PREMIUM
            </p>
          </div>

          <span className="text-[11px] text-text-muted">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;