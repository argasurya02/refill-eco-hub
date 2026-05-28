// Lightweight localStorage-backed store for the EcoRefill mock app.
import { useSyncExternalStore } from "react";

export type User = { id: string; name: string; email: string };
export type Bottle = {
  id: string;
  product: string;
  size: number; // ml
  status: "active" | "returned" | "recycled" | "damaged";
  acquiredAt: string;
};
export type Tx = {
  id: string;
  type: "refill" | "topup" | "deposit" | "refund" | "reward";
  title: string;
  amount: number; // positive = debit, negative = credit (for wallet view we show signed)
  volume?: number;
  date: string;
  status: "success" | "pending" | "failed";
  machine?: string;
  qrPayload?: string;
};
export type Machine = {
  id: string;
  name: string;
  location: string;
  distance: string;
  status: "available" | "offline" | "maintenance" | "empty";
  products: string[];
};

export type State = {
  user: User | null;
  wallet: number;
  deposit: number;
  ecoPoints: number;
  bottlesSaved: number;
  plasticGrams: number;
  bottles: Bottle[];
  transactions: Tx[];
};

const KEY = "ecorefill_state_v1";

const initial: State = {
  user: null,
  wallet: 125000,
  deposit: 30000,
  ecoPoints: 420,
  bottlesSaved: 12,
  plasticGrams: 320,
  bottles: [
    { id: "b1", product: "Lavender Hand Soap", size: 500, status: "active", acquiredAt: "2025-03-10" },
    { id: "b2", product: "Citrus Shampoo", size: 750, status: "active", acquiredAt: "2025-04-02" },
    { id: "b3", product: "Eco Detergent", size: 1000, status: "returned", acquiredAt: "2024-12-18" },
  ],
  transactions: [
    { id: "t1", type: "refill", title: "Lavender Hand Soap · 500ml", amount: 18000, volume: 500, date: "2026-05-22", status: "success", machine: "EcoHub Senayan" },
    { id: "t2", type: "topup", title: "Wallet Top-up", amount: -50000, date: "2026-05-20", status: "success" },
    { id: "t3", type: "refill", title: "Citrus Shampoo · 250ml", amount: 22000, volume: 250, date: "2026-05-15", status: "success", machine: "EcoHub Kemang" },
    { id: "t4", type: "deposit", title: "Bottle Deposit · 1L", amount: 15000, date: "2026-04-02", status: "success" },
    { id: "t5", type: "refund", title: "Bottle Refund", amount: -15000, date: "2026-03-30", status: "success" },
  ],
};

export const machines: Machine[] = [
  { id: "m1", name: "EcoHub Senayan", location: "Senayan City, Ground Floor", distance: "0.4 km", status: "available", products: ["Hand Soap", "Shampoo", "Detergent", "Dish Soap"] },
  { id: "m2", name: "EcoHub Kemang", location: "Kemang Village, Lobby", distance: "1.8 km", status: "available", products: ["Hand Soap", "Shampoo", "Body Wash"] },
  { id: "m3", name: "EcoHub Sudirman", location: "Plaza Indonesia, B1", distance: "2.6 km", status: "empty", products: ["Detergent"] },
  { id: "m4", name: "EcoHub PIK", location: "PIK Avenue, Level 1", distance: "9.1 km", status: "maintenance", products: [] },
  { id: "m5", name: "EcoHub BSD", location: "AEON Mall BSD", distance: "14.3 km", status: "offline", products: [] },
];

export const products = [
  { id: "p1", name: "Lavender Hand Soap", icon: "🧼", pricePerMl: 36 },
  { id: "p2", name: "Citrus Shampoo", icon: "🧴", pricePerMl: 88 },
  { id: "p3", name: "Eco Detergent", icon: "🧺", pricePerMl: 42 },
  { id: "p4", name: "Body Wash Mint", icon: "🚿", pricePerMl: 60 },
  { id: "p5", name: "Dish Soap", icon: "🍽️", pricePerMl: 30 },
];

export const rewards = [
  { id: "r1", name: "Rp 10.000 Refill Voucher", cost: 200, icon: "🎟️" },
  { id: "r2", name: "Free 250ml Refill", cost: 350, icon: "💧" },
  { id: "r3", name: "Reusable Bottle 500ml", cost: 800, icon: "🍶" },
  { id: "r4", name: "Tote Bag EcoRefill", cost: 1200, icon: "👜" },
];

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export function getState() {
  return state;
}
export function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
}
export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => selector(state),
    () => selector(initial),
  );
}

// Actions
export const actions = {
  login(email: string, name?: string) {
    setState((s) => ({ ...s, user: { id: "u1", email, name: name || email.split("@")[0] } }));
  },
  logout() {
    setState((s) => ({ ...s, user: null }));
  },
  topup(amount: number) {
    const tx: Tx = {
      id: "t" + Date.now(),
      type: "topup",
      title: "Wallet Top-up",
      amount: -amount,
      date: new Date().toISOString().slice(0, 10),
      status: "success",
    };
    setState((s) => ({ ...s, wallet: s.wallet + amount, transactions: [tx, ...s.transactions] }));
  },
  refill(payload: { product: string; volume: number; price: number; machine: string }) {
    const qr = JSON.stringify({
      txId: "ECO-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
      ...payload,
      ts: Date.now(),
    });
    const tx: Tx = {
      id: "t" + Date.now(),
      type: "refill",
      title: `${payload.product} · ${payload.volume}ml`,
      amount: payload.price,
      volume: payload.volume,
      date: new Date().toISOString().slice(0, 10),
      status: "success",
      machine: payload.machine,
      qrPayload: qr,
    };
    setState((s) => ({
      ...s,
      wallet: s.wallet - payload.price,
      ecoPoints: s.ecoPoints + Math.round(payload.volume / 10),
      bottlesSaved: s.bottlesSaved + 1,
      plasticGrams: s.plasticGrams + Math.round(payload.volume * 0.05),
      transactions: [tx, ...s.transactions],
    }));
    return qr;
  },
  redeem(rewardId: string, cost: number, name: string) {
    if (state.ecoPoints < cost) return false;
    const tx: Tx = {
      id: "t" + Date.now(),
      type: "reward",
      title: `Redeemed: ${name}`,
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      status: "success",
    };
    setState((s) => ({ ...s, ecoPoints: s.ecoPoints - cost, transactions: [tx, ...s.transactions] }));
    return true;
  },
  returnBottle(id: string) {
    setState((s) => ({
      ...s,
      bottles: s.bottles.map((b) => (b.id === id ? { ...b, status: "returned" } : b)),
      wallet: s.wallet + 15000,
      transactions: [
        {
          id: "t" + Date.now(),
          type: "refund",
          title: "Bottle Refund",
          amount: -15000,
          date: new Date().toISOString().slice(0, 10),
          status: "success",
        },
        ...s.transactions,
      ],
    }));
  },
};

export const formatIDR = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");
