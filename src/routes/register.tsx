import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { actions } from "@/lib/store";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — EcoRefill" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return setErr("Please enter your name");
    if (!email.includes("@")) return setErr("Enter a valid email");
    if (pw.length < 6) return setErr("Password must be at least 6 characters");
    actions.login(email, name);
    navigate({ to: "/" });
  };

  return (
    <div className="app-shell flex flex-col px-6 pt-14 pb-10 bg-background">
      <Link to="/login" className="text-xs text-muted-foreground">← Back</Link>
      <div className="flex items-center gap-2 text-primary mt-4">
        <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-semibold tracking-tight">EcoRefill</span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-8">Join the refill movement 🌱</h1>
      <p className="text-sm text-muted-foreground mt-2">Create your account in seconds.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
        <Field label="Email" value={email} onChange={setEmail} placeholder="you@ecorefill.app" />
        <Field label="Password" value={pw} onChange={setPw} placeholder="At least 6 characters" type="password" />

        {err && <p className="text-xs text-destructive">{err}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold shadow-[var(--shadow-float)]"
        >
          Create account
        </button>
      </form>

      <p className="text-xs text-center text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold">Sign in</Link>
      </p>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (s: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card"
      />
    </div>
  );
}
