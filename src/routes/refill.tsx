import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { actions, formatIDR, machines, products, useStore } from "@/lib/store";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/refill")({
  head: () => ({ meta: [{ title: "Refill — EcoRefill" }] }),
  component: () => (
    <AuthGate>
      <Refill />
    </AuthGate>
  ),
});

const volumes = [250, 500, 750, 1000];

function Refill() {
  const wallet = useStore((s) => s.wallet);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [machineId, setMachineId] = useState(machines[0].id);
  const [productId, setProductId] = useState(products[0].id);
  const [volume, setVolume] = useState(500);
  const [qr, setQr] = useState<string | null>(null);
  const navigate = useNavigate();

  const product = products.find((p) => p.id === productId)!;
  const machine = machines.find((m) => m.id === machineId)!;
  const price = product.pricePerMl * volume;
  const canPay = wallet >= price;

  if (qr) return <QrScreen qr={qr} onClose={() => navigate({ to: "/transactions" })} machine={machine.name} product={product.name} volume={volume} price={price} />;

  return (
    <AppShell>
      <PageHeader title="New refill" subtitle={`Step ${step} of 4`} />
      <div className="px-5">
        <div className="flex gap-1 mb-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        {step === 1 && (
          <Section title="Select vending machine">
            {machines.map((m) => (
              <SelectRow
                key={m.id}
                title={m.name}
                subtitle={`${m.location} · ${m.distance}`}
                disabled={m.status !== "available"}
                badge={m.status}
                selected={m.id === machineId}
                onClick={() => setMachineId(m.id)}
              />
            ))}
          </Section>
        )}

        {step === 2 && (
          <Section title="Select product">
            {products.map((p) => (
              <SelectRow
                key={p.id}
                title={`${p.icon}  ${p.name}`}
                subtitle={`${formatIDR(p.pricePerMl)} / ml`}
                selected={p.id === productId}
                onClick={() => setProductId(p.id)}
              />
            ))}
          </Section>
        )}

        {step === 3 && (
          <Section title="Choose volume">
            <div className="grid grid-cols-2 gap-3">
              {volumes.map((v) => (
                <button
                  key={v}
                  onClick={() => setVolume(v)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    v === volume
                      ? "border-primary bg-accent"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="text-lg font-semibold">{v} ml</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatIDR(product.pricePerMl * v)}</p>
                </button>
              ))}
            </div>
          </Section>
        )}

        {step === 4 && (
          <Section title="Review & pay">
            <div className="rounded-2xl bg-card border border-border p-4 space-y-2">
              <Row label="Machine" value={machine.name} />
              <Row label="Product" value={product.name} />
              <Row label="Volume" value={`${volume} ml`} />
              <div className="border-t border-border my-2" />
              <Row label="Total" value={formatIDR(price)} strong />
              <Row label="Wallet balance" value={formatIDR(wallet)} muted />
            </div>
            {!canPay && (
              <p className="text-xs text-destructive mt-3">Wallet balance is not enough. Top up first.</p>
            )}
          </Section>
        )}
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium"
            >
              Back
            </button>
          )}
          <button
            disabled={step === 4 && !canPay}
            onClick={() => {
              if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
              else {
                const payload = actions.refill({ product: product.name, volume, price, machine: machine.name });
                setQr(payload);
              }
            }}
            className="flex-[2] rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold shadow-[var(--shadow-float)] disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            {step === 4 ? `Pay ${formatIDR(price)}` : "Continue"}
            {step < 4 && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SelectRow({
  title, subtitle, selected, onClick, disabled, badge,
}: { title: string; subtitle: string; selected: boolean; onClick: () => void; disabled?: boolean; badge?: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition ${
        selected ? "border-primary bg-accent" : "border-border bg-card"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
      </div>
      {badge && badge !== "available" && (
        <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground rounded-full px-2 py-1">
          {badge}
        </span>
      )}
      {selected && (
        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}
    </button>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${strong ? "text-base font-semibold" : ""} ${muted ? "text-muted-foreground" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function QrScreen({
  qr, onClose, machine, product, volume, price,
}: { qr: string; onClose: () => void; machine: string; product: string; volume: number; price: number }) {
  return (
    <div className="app-shell bg-primary text-primary-foreground min-h-dvh flex flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure transaction</span>
        </div>
        <button onClick={onClose} className="text-xs underline-offset-2 hover:underline">
          Done
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs uppercase tracking-widest opacity-80">Show this QR to the machine</p>
        <h1 className="text-2xl font-semibold mt-2">Refill ready</h1>
        <p className="text-sm opacity-80 mt-1">{machine}</p>
      </div>

      <div className="mt-8 mx-auto bg-white rounded-3xl p-6 shadow-[var(--shadow-float)] relative">
        <div className="absolute -top-2 -left-2 h-6 w-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
        <div className="absolute -top-2 -right-2 h-6 w-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
        <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
        <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
        <QRCodeSVG value={qr} size={220} bgColor="#ffffff" fgColor="#00564A" level="H" />
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
        <Row2 label="Product" value={product} />
        <Row2 label="Volume" value={`${volume} ml`} />
        <Row2 label="Paid" value={formatIDR(price)} />
      </div>

      <p className="text-center text-xs opacity-70 mt-6">
        The vending machine will scan this code to begin your refill.
      </p>
    </div>
  );
}

function Row2({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
