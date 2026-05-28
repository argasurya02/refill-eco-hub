import { Navigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import type { ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user);
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}
