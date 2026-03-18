"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="/lifestyle-philosophy.png" 
            alt="" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]" />
        
        {/* Animated Particles/Dust */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: Math.random() * 100 + "%" }}
            animate={{ 
              opacity: [0, 0.2, 0], 
              y: -200,
              x: (Math.random() * 100 - 10) + "%" 
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white/40 blur-[1px] rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <img 
              src="/BTB-Round-Icon-R-1.jpg" 
              alt="BTB" 
              className="w-16 h-16 rounded-full shadow-2xl shadow-[#D4AF37]/20 border border-white/[0.08]"
            />
          </motion.div>
          
          <h1 className="text-[16px] tracking-[0.4em] uppercase font-light text-white/90 mb-1">
            Beyond The Body
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
             <p className="text-[#D4AF37]/60 text-[10px] tracking-[0.3em] uppercase font-medium">Portal Access</p>
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
          </div>
        </div>

        <div className="relative group">
          {/* Decorative glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
          
          <form onSubmit={handleSubmit} className="relative glass rounded-[2.5rem] p-10 md:p-12 space-y-7 border border-white/[0.06]">
            <div className="absolute top-6 right-8">
              <span className="text-[8px] tracking-[0.2em] uppercase text-white/20 border border-white/10 px-3 py-1 rounded-full">Secure</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-white/30 block ml-1 font-sans">
                Identity
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all duration-500 placeholder:text-white/10 hover:bg-white/[0.05]"
                placeholder="Username"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-white/30 block ml-1 font-sans">
                Passphrase
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all duration-500 placeholder:text-white/10 hover:bg-white/[0.05]"
                placeholder="••••••••"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-[11px] text-center font-medium tracking-wide bg-red-400/10 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#050505] py-4 rounded-2xl text-[12px] tracking-[0.25em] uppercase font-bold hover:bg-[#e8c44a] hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/10 transition-all duration-500 group"
            >
              Authenticate
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/" 
            className="text-white/20 hover:text-[#D4AF37]/60 text-[10px] tracking-[0.25em] uppercase transition-colors duration-500 flex items-center justify-center gap-2 group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back to store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
