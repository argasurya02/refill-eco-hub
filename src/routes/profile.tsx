import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { actions, useStore } from "@/lib/store";
import { ChevronRight, Leaf, LogOut, MapPin, Recycle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Profile />
    </AuthGate>
  ),
});

function Profile() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageHeader title="Profile" />
      <div className="px-5">
        <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? "E"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <ul className="mt-5 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <Item icon={<Recycle className="h-4 w-4" />} label="My bottles" to="/bottles" />
          <Item icon={<MapPin className="h-4 w-4" />} label="Vending machines" to="/machines" />
          <Item icon={<Leaf className="h-4 w-4" />} label="Eco impact" to="/eco-impact" />
          <Item icon={<Sparkles className="h-4 w-4" />} label="Wallet & top-up" to="/wallet" />
        </ul>

        <button
          onClick={() => {
            actions.logout();
            navigate({ to: "/login" });
          }}
          className="mt-6 w-full rounded-xl border border-border bg-card text-destructive py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-6">EcoRefill v1.0 · Refill today, reduce plastic waste.</p>
      </div>
    </AppShell>
  );
}

function Item({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center gap-3 px-4 py-3.5">
        <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">{icon}</div>
        <span className="flex-1 text-sm font-medium">{label}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </li>
  );
}
