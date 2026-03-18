"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { login, isLoggedIn, initStore } from "../lib/store";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore();
    if (isLoggedIn()) router.replace("/admin/dashboard");
    else setLoading(false);
  }, [router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (login(username, password)) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  if (loading) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-[15px] tracking-[0.35em] uppercase font-light text-white/90 mb-2">
            Beyond The Body
          </h1>
          <p className="text-white/30 text-sm tracking-wide">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-10 space-y-6">
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/50 block mb-2 font-sans">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors duration-300 placeholder:text-white/20"
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/50 block mb-2 font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors duration-300 placeholder:text-white/20"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-[#050505] py-3.5 rounded-xl text-[13px] tracking-[0.15em] uppercase font-semibold hover:bg-[#e8c44a] transition-colors duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-white/15 text-xs tracking-wider">
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  );
}
