import { useState } from "react";
import { Link } from "react-router-dom";

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 18L4 12L10 6M15 18L9 12L15 6" stroke="#1F3A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeNavIcon() {
  return (
    <img src="https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60" alt="Home" className="w-7 h-7" />
  );
}

function CartNavIcon() {
  return (
    <img src="https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60" alt="Cart" className="w-7 h-7" />
  );
}

function HistoryNavIcon() {
  return (
    <img src="https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60" alt="History" className="w-7 h-7" />
  );
}

export default function ChartPage() {
  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-sm min-h-screen flex flex-col relative pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <Link to="/home" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-sm">
            <BackIcon />
          </Link>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110"
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="px-5 mt-4">
          <h1 className="font-poppins font-bold text-xl text-[#324D3E]">Eco-Impact Tracker</h1>
          <p className="font-poppins text-xs text-[#5F5E5B]">Your contribution to reducing food waste</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-5">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <span className="text-2xl font-bold text-[#4F6144]">12.5 kg</span>
            <p className="text-[11px] text-gray-500 font-poppins mt-1">Food Rescued</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <span className="text-2xl font-bold text-[#974135]">Rp240k</span>
            <p className="text-[11px] text-gray-500 font-poppins mt-1">Money Saved</p>
          </div>
        </div>

        {/* Mock Graphic Analytics Box */}
        <div className="mx-4 mt-5 flex-1 bg-white rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[300px]">
          <span className="text-sm font-bold text-[#324D3E] font-poppins">Weekly Analytics</span>
          
          {/* Simple CSS Bar Chart */}
          <div className="flex items-end justify-around h-44 pt-6 px-2 border-b border-gray-100">
            <div className="flex flex-col items-center gap-2 w-8">
              <div className="bg-[#92AF8C] w-full rounded-t-lg h-24"></div>
              <span className="text-[10px] text-gray-400 font-poppins">Mon</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-8">
              <div className="bg-[#92AF8C] w-full rounded-t-lg h-36"></div>
              <span className="text-[10px] text-gray-400 font-poppins">Tue</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-8">
              <div className="bg-[#4F6144] w-full rounded-t-lg h-40"></div>
              <span className="text-[10px] text-gray-700 font-bold font-poppins">Wed</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-8">
              <div className="bg-[#92AF8C] w-full rounded-t-lg h-16"></div>
              <span className="text-[10px] text-gray-400 font-poppins">Thu</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-8">
              <div className="bg-[#92AF8C] w-full rounded-t-lg h-28"></div>
              <span className="text-[10px] text-gray-400 font-poppins">Fri</span>
            </div>
          </div>
          
          <p className="text-center text-[11px] text-gray-400 font-poppins mt-4">
            You rescued the most food on Wednesday this week!
          </p>
        </div>

        {/* Bottom navigation */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-14 flex items-center justify-around px-6"
          style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}
        >
          <Link to="/home" className="flex flex-col items-center gap-0.5">
            <HomeNavIcon />
            <span className="font-poppins text-[10px] text-white">Home</span>
          </Link>
          <Link to = "/cart" className="flex flex-col items-center gap-0.5">
            <CartNavIcon />
            <span className="font-poppins text-[10px] text-white">Cart</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5">
            <HistoryNavIcon />
            <span className="font-poppins text-[10px] text-white">History</span>
          </button>
        </div>

      </div>
    </div>
  );
}