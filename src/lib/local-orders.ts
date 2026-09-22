export type SavedOrder = {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  deliveryMethod: string;
  paymentMethod: string;
  customerName: string;
  mobile: string;
  items: { name: string; image: string | null; size: string | null; qty: number; price: number }[];
};

const KEY = "nyc_orders";

export function readLocalOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: SavedOrder) {
  try {
    const prev = readLocalOrders().filter((o) => o.orderNumber !== order.orderNumber);
    localStorage.setItem(KEY, JSON.stringify([order, ...prev].slice(0, 20)));
  } catch {
    /* ignore quota */
  }
}
