import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
}

// === Status order yang valid ===
// In-progress: pesanan masih jalan
// Terminal:    pesanan sudah selesai / dibatalkan
export type OrderStatus =
  | 'preparing'      // restoran sedang menyiapkan
  | 'on_the_way'     // delivery: kurir di jalan
  | 'delivered'      // delivery: sudah sampai
  | 'ready'          // pickup: siap diambil
  | 'picked_up'      // pickup: sudah diambil
  | 'completed'      // selesai (alias terminal untuk delivered/picked_up)
  | 'cancelled';     // dibatalkan

export type OrderType = 'delivery' | 'pickup';

export interface OrderRecord {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  orderType?: OrderType; // optional: useful untuk filter di history
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  totalCount: number;
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const increment = (id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrement = (id: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  // Helper untuk update status order (dipanggil saat status berubah dari backend)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increment,
        decrement,
        totalCount,
        orders,
        addOrder,
        updateOrderStatus,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}