import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { actions, useStore } from "@/lib/store";
import { Recycle } from "lucide-react";

export const Route = createFileRoute("/bottles")({
  head: () => ({ meta: [{ title: "My bottles — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Bottles />
    </AuthGate>
  ),
});

const statusStyle: Record<string, string> = {
  active: "bg-success/15 text-success",
  returned: "bg-accent text-accent-foreground",
  recycled: "bg-primary/10 text-primary",
  damaged: "bg-destructive/10 text-destructive",
};

function Bottles() {
  const bottles = useStore((s) => s.bottles);
  return (
    <AppShell>
      <PageHeader title="My bottles" back="/profile" subtitle="Track and return reusable bottles" />
      <div className="px-5">
        <ul className="space-y-2">
          {bottles.map((b) => (
            <li key={b.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-accent text-primary flex items-center justify-center">
                <Recycle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{b.product}</p>
                <p className="text-[11px] text-muted-foreground">{b.size}ml · since {b.acquiredAt}</p>
              </div>
              {b.status === "active" ? (
                <button
                  onClick={() => actions.returnBottle(b.id)}
                  className="text-xs font-semibold bg-primary text-primary-foreground rounded-full px-3 py-2"
                >
                  Return
                </button>
              ) : (
                <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-1 ${statusStyle[b.status]}`}>
                  {b.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
