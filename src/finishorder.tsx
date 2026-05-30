import { Link } from "react-router-dom";

function SuccessCheckIcon() {
  return (
    <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center text-[#065F46] shadow-sm animate-bounce">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

export default function FinishOrder() {
  // Generate mock order ID acak untuk keperluan demo tugas
  const orderId = `LBT-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-sm min-h-screen flex flex-col justify-between px-6 pt-20 pb-10 relative">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-[30px] p-8 shadow-xl flex flex-col items-center text-center my-auto">
          {/* Animated Green Check Icon */}
          <SuccessCheckIcon />

          {/* Success Message */}
          <h1 className="font-poppins font-bold text-2xl text-[#324D3E] mt-6 leading-tight">
            Order Placed <br /> Successfully!
          </h1>
          <p className="font-poppins text-xs text-[#5F5E5B] mt-2 max-w-[240px]">
            Your eco-rescue food has been reserved. Thank you for reducing food waste!
          </p>

          {/* Divider Line */}
          <div className="w-full border-t border-dashed border-gray-200 my-6" />

          {/* Transaction Details */}
          <div className="w-full flex flex-col gap-3 text-left font-poppins">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Order ID</span>
              <span className="font-bold text-gray-700 font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Payment Status</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                PAID
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Pickup Method</span>
              <span className="font-semibold text-gray-700">Self-Pickup</span>
            </div>
          </div>

          <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 mt-6 w-full font-poppins">
            ⚠️ Please pick up your food before the store's countdown timer runs out!
          </p>
        </div>

        {/* Action Button to Return Home */}
        <div className="w-full">
          <Link 
            to="/home" 
            className="w-full h-[52px] bg-[#324D3E] rounded-[12px] flex items-center justify-center shadow-lg hover:bg-[#2a3f32] transition-all transform active:scale-95"
          >
            <span className="font-jakarta font-bold text-[16px] text-white leading-6">
              Back to Homepage
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}