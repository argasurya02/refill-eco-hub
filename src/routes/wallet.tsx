import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { actions, formatIDR, useStore } from "@/lib/store";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet as WalletIcon } from "lucide-react";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Wallet />
    </AuthGate>
  ),
});

const amounts = [25000, 50000, 100000, 200000, 500000];

function Wallet() {
  const wallet = useStore((s) => s.wallet);
  const transactions = useStore((s) => s.transactions.filter((t) => t.type === "topup" || t.type === "refund"));
  const [amount, setAmount] = useState(50000);
  const [method, setMethod] = useState<"qris" | "ewallet">("qris");
  const [toast, setToast] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHeader title="Wallet" back="/" subtitle="Top up to refill anytime" />
      <div className="px-5">
        <div className="rounded-2xl bg-primary text-primary-foreground p-5">
          <p className="text-xs uppercase tracking-wider opacity-80">Balance</p>
          <p className="text-3xl font-semibold mt-2">{formatIDR(wallet)}</p>
        </div>

        <h2 className="text-sm font-semibold mt-6 mb-3">Top up amount</h2>
        <div className="grid grid-cols-3 gap-2">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl border py-3 text-sm font-medium ${
                a === amount ? "border-primary bg-accent text-primary" : "border-border bg-card"
              }`}
            >
              {formatIDR(a)}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-semibold mt-6 mb-3">Payment method</h2>
        <div className="space-y-2">
          <MethodRow
            icon={<Smartphone className="h-4 w-4" />}
            title="QRIS"
            subtitle="Scan to pay from any e-wallet"
            selected={method === "qris"}
            onClick={() => setMethod("qris")}
          />
          <MethodRow
            icon={<CreditCard className="h-4 w-4" />}
            title="E-wallet"
            subtitle="GoPay · OVO · Dana"
            selected={method === "ewallet"}
            onClick={() => setMethod("ewallet")}
          />
        </div>

        <button
          onClick={() => {
            actions.topup(amount);
            setToast(`Topped up ${formatIDR(amount)}`);
            setTimeout(() => setToast(null), 2200);
          }}
          className="mt-6 w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold shadow-[var(--shadow-float)]"
        >
          Top up {formatIDR(amount)}
        </button>

        <h2 className="text-sm font-semibold mt-8 mb-3">Recent wallet activity</h2>
        <ul className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {transactions.slice(0, 6).map((t) => (
            <li key={t.id} className="px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
                <WalletIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">{t.date}</p>
              </div>
              <p className="text-sm font-semibold text-success">+{formatIDR(Math.abs(t.amount))}</p>
            </li>
          ))}
        </ul>
      </div>

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-4 py-2.5 rounded-full z-50">
          {toast}
        </div>
      )}
    </AppShell>
  );
}

function MethodRow({
  icon, title, subtitle, selected, onClick,
}: { icon: React.ReactNode; title: string; subtitle: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left ${
        selected ? "border-primary bg-accent" : "border-border bg-card"
      }`}
    >
      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className={`h-5 w-5 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
    </button>
  );
}
