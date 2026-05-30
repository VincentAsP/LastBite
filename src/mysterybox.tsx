import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const boxes = [
  {
    id: 1,
    title: "Artisan Sweet Box",
    store: "Lumière Pâtisserie",
    distance: "0.8 km",
    category: "Sweet Bread",
    price: "Rp45.900",
    originalPrice: "Rp90.000",
    timer: 45 * 60 + 12, // 1. Ganti string jadi hitungan detik
    image: "https://api.builder.io/api/v1/image/assets/TEMP/73c16a1daeb8e8e38381d974a1914a831489157d?width=636",
    favorited: false,
  },
  {
    id: 2,
    title: "Green Garden Surprise",
    store: "The Sprout House",
    distance: "1.2 km",
    category: "Vegan",
    price: "RP30.000",
    originalPrice: "Rp60.000",
    timer: 12 * 60 + 5, // 2. Ganti string jadi hitungan detik
    image: "https://api.builder.io/api/v1/image/assets/TEMP/52e52f30ee10837cf7802e05aa6f64e7620b2fdb?width=636",
    favorited: false,
  },
  {
    id: 3,
    title: "Midnight Savory Kit",
    store: "The Urban Grill",
    distance: "2.5 km",
    category: "Savory",
    price: "Rp50.000",
    originalPrice: "Rp90.000",
    timer: 5 * 60 + 44, // 3. Ganti string jadi hitungan detik
    image: "https://api.builder.io/api/v1/image/assets/TEMP/1e09ddfed9a948c80c35ff0116e30bb30063539e?width=636",
    favorited: false,
  },
  {
    id: 4,
    title: "Family Pantry Box",
    store: "FreshCo Market",
    distance: "3.1 km",
    category: "Groceries",
    price: "Rp90.000",
    originalPrice: "Rp150.000",
    timer: 38 * 60 + 19, // 4. Ganti string jadi hitungan detik
    image: "https://api.builder.io/api/v1/image/assets/TEMP/faf72ac6975c44aeb0d097736c3da20529c32ce2?width=636",
    favorited: false,
  },
];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function TimerIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path
        d="M4 1.33333V0H8V1.33333H4ZM5.33333 8.66667H6.66667V4.66667H5.33333V8.66667ZM6 14C5.17778 14 4.40278 13.8417 3.675 13.525C2.94722 13.2083 2.31111 12.7778 1.76667 12.2333C1.22222 11.6889 0.791667 11.0528 0.475 10.325C0.158333 9.59722 0 8.82222 0 8C0 7.17778 0.158333 6.40278 0.475 5.675C0.791667 4.94722 1.22222 4.31111 1.76667 3.76667C2.31111 3.22222 2.94722 2.79167 3.675 2.475C4.40278 2.15833 5.17778 2 6 2C6.68889 2 7.35 2.11111 7.98333 2.33333C8.61667 2.55556 9.21111 2.87778 9.76667 3.3L10.7 2.36667L11.6333 3.3L10.7 4.23333C11.1222 4.78889 11.4444 5.38333 11.6667 6.01667C11.8889 6.65 12 7.31111 12 8C12 8.82222 11.8417 9.59722 11.525 10.325C11.2083 11.0528 10.7778 11.6889 10.2333 12.2333C9.68889 12.7778 9.05278 13.2083 8.325 13.525C7.59722 13.8417 6.82222 14 6 14ZM6 12.6667C7.28889 12.6667 8.38889 12.2111 9.3 11.3C10.2111 10.3889 10.6667 9.28889 10.6667 8C10.6667 6.71111 10.2111 5.61111 9.3 4.7C8.38889 3.78889 7.28889 3.33333 6 3.33333C4.71111 3.33333 3.61111 3.78889 2.7 4.7C1.78889 5.61111 1.33333 6.71111 1.33333 8C1.33333 9.28889 1.78889 10.3889 2.7 11.3C3.61111 12.2111 4.71111 12.6667 6 12.6667Z"
        fill="white"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path
        d="M0.666667 1.33333V0H11.3333V1.33333H0.666667ZM0.666667 10.6667V6.66667H0V5.33333L0.666667 2H11.3333L12 5.33333V6.66667H11.3333V10.6667H10V6.66667H7.33333V10.6667H0.666667ZM2 9.33333H6V6.66667H2V9.33333ZM1.36667 5.33333H10.6333H1.36667ZM1.36667 5.33333H10.6333L10.2333 3.33333H1.76667L1.36667 5.33333Z"
        fill="#5F5E5B"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path
        d="M4.08333 11.6667C3.05278 11.6667 2.21181 11.5038 1.56042 11.1781C0.909028 10.8524 0.583333 10.4319 0.583333 9.91667C0.583333 9.68333 0.653819 9.46701 0.794792 9.26771C0.935764 9.0684 1.13264 8.89583 1.38542 8.75L2.30417 9.61042C2.21667 9.64931 2.12188 9.69306 2.01979 9.74167C1.91771 9.79028 1.8375 9.84861 1.77917 9.91667C1.90556 10.0722 2.19722 10.2083 2.65417 10.325C3.11111 10.4417 3.5875 10.5 4.08333 10.5C4.57917 10.5 5.05799 10.4417 5.51979 10.325C5.9816 10.2083 6.27569 10.0722 6.40208 9.91667C6.33403 9.83889 6.24653 9.77569 6.13958 9.72708C6.03264 9.67847 5.93056 9.63472 5.83333 9.59583L6.7375 8.72083C7.00972 8.87639 7.21875 9.05382 7.36458 9.25313C7.51042 9.45243 7.58333 9.67361 7.58333 9.91667C7.58333 10.4319 7.25764 10.8524 6.60625 11.1781C5.95486 11.5038 5.11389 11.6667 4.08333 11.6667ZM4.09792 8.45833C5.06042 7.74861 5.78472 7.03646 6.27083 6.32188C6.75694 5.60729 7 4.89028 7 4.17083C7 3.17917 6.68403 2.43056 6.05208 1.925C5.42014 1.41944 4.76389 1.16667 4.08333 1.16667C3.40278 1.16667 2.74653 1.41944 2.11458 1.925C1.48264 2.43056 1.16667 3.17917 1.16667 4.17083C1.16667 4.82222 1.40486 5.50035 1.88125 6.20521C2.35764 6.91007 3.09653 7.66111 4.09792 8.45833ZM4.08333 9.91667C2.7125 8.90556 1.68924 7.92361 1.01354 6.97083C0.337847 6.01806 0 5.08472 0 4.17083C0 3.48056 0.123958 2.87535 0.371875 2.35521C0.619792 1.83507 0.938194 1.4 1.32708 1.05C1.71597 0.7 2.15347 0.4375 2.63958 0.2625C3.12569 0.0875 3.60694 0 4.08333 0C4.55972 0 5.04097 0.0875 5.52708 0.2625C6.01319 0.4375 6.45069 0.7 6.83958 1.05C7.22847 1.4 7.54688 1.83507 7.79479 2.35521C8.04271 2.87535 8.16667 3.48056 8.16667 4.17083C8.16667 5.08472 7.82882 6.01806 7.15312 6.97083C6.47743 7.92361 5.45417 8.90556 4.08333 9.91667ZM4.08333 5.25C4.40417 5.25 4.67882 5.13576 4.90729 4.90729C5.13576 4.67882 5.25 4.40417 5.25 4.08333C5.25 3.7625 5.13576 3.48785 4.90729 3.25938C4.67882 3.0309 4.40417 2.91667 4.08333 2.91667C3.7625 2.91667 3.48785 3.0309 3.25938 3.25938C3.0309 3.48785 2.91667 3.7625 2.91667 4.08333C2.91667 4.40417 3.0309 4.67882 3.25938 4.90729C3.48785 5.13576 3.7625 5.25 4.08333 5.25Z"
        fill="#5F5E5B"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path
        d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35ZM10 15.65C11.6 14.2167 12.9167 12.9875 13.95 11.9625C14.9833 10.9375 15.8 10.0458 16.4 9.2875C17 8.52917 17.4167 7.85417 17.65 7.2625C17.8833 6.67083 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.22083 12.325 2.6625C11.6583 3.10417 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10417 7.675 2.6625C7.00833 2.22083 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.67083 2.35 7.2625C2.58333 7.85417 3 8.52917 3.6 9.2875C4.2 10.0458 5.01667 10.9375 6.05 11.9625C7.08333 12.9875 8.4 14.2167 10 15.65Z"
        fill={filled ? "#974135" : "#D6D3D1"}
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="6" height="9" viewBox="0 0 6 9" fill="none">
      <path
        d="M3.45 4.5L0 1.05L1.05 0L5.55 4.5L1.05 9L0 7.95L3.45 4.5Z"
        fill="#4F6144"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 18L4 12L10 6M15 18L9 12L15 6"
        stroke="#1F3A2E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeNavIcon() {
  return (
    <img
      src="https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60"
      alt="Home"
      className="w-7 h-7"
    />
  );
}

function CartNavIcon() {
  return (
    <img
      src="https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60"
      alt="Cart"
      className="w-7 h-7"
    />
  );
}

function HistoryNavIcon() {
  return (
    <img
      src="https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60"
      alt="History"
      className="w-7 h-7"
    />
  );
}

interface BoxCard {
  id: number;
  title: string;
  store: string;
  distance: string;
  category: string;
  price: string;
  originalPrice: string;
  timer: number;
  image: string;
  favorited: boolean;
}

function MysteryBoxCard({ box, onToggleFavorite }: { box: BoxCard; onToggleFavorite: (id: number) => void }) {
    const timeLeft = useCountdown(box.timer);
  return (
    <div className="flex flex-col rounded-xl border border-stone-100 bg-white shadow-md overflow-hidden w-full">
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={box.image}
          alt={box.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#974135] rounded-full px-3 py-1.5 shadow-sm">
          <TimerIcon />
          <span className="text-white font-jakarta text-[15px] leading-none">{timeLeft}</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <span className="font-poppins font-bold text-[11px] text-[#4F6144]">{box.price}</span>
          <span className="font-poppins font-bold text-[7px] text-[#4F6144] line-through">{box.originalPrice}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex justify-between items-start">
          <span className="font-poppins text-[17px] text-[#161D1F]">{box.title}</span>
          <button onClick={() => onToggleFavorite(box.id)} className="flex-shrink-0 mt-0.5">
            <HeartIcon filled={box.favorited} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <StoreIcon />
          <span className="font-jakarta text-[15px] text-[#5F5E5B]">{box.store}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-stone-50">
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span className="font-jakarta text-[15px] text-[#5F5E5B]">{box.distance}</span>
          </div>
          <div className="bg-[#4F6144]/10 rounded-full px-3 py-1">
            <span className="font-jakarta text-[15px] text-[#4F6144]">{box.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MysteryBox() {
  const [activeTab, setActiveTab] = useState<"mystery" | "food">("mystery");
  const [activeFilter, setActiveFilter] = useState<"all" | "vegan" | "halal">("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  function toggleFavorite(id: number) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredBoxes = boxes.filter((box) => {
    if (activeFilter === "vegan") return box.category === "Vegan";
    if (activeFilter === "halal") return box.category === "Halal";
    return true;
  });

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-sm min-h-screen flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <Link to = "/home" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-sm">
            <BackIcon />
          </Link>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110"
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <button
            onClick={() => setActiveTab("mystery")}
            className={`flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold font-poppins shadow transition-colors ${
              activeTab === "mystery"
                ? "bg-[#4F6144] text-white"
                : "bg-white text-black"
            }`}
          >
            Mystery Boxes
          </button>
          <Link to = "/food"
            onClick={() => setActiveTab("food")}
            className={`flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold font-poppins shadow transition-colors ${
              activeTab === "food"
                ? "bg-[#4F6144] text-white"
                : "bg-white text-black"
            }`}
          >
            Food Pages
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-poppins shadow transition-colors ${
              activeFilter === "all"
                ? "bg-[#4F6144] text-white"
                : "bg-white text-black"
            }`}
          >
            All Boxes
          </button>
          <button
            onClick={() => setActiveFilter("vegan")}
            className={`flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-poppins shadow transition-colors ${
              activeFilter === "vegan"
                ? "bg-[#4F6144] text-white"
                : "bg-white text-black"
            }`}
          >
            Vegan
          </button>
          <button
            onClick={() => setActiveFilter("halal")}
            className={`flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-poppins shadow transition-colors ${
              activeFilter === "halal"
                ? "bg-[#4F6144] text-white"
                : "bg-white text-black"
            }`}
          >
            Halal
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
          {/* Section header */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="font-poppins font-bold text-[15px] text-[#161D1F]">Flash Rescues Near You</p>
              <p className="font-poppins text-[15px] text-[#5F5E5B]">Available for a limited time only</p>
            </div>
            <button className="flex items-center gap-1">
              <span className="font-poppins text-[15px] text-[#4F6144]">View all</span>
              <ChevronRightIcon />
            </button>
          </div>

          {/* Cards list */}
          <div className="flex flex-col gap-4">
            {filteredBoxes.map((box) => (
              <MysteryBoxCard
                key={box.id}
                box={{ ...box, favorited: favoriteIds.has(box.id) }}
                onToggleFavorite={toggleFavorite}
              />
            ))}
            {filteredBoxes.length === 0 && (
              <div className="text-center py-12">
                <p className="font-poppins text-[#4F6144] text-base">No boxes available for this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom navigation */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-14 flex items-center justify-around px-6"
          style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}
        >
          <Link to = "/home" className="flex flex-col items-center gap-0.5">
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
