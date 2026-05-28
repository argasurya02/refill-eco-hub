import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { formatIDR, useStore } from "@/lib/store";
import { Droplets, Gift, QrCode, Wallet } from "lucide-react";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Transactions />
    </AuthGate>
  ),
});

const iconMap = {
  refill: Droplets,
  topup: Wallet,
  deposit: QrCode,
  refund: Wallet,
  reward: Gift,
};

function Transactions() {
  const transactions = useStore((s) => s.transactions);
  return (
    <AppShell>
      <PageHeader title="History" subtitle="All your refills, top-ups and deposits" />
      <div className="px-5">
        <ul className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {transactions.map((t) => {
            const Icon = iconMap[t.type];
            return (
              <li key={t.id} className="px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.date} {t.machine ? `· ${t.machine}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${t.amount < 0 ? "text-success" : "text-foreground"}`}>
                    {t.amount === 0 ? "—" : `${t.amount < 0 ? "+" : "-"}${formatIDR(Math.abs(t.amount))}`}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.status}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
