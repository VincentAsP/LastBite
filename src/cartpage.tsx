import { useState } from "react";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Ayam Penyet",
    restaurant: "Ayam Penyet Lala",
    price: 30000,
    quantity: 2,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/f45a1f3e410b2e223c9db4f023260a0c0790d250?width=140",
  },
];

function formatPrice(amount: number) {
  return `Rp${amount.toLocaleString("id-ID").replace(/\./g, ".")}`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  function increment(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrement(id: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DAE6D8] to-[#92AF8C] font-poppins">
      <div className="max-w-[402px] mx-auto min-h-screen flex flex-col px-8 pb-8">
        {/* Header */}
        <div className="pt-16 pb-6 flex items-end justify-between">
          <h1 className="text-[32px] font-bold text-[#748B6F] font-poppins leading-tight">
            My cart
          </h1>
          <button className="font-jakarta font-bold text-[20px] text-[#246DC1] underline underline-offset-2 leading-none pb-1">
            Add items
          </button>
        </div>

        {/* Cart items */}
        <div className="flex flex-col gap-4 flex-1">
          {items.length === 0 ? (
            <div className="bg-white rounded-[10px] p-6 text-center text-gray-400 font-jakarta">
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[10px] p-4 flex items-center gap-3"
              >
                {/* Food image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[70px] h-[70px] rounded-[20px] object-cover flex-shrink-0"
                />

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  {/* Restaurant */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg
                      width="12"
                      height="11"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M0.666667 1.33333V0H11.3333V1.33333H0.666667ZM0.666667 10.6667V6.66667H0V5.33333L0.666667 2H11.3333L12 5.33333V6.66667H11.3333V10.6667H10V6.66667H7.33333V10.6667H0.666667ZM2 9.33333H6V6.66667H2V9.33333ZM1.36667 5.33333H10.6333H1.36667ZM1.36667 5.33333H10.6333L10.2333 3.33333H1.76667L1.36667 5.33333Z"
                        fill="#5F5E5B"
                      />
                    </svg>
                    <span className="text-[#5F5E5B] font-jakarta text-[15px] leading-[22px] truncate">
                      {item.restaurant}
                    </span>
                  </div>

                  {/* Name */}
                  <p className="text-[#161D1F] font-poppins text-[17px] leading-[26px] font-normal truncate">
                    {item.name}
                  </p>

                  {/* Price + quantity row */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-black font-poppins text-[15px] font-bold leading-[22px]">
                      {formatPrice(item.price)}
                    </span>

                    {/* Quantity control */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-[20px] h-[20px] flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/ec48b4f5e33a55bcaab50ec9f919e65f9961bdda?width=40"
                          alt="minus"
                          className="w-5 h-5"
                        />
                      </button>
                      <div className="w-[22px] h-[25px] bg-[#F5F5F5] flex items-center justify-center">
                        <span className="font-poppins text-[15px] text-black leading-[22px]">
                          {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-[18px] h-[18px] flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/d05e0f1e8d4b94c6c9257f5191f815cab1726fdd?width=36"
                          alt="plus"
                          className="w-[18px] h-[18px]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout section */}
        <div className="mt-6 pt-4">
          {items.length > 0 && (
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="font-jakarta text-[15px] text-[#324D3E] font-semibold">
                Total
              </span>
              <span className="font-poppins text-[15px] font-bold text-[#324D3E]">
                {formatPrice(subtotal)}
              </span>
            </div>
          )}
          <div className="bg-white/10 rounded-lg p-2.5">
            <Link to = "/order" className="w-full h-[52px] bg-[#324D3E] rounded-[8px] flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(79,97,68,0.20),0_4px_6px_-4px_rgba(79,97,68,0.20)] hover:bg-[#2a3f32] transition-colors">
              <span className="font-jakarta font-bold text-[16px] text-white leading-6">
                Checkout
              </span>
            </Link>
          </div>
        </div>

        {/* ── BARIS BARU: NAVIGASI BAWAH UNTUK CART PAGE ── */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] h-14 flex items-center justify-around px-6 z-50"
          style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}
        >
          {/* Tombol Home */}
          <Link to="/home" className="flex flex-col items-center gap-0.5">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60" alt="Home" className="w-7 h-7" />
            <span className="font-poppins text-[10px] text-white">Home</span>
          </Link>

          {/* Tombol Cart (Aktif & Dikunci) */}
          <button className="flex flex-col items-center gap-0.5 opacity-60 cursor-default">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60" alt="Cart" className="w-7 h-7" />
            <span className="font-poppins text-[10px] text-[#2a3f32] font-bold">Cart</span>
          </button>

          {/* Tombol History/Chart */}
          <Link to="/chart" className="flex flex-col items-center gap-0.5">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60" alt="History" className="w-7 h-7" />
            <span className="font-poppins text-[10px] text-white">History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
