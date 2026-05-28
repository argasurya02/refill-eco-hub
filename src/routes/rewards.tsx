import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { actions, rewards, useStore } from "@/lib/store";
import { useState } from "react";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Rewards />
    </AuthGate>
  ),
});

function Rewards() {
  const points = useStore((s) => s.ecoPoints);
  const [toast, setToast] = useState<string | null>(null);

  const redeem = (id: string, cost: number, name: string) => {
    const ok = actions.redeem(id, cost, name);
    setToast(ok ? `🎉 ${name} redeemed!` : "Not enough eco points");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AppShell>
      <PageHeader title="Rewards" subtitle="Turn your impact into perks" />
      <div className="px-5">
        <div className="rounded-2xl bg-primary text-primary-foreground p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <p className="text-xs uppercase tracking-wider opacity-80 inline-flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5" /> Eco points
          </p>
          <p className="text-4xl font-semibold mt-2">{points}</p>
          <p className="text-xs opacity-80 mt-1">Earn 1 pt per 10ml refilled</p>
        </div>

        <h2 className="text-sm font-semibold mt-6 mb-3">Catalog</h2>
        <ul className="grid grid-cols-2 gap-3">
          {rewards.map((r) => {
            const can = points >= r.cost;
            return (
              <li key={r.id} className="rounded-2xl bg-card border border-border p-4 flex flex-col">
                <div className="text-3xl">{r.icon}</div>
                <p className="text-sm font-semibold mt-2 leading-snug">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.cost} pts</p>
                <button
                  disabled={!can}
                  onClick={() => redeem(r.id, r.cost, r.name)}
                  className="mt-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold py-2 disabled:opacity-40"
                >
                  Redeem
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-4 py-2.5 rounded-full shadow-[var(--shadow-float)] z-50">
          {toast}
        </div>
      )}
    </AppShell>
  );
}
