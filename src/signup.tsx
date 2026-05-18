import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #DAE6D8 0%, #92AF8C 100%)" }}>
      <div className="w-full max-w-sm mx-auto px-6 py-12 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[#748B6F] font-poppins font-bold text-3xl sm:text-4xl leading-tight mb-2">
            Get Started Now
          </h1>
          <p className="text-[#748B6F] font-poppins text-xs font-normal">
            Create an account or Log in to explore!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full bg-white rounded-full shadow-md p-1 flex mb-8" style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 rounded-full font-poppins font-bold text-xl transition-all duration-200 ${
              activeTab === "signup"
                ? "bg-[#324D3E] text-[#DAE6D8] shadow-md"
                : "bg-transparent text-[#DAE6D8]"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 rounded-full font-poppins font-bold text-xl transition-all duration-200 ${
              activeTab === "signin"
                ? "bg-[#324D3E] text-[#DAE6D8] shadow-md"
                : "bg-transparent text-[#DAE6D8]"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {activeTab === "signup" && (
            <>
              {/* First & Last Name */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                    style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                    style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40 placeholder:text-[#748B6F]/25 placeholder:underline"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Birth of Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Birth of Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Set Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Set Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="px-8 py-2 rounded-full bg-[#324D3E] text-[#DAE6D8] font-poppins font-bold text-sm hover:bg-[#243829] transition-colors"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {activeTab === "signin" && (
            <>
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40 placeholder:text-[#748B6F]/25 placeholder:underline"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#748B6F] font-poppins font-bold text-sm pl-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-[41px] rounded-full bg-white px-4 text-[#748B6F] font-poppins text-sm outline-none focus:ring-2 focus:ring-[#748B6F]/40"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="px-8 py-2 rounded-full bg-[#324D3E] text-[#DAE6D8] font-poppins font-bold text-sm hover:bg-[#243829] transition-colors"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                >
                  Sign In
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
