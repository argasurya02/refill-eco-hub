import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Droplets, Receipt, Gift, User } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/refill", label: "Refill", icon: Droplets },
  { to: "/transactions", label: "History", icon: Receipt },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="app-shell flex flex-col">
      <main className={`flex-1 ${hideNav ? "" : "pb-24"}`}>{children}</main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
          <div className="mx-3 mb-3 rounded-3xl bg-card border border-border shadow-[var(--shadow-float)] backdrop-blur">
            <ul className="grid grid-cols-5 px-2 py-2">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-colors ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                      <span className="text-[10px] font-medium tracking-wide">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="px-5 pt-6 pb-3 flex items-start justify-between gap-3">
      <div>
        {back && (
          <Link to={back} className="text-xs text-muted-foreground inline-flex items-center mb-1">
            ← Back
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
