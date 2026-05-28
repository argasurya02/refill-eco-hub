import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";
import { Leaf, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/eco-impact")({
  head: () => ({ meta: [{ title: "Eco impact — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <EcoImpact />
    </AuthGate>
  ),
});

function EcoImpact() {
  const { bottlesSaved, plasticGrams, transactions } = useStore((s) => s);
  const refills = transactions.filter((t) => t.type === "refill").length;
  const goal = 25;
  const progress = Math.min(100, (bottlesSaved / goal) * 100);

  return (
    <AppShell>
      <PageHeader title="Your eco impact" back="/" />
      <div className="px-5">
        <div className="rounded-2xl bg-primary text-primary-foreground p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-8 text-6xl opacity-20">🌱</div>
          <p className="text-xs uppercase tracking-wider opacity-80 inline-flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5" /> Total plastic saved
          </p>
          <p className="text-4xl font-semibold mt-2">{bottlesSaved} <span className="text-base opacity-80 font-normal">bottles</span></p>
          <p className="text-xs opacity-80 mt-1">≈ {plasticGrams}g of plastic kept out of landfills</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] opacity-80 mb-1">
              <span>Goal: {goal} bottles</span><span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Stat label="Refills" value={`${refills}`} icon="💧" />
          <Stat label="CO₂ saved" value={`${Math.round(plasticGrams * 0.006)} kg`} icon="🌍" />
          <Stat label="Water saved" value={`${Math.round(plasticGrams * 0.12)} L`} icon="💦" />
          <Stat label="Trees equiv." value={`${(plasticGrams / 1000 * 0.3).toFixed(1)}`} icon="🌳" />
        </div>

        <div className="rounded-2xl bg-accent text-accent-foreground p-4 mt-5 border border-primary-soft">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Refill today, reduce plastic waste.</p>
              <p className="text-xs opacity-80 mt-1">
                You've helped reduce {plasticGrams}g of plastic waste. Keep refilling to unlock new milestones.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-sm font-semibold mt-6 mb-3">Weekly refills</h2>
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-end justify-between gap-2 h-32">
            {[3, 5, 2, 6, 4, 7, 5].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-lg bg-primary" style={{ height: `${v * 12}px` }} />
                <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="text-2xl">{icon}</div>
      <p className="text-xs text-muted-foreground mt-2">{label}</p>
      <p className="text-base font-semibold mt-0.5">{value}</p>
    </div>
  );
}
