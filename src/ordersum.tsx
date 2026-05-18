import { Link } from "react-router-dom";

export default function OrderSum() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-[402px] min-h-screen flex flex-col px-5 py-0 relative" style={{ fontFamily: "Poppins, sans-serif" }}>

        {/* Header */}
        <div className="flex items-center gap-3 pt-16 pb-4">
          <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M2 4V0H34V4H2ZM2 32V20H0V16L2 6H34L36 16V20H34V32H30V20H22V32H2ZM6 28H18V20H6V28ZM4.1 16H31.9L30.7 10H5.3L4.1 16Z" fill="#161D1F"/>
          </svg>
          <span className="text-xl font-bold text-[#161D1F]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Ayam Penyet Lala
          </span>
        </div>

        {/* Order Summary Title Row */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <h1 className="text-xl font-bold text-[#161D1F]">Order summary</h1>
          <button className="text-xl font-bold text-[#246DC1]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Add items
          </button>
        </div>

        {/* Order Item */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f45a1f3e410b2e223c9db4f023260a0c0790d250?width=140"
            alt="Ayam Penyet"
            className="w-[70px] h-[70px] rounded-[20px] object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-[15px] font-bold text-[#161D1F]">Ayam Penyet</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[15px] font-bold text-[#161D1F]">30.000</span>
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <span className="text-[15px] font-bold text-black leading-none">2</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div className="bg-white rounded-[20px] p-4 mb-4">
          <div className="grid grid-cols-2 gap-y-0">
            <span className="text-[15px] font-bold text-black py-1">Subtotal</span>
            <span className="text-[15px] font-bold text-black py-1 text-right">60.000</span>
            <span className="text-[15px] font-bold text-black py-1">Tax (10%)</span>
            <span className="text-[15px] font-bold text-black py-1 text-right">6.000</span>
            <span className="text-[15px] font-bold text-black py-1">Total Price</span>
            <span className="text-[15px] font-bold text-black py-1 text-right">66.000</span>
          </div>
        </div>

        {/* Spacer to push bottom content down */}
        <div className="flex-1" />

        {/* Address Card */}
        <div className="bg-white rounded-[20px] px-4 py-3 mb-3 flex items-center gap-3 relative overflow-hidden">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/892ae296722f974c15e42de07cd7c09a65a9c4f8?width=40"
            alt="Location"
            className="w-5 h-8 flex-shrink-0 object-contain"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-black truncate">Slateford Road, Edinburgh</p>
          </div>
          <button className="text-xs font-bold text-[#246DC1] underline flex-shrink-0 ml-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Change Address
          </button>
        </div>

        {/* Payment Detail Card */}
        <div className="bg-white rounded-[20px] px-4 py-3 mb-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[15px] font-bold text-black">Payment Detail</span>
            <button className="text-xs font-bold text-[#246DC1] underline" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              See all
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/4f77040ed5e4ca17833513fef30676dc45e50c4c?width=60"
              alt="Credit Card"
              className="w-[30px] h-[30px] object-contain flex-shrink-0"
            />
            <span className="text-xs font-bold text-black" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>2143</span>
          </div>
        </div>

        {/* Proceed Order Button */}
        <Link to = "/finish" className="w-full py-3 rounded-[20px] bg-[#324D3E] text-white text-[15px] font-bold mb-10 hover:bg-[#273d31] transition-colors">
          Proceed Order
        </Link>
      </div>
    </div>
  );
}
