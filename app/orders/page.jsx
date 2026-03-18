"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Orders() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] mb-6 block">Journey Tracking</span>
        <h1 className="text-5xl md:text-7xl font-light mb-12 tracking-tight">Track Your <span className="italic">Order</span></h1>
        <div className="bg-white/[0.03] border border-white/[0.07] p-10 rounded-3xl mb-12">
            <p className="text-white/20 text-sm tracking-widest mb-6 uppercase">Enter Order ID</p>
            <input 
                type="text" 
                placeholder="BTB-XXXX" 
                className="bg-transparent border-b border-white/20 w-full text-center py-4 outline-none focus:border-[#D4AF37] transition-colors text-2xl font-light"
            />
        </div>
        <Link href="/" className="text-sm tracking-[0.2em] uppercase text-white/40 hover:text-white transition-all">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
