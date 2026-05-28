import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { actions, useStore } from "@/lib/store";
import { Eye, EyeOff, Leaf } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EcoRefill" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  if (user) {
    navigate({ to: "/" });
    return null;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") && email.length < 6) return setErr("Enter a valid email or phone");
    if (pw.length < 4) return setErr("Password must be at least 4 characters");
    actions.login(email);
    navigate({ to: "/" });
  };

  return (
    <div className="app-shell flex flex-col px-6 pt-14 pb-10 bg-background">
      <div className="flex items-center gap-2 text-primary">
        <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-semibold tracking-tight">EcoRefill</span>
      </div>

      <div className="mt-10">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back 👋</h1>
        <p className="text-sm text-muted-foreground mt-2">Refill smarter. Reduce plastic. Earn rewards.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email or phone</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ecorefill.app"
            className="mt-1 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <div className="relative mt-1">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {err && <p className="text-xs text-destructive">{err}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold shadow-[var(--shadow-float)] active:scale-[0.99] transition"
        >
          Sign in
        </button>
      </form>

      <p className="text-xs text-center text-muted-foreground mt-6">
        New to EcoRefill?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Create account
        </Link>
      </p>
    </div>
  );
}
