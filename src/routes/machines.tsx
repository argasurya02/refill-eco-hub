import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { machines } from "@/lib/store";
import { MapPin, Navigation } from "lucide-react";

export const Route = createFileRoute("/machines")({
  head: () => ({ meta: [{ title: "Vending machines — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Machines />
    </AuthGate>
  ),
});

const statusColor: Record<string, string> = {
  available: "bg-success/15 text-success",
  empty: "bg-warning/20 text-warning-foreground",
  maintenance: "bg-warning/20 text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

function Machines() {
  return (
    <AppShell>
      <PageHeader title="Refill machines" back="/" subtitle="Find a machine near you" />

      <div className="px-5">
        {/* Faux map */}
        <div className="relative h-44 rounded-2xl bg-accent border border-border overflow-hidden">
          <div className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, #00564A22, transparent 40%), radial-gradient(circle at 70% 60%, #00564A22, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-primary/5" />
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-float)]">
            <Navigation className="h-4 w-4" />
          </div>
          {[
            { t: "20%", l: "25%" }, { t: "35%", l: "70%" }, { t: "65%", l: "40%" }, { t: "70%", l: "80%" },
          ].map((p, i) => (
            <div key={i} className="absolute h-6 w-6 rounded-full bg-card border-2 border-primary flex items-center justify-center" style={{ top: p.t, left: p.l }}>
              <MapPin className="h-3 w-3 text-primary" />
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold mt-6 mb-3">Nearby ({machines.length})</h2>
        <ul className="space-y-2">
          {machines.map((m) => (
            <li key={m.id} className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.location}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-1 ${statusColor[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-wrap gap-1">
                  {m.products.slice(0, 3).map((p) => (
                    <span key={p} className="text-[10px] bg-secondary rounded-full px-2 py-0.5 text-muted-foreground">{p}</span>
                  ))}
                </div>
                <span className="text-xs text-primary font-medium">{m.distance}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
