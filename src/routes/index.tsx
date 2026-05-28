import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { useStore, formatIDR } from "@/lib/store";
import { Droplets, Wallet, Leaf, Recycle, QrCode, MapPin, ChevronRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoRefill — Smart refill, less plastic" },
      { name: "description", content: "Refill household essentials at smart vending machines. Track your impact, earn eco points." },
    ],
  }),
  component: () => (
    <AuthGate>
      <Home />
    </AuthGate>
  ),
});

function Home() {
  const { user, wallet, deposit, ecoPoints, bottlesSaved, plasticGrams, transactions, bottles } = useStore(
    (s) => s,
  );
  const activeBottles = bottles.filter((b) => b.status === "active").length;

  return (
    <AppShell>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground px-5 pt-8 pb-16 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs/4 opacity-80">Good day,</p>
            <h1 className="text-xl font-semibold mt-0.5">{user?.name ?? "Eco friend"} 🌿</h1>
          </div>
          <Link
            to="/machines"
            className="bg-white/15 hover:bg-white/25 transition rounded-full px-3 py-2 text-xs inline-flex items-center gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5" />
            Find machine
          </Link>
        </div>

        <div className="relative mt-6 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider opacity-80">Wallet balance</p>
              <p className="text-2xl font-semibold mt-1">{formatIDR(wallet)}</p>
            </div>
            <Link
              to="/wallet"
              className="bg-white text-primary text-xs font-semibold rounded-full px-4 py-2 shadow-sm"
            >
              Top up
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-80">Bottle deposit</p>
              <p className="text-sm font-semibold mt-1">{formatIDR(deposit)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-80">Eco points</p>
              <p className="text-sm font-semibold mt-1">{ecoPoints} pts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick refill */}
      <div className="px-5 -mt-9 relative z-10">
        <Link
          to="/refill"
          className="flex items-center justify-between bg-card rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Quick refill</p>
              <p className="text-xs text-muted-foreground">Order, pay & scan to refill</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Stats grid */}
      <section className="px-5 mt-5 grid grid-cols-2 gap-3">
        <StatCard icon={<Leaf className="h-4 w-4" />} label="Plastic saved" value={`${bottlesSaved} bottles`} />
        <StatCard icon={<Recycle className="h-4 w-4" />} label="Active bottles" value={`${activeBottles}`} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Plastic reduced" value={`${plasticGrams} g`} />
        <StatCard icon={<Wallet className="h-4 w-4" />} label="Deposit" value={formatIDR(deposit)} />
      </section>

      {/* Sustainability */}
      <section className="px-5 mt-5">
        <div className="rounded-2xl bg-accent text-accent-foreground p-4 border border-primary-soft">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">You saved {bottlesSaved} plastic bottles</p>
              <p className="text-xs opacity-80 mt-0.5">That's {plasticGrams}g of plastic kept out of landfills. 🌍</p>
              <Link to="/eco-impact" className="text-xs font-semibold underline-offset-2 hover:underline mt-2 inline-block">
                See your impact →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <Link to="/transactions" className="text-xs text-primary font-medium">
            See all
          </Link>
        </div>
        <ul className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {transactions.slice(0, 4).map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
                {t.type === "refill" ? <Droplets className="h-4 w-4" /> :
                 t.type === "topup" ? <Wallet className="h-4 w-4" /> :
                 t.type === "reward" ? <Gift /> :
                 <QrCode className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">{t.date}</p>
              </div>
              <p className={`text-sm font-semibold ${t.amount < 0 ? "text-success" : "text-foreground"}`}>
                {t.amount < 0 ? "+" : "-"}{formatIDR(Math.abs(t.amount))}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function Gift() {
  return <span className="text-sm">🎁</span>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3.5 border border-border shadow-[var(--shadow-card)]">
      <div className="h-8 w-8 rounded-lg bg-accent text-primary flex items-center justify-center">{icon}</div>
      <p className="text-[11px] text-muted-foreground mt-2">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
