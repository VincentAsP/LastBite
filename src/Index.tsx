import { useState } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-[402px] flex flex-col items-center">

        {/* Logo / Illustration */}
        <div className="mt-8 mb-6">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/50cba1698601e650ab853fd68a32e371ac49f6cf?width=298"
            alt="App logo"
            className="w-36 h-36 object-contain"
          />
        </div>

        {/* Sign In heading */}
        <h1 className="text-3xl font-bold text-center mb-1" style={{ color: "#748B6F", fontFamily: "Poppins, sans-serif" }}>
          Sign In
        </h1>

        {/* Subtitle */}
        <p className="text-center text-xs mb-8" style={{ color: "#748B6F", fontFamily: "Poppins, sans-serif" }}>
          Access your account to manage settings,<br />explore features.
        </p>

        {/* Email Field */}
        <div className="w-full mb-3">
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: "#748B6F", fontFamily: "Poppins, sans-serif" }}>
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full h-[41px] rounded-full bg-white px-5 text-xs outline-none placeholder:underline"
              style={{
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                color: "#748B6F",
                fontFamily: "Poppins, sans-serif",
                opacity: 1,
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="w-full mb-4">
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: "#748B6F", fontFamily: "Poppins, sans-serif" }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password here"
              className="w-full h-[41px] rounded-full bg-white px-5 pr-12 text-xs outline-none"
              style={{
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                color: "#748B6F",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/6742a492da3c43f461eb0abd6cba80c702424ca7?width=38"
                alt="Show/Hide password"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* Remember me + Forgot Password */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2"
          >
            <span
              className="w-[11px] h-[11px] rounded-full border border-white flex items-center justify-center flex-shrink-0"
              style={{ background: rememberMe ? "#324D3E" : "transparent" }}
            >
              {rememberMe && (
                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
              )}
            </span>
            <span className="text-[8px] font-bold" style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}>
              Remember me
            </span>
          </button>
          <Link
            to="#"
            className="text-[8px] font-bold"
            style={{ color: "#324D3E", fontFamily: "Poppins, sans-serif" }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Get Started Button */}
        <Link
          to = "/home"
          className="flex items-center justify-center h-[32px] px-8 rounded-full text-white text-sm font-bold mb-6"
          style={{
            background: "#324D3E",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Get Started
        </Link>

        {/* Or Divider */}
        <div className="w-full flex items-center gap-4 mb-4">
          <div className="flex-1 h-px" style={{ background: "#748B6F" }} />
          <span className="text-base font-bold" style={{ color: "#748B6F", fontFamily: "Poppins, sans-serif" }}>
            Or
          </span>
          <div className="flex-1 h-px" style={{ background: "#748B6F" }} />
        </div>

        {/* Sign in with Google */}
        <button
          type="button"
          className="w-[264px] h-[32px] flex items-center gap-2.5 rounded-full text-white text-sm font-bold mb-3 pl-8"
          style={{
            background: "#324D3E",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/b6cb7577f1c8f68d1ef4f2ef00e93db6e2b57ec0?width=52"
            alt="Google"
            className="w-[26px] h-5 flex-shrink-0"
          />
          <span>Sign in with Google</span>
        </button>

        {/* Continue with Apple */}
        <button
          type="button"
          className="w-[264px] h-[32px] flex items-center gap-2.5 rounded-full text-white text-sm font-bold mb-8 pl-8"
          style={{
            background: "#324D3E",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/6cd8755c6183ef0d50111cbac2642571c67e903c?width=52"
            alt="Apple"
            className="w-[26px] h-[25px] flex-shrink-0"
          />
          <span>Continue with Apple</span>
        </button>

        {/* Sign up link */}
        <p className="text-sm mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="text-white font-normal">Don't have an account? </span>
          <Link to="/signup" className="font-bold" style={{ color: "#748B6F" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
