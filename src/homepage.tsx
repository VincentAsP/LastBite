import { useState } from "react";
import { Link } from "react-router-dom";

const PROFILE_IMG =
  "https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110";
const GIFT_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/5917e7ec8d23a54a5ebb1c97985e7dc666be04c5?width=80";
const FOOD_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/0f608006e6a12a99de99f92c674b7a418e74269e?width=80";
const CHART_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/d81f259d225ee70c0f4161d6fbf62412d4edcea6?width=80";

function HamburgerIcon() {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="none">
      <rect width="41" height="41" rx="10" fill="white" fillOpacity="0.3" />
      <path d="M11 14h19M11 20.5h19M11 27h19" stroke="#324D3E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="9.5" cy="9.5" r="7" stroke="#92AF8C" strokeWidth="2" />
      <path d="M14.5 14.5L19 19" stroke="#92AF8C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="21" height="18" viewBox="0 0 21 18" fill="none">
      <path
        d="M19.0469 8.05V16C19.0469 16.55 18.8511 17.0208 18.4594 17.4125C18.0678 17.8042 17.5969 18 17.0469 18H3.04694C2.49694 18 2.02611 17.8042 1.63444 17.4125C1.24277 17.0208 1.04694 16.55 1.04694 16V8.05C0.663605 7.7 0.367772 7.25 0.159439 6.7C-0.0488946 6.15 -0.0530612 5.55 0.146939 4.9L1.19694 1.5C1.33027 1.06667 1.56777 0.708333 1.90944 0.425C2.25111 0.141667 2.64694 0 3.09694 0H16.9969C17.4469 0 17.8386 0.1375 18.1719 0.4125C18.5053 0.6875 18.7469 1.05 18.8969 1.5L19.9469 4.9C20.1469 5.55 20.1428 6.14167 19.9344 6.675C19.7261 7.20833 19.4303 7.66667 19.0469 8.05ZM12.2469 7C12.6969 7 13.0386 6.84583 13.2719 6.5375C13.5053 6.22917 13.5969 5.88333 13.5469 5.5L12.9969 2H11.0469V5.7C11.0469 6.05 11.1636 6.35417 11.3969 6.6125C11.6303 6.87083 11.9136 7 12.2469 7ZM7.74694 7C8.13027 7 8.44277 6.87083 8.68444 6.6125C8.92611 6.35417 9.04694 6.05 9.04694 5.7V2H7.09694L6.54694 5.5C6.48027 5.9 6.56777 6.25 6.80944 6.55C7.05111 6.85 7.36361 7 7.74694 7ZM3.29694 7C3.59694 7 3.85944 6.89167 4.08444 6.675C4.30944 6.45833 4.44694 6.18333 4.49694 5.85L5.04694 2H3.09694L2.09694 5.35C1.99694 5.68333 2.05111 6.04167 2.25944 6.425C2.46777 6.80833 2.81361 7 3.29694 7ZM16.7969 7C17.2803 7 17.6303 6.80833 17.8469 6.425C18.0636 6.04167 18.1136 5.68333 17.9969 5.35L16.9469 2H15.0469L15.5969 5.85C15.6469 6.18333 15.7844 6.45833 16.0094 6.675C16.2344 6.89167 16.4969 7 16.7969 7ZM3.04694 16H17.0469V8.95C16.9636 8.98333 16.9094 9 16.8844 9C16.8594 9 16.8303 9 16.7969 9C16.3469 9 15.9511 8.925 15.6094 8.775C15.2678 8.625 14.9303 8.38333 14.5969 8.05C14.2969 8.35 13.9553 8.58333 13.5719 8.75C13.1886 8.91667 12.7803 9 12.3469 9C11.8969 9 11.4761 8.91667 11.0844 8.75C10.6928 8.58333 10.3469 8.35 10.0469 8.05C9.76361 8.35 9.43444 8.58333 9.05944 8.75C8.68444 8.91667 8.28027 9 7.84694 9C7.36361 9 6.92611 8.91667 6.53444 8.75C6.14277 8.58333 5.79694 8.35 5.49694 8.05C5.14694 8.4 4.80111 8.64583 4.45944 8.7875C4.11777 8.92917 3.73027 9 3.29694 9C3.26361 9 3.22611 9 3.18444 9C3.14277 9 3.09694 8.98333 3.04694 8.95V16Z"
        fill="#065F46"
      />
    </svg>
  );
}

function ProfileNavIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0Z"
        fill="#57534E"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M9.95 16C10.3 16 10.5958 15.8792 10.8375 15.6375C11.0792 15.3958 11.2 15.1 11.2 14.75C11.2 14.4 11.0792 14.1042 10.8375 13.8625C10.5958 13.6208 10.3 13.5 9.95 13.5C9.6 13.5 9.30417 13.6208 9.0625 13.8625C8.82083 14.1042 8.7 14.4 8.7 14.75C8.7 15.1 8.82083 15.3958 9.0625 15.6375C9.30417 15.8792 9.6 16 9.95 16ZM9.05 12.15H10.9C10.9 11.6 10.9625 11.1667 11.0875 10.85C11.2125 10.5333 11.5667 10.1 12.15 9.55C12.5833 9.11667 12.925 8.70417 13.175 8.3125C13.425 7.92083 13.55 7.45 13.55 6.9C13.55 5.96667 13.2083 5.25 12.525 4.75C11.8417 4.25 11.0333 4 10.1 4C9.15 4 8.37917 4.25 7.7875 4.75C7.19583 5.25 6.78333 5.85 6.55 6.55L8.2 7.2C8.28333 6.9 8.47083 6.575 8.7625 6.225C9.05417 5.875 9.5 5.7 10.1 5.7C10.6333 5.7 11.0333 5.84583 11.3 6.1375C11.5667 6.42917 11.7 6.75 11.7 7.1C11.7 7.43333 11.6 7.74583 11.4 8.0375C11.2 8.32917 10.95 8.6 10.65 8.85C9.91667 9.5 9.46667 9.99167 9.3 10.325C9.13333 10.6583 9.05 11.2667 9.05 12.15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
        fill="#57534E"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path
        d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z"
        fill="#57534E"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z"
        fill="#DC2626"
      />
    </svg>
  );
}

export default function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Mobile-first phone shell, centered on larger screens */}
      <div
        className="relative w-full max-w-[402px] min-h-screen sm:min-h-0 sm:h-[874px] overflow-hidden"
        style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}
      >
        {/* ─── MAIN CONTENT ─── */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ filter: sidebarOpen ? "blur(2px)" : "none" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-7 pb-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-[41px] h-[41px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <HamburgerIcon />
            </button>
            <img
              src={PROFILE_IMG}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-[17px] mx-[22px] mt-[30px]">
            <div className="flex-1 h-11 rounded-[50px] bg-white flex items-center px-4 gap-3">
              <SearchIcon />
              <span
                className="text-sm text-gray-400"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Search...
              </span>
            </div>
            <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 5h16M4 9h10M7 13h4" stroke="#324D3E" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Banner card */}
          <div className="mx-[22px] mt-[20px]">
            <div className="w-full rounded-[30px] bg-white" style={{ height: 159 }}>
              {/* Banner content placeholder */}
              <div className="w-full h-full rounded-[30px] flex items-center justify-center">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#92AF8C", fontFamily: "Poppins, sans-serif" }}
                >
                  Featured Banner
                </span>
              </div>
            </div>
            {/* Carousel dots */}
            <div className="flex items-center justify-center gap-[6px] mt-[10px]">
              <div className="w-[17px] h-[10px] rounded-full" style={{ background: "#324D3E" }} />
              <div className="w-[5px] h-[10px] rounded-full" style={{ background: "#324D3E" }} />
              <div className="w-[5px] h-[10px] rounded-full" style={{ background: "#324D3E" }} />
              <div className="w-[5px] h-[10px] rounded-full" style={{ background: "#324D3E" }} />
              <div className="w-[5px] h-[10px] rounded-full" style={{ background: "#324D3E" }} />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-[30px] mx-[52px] mt-[28px]">
            {/* Mystery Box */}
            <Link 
            to = "/mystery"
            className="flex flex-col items-center gap-[5px]">
              <div
                className="w-[74px] h-[73px] rounded-[25px] bg-white flex items-center justify-center"
              >
                <img src={GIFT_ICON} alt="Mystery Box" className="w-10 h-10" />
              </div>
              <span
                className="text-xs font-bold text-center"
                style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
              >
                Mystery Box
              </span>
            </Link>

            {/* Food */}
            <Link to = "/food" className="flex flex-col items-center gap-[5px]">
              <div className="w-[74px] h-[73px] rounded-[25px] bg-white flex items-center justify-center">
                <img src={FOOD_ICON} alt="Food" className="w-10 h-10" />
              </div>
              <span
                className="text-xs font-bold text-center"
                style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
              >
                Food
              </span>
            </Link>

            {/* Chart */}
            <Link to="/chart" 
              className="flex flex-col items-center gap-[5px]">
              <div className="w-[74px] h-[73px] rounded-[25px] bg-white flex items-center justify-center">
                <img src={CHART_ICON} alt="Chart" className="w-10 h-10" />
              </div>
              <span
                className="text-xs font-bold text-center"
                style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
              >
                Chart
              </span>
            </Link>
          </div>

          {/* Best Deals Today */}
          <div className="mx-[22px] mt-[24px]">
            <div className="flex items-center justify-between mb-[14px]">
              <span
                className="text-sm font-bold"
                style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
              >
                Best Deals Today
              </span>
              <span
                className="text-sm font-bold underline cursor-pointer"
                style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
              >
                See all
              </span>
            </div>

            {/* Deal cards */}
            <div className="flex gap-[10px]">
              <div
                className="flex-1 rounded-[20px] bg-white"
                style={{ height: 218 }}
              >
                <div className="w-full h-full rounded-[20px] flex items-end justify-center pb-4">
                  <span
                    className="text-xs text-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Deal 1
                  </span>
                </div>
              </div>
              <div
                className="flex-1 rounded-[20px] bg-white"
                style={{ height: 218 }}
              >
                <div className="w-full h-full rounded-[20px] flex items-end justify-center pb-4">
                  <span
                    className="text-xs text-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Deal 2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SIDEBAR OVERLAY ─── */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-white bg-opacity-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR DRAWER ─── */}
        <div
          className="absolute top-0 left-0 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out"
          style={{
            width: 316,
            boxShadow: "0 4px 50px 10px rgba(0,0,0,0.25)",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {/* Sidebar header with menu button */}
          <div className="pt-7 px-5">
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-[41px] h-[41px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <HamburgerIcon />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 px-4 mt-6 flex-1">
            {/* Switch to Seller — active */}
            <button className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[#ECFDF5] w-full text-left">
              <StoreIcon />
              <span
                className="text-sm font-bold"
                style={{ color: "#065F46", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: "20px" }}
              >
                Switch to Seller
              </span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors">
              <ProfileNavIcon />
              <span
                className="text-sm font-normal"
                style={{ color: "#57534E", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: "20px" }}
              >
                Profile
              </span>
            </button>

            {/* Help & Support */}
            <button className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors">
              <HelpIcon />
              <span
                className="text-sm font-normal"
                style={{ color: "#57534E", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: "20px" }}
              >
                Help & Support
              </span>
            </button>

            {/* Settings */}
            <button className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors">
              <SettingsIcon />
              <span
                className="text-sm font-normal"
                style={{ color: "#57534E", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: "20px" }}
              >
                Settings
              </span>
            </button>
          </nav>

          {/* Logout */}
          <div
            className="mx-[14px] mb-6 pt-4 border-t"
            style={{ borderColor: "#F5F5F4" }}
          >
            <Link
             to = "/"
             className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left hover:bg-red-50 transition-colors">
              <LogoutIcon />
              <span
                className="text-sm font-semibold"
                style={{ color: "#DC2626", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: "20px" }}
              >
                Logout
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
