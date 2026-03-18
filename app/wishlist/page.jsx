"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] mb-6 block">Private Selection</span>
        <h1 className="text-5xl md:text-7xl font-light mb-12 tracking-tight">Your <span className="italic">Wishlist</span></h1>
        <p className="text-white/40 mb-12">Your personal collection of future essences is currently empty.</p>
        <Link href="/shop" className="text-sm tracking-[0.2em] uppercase bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-[#D4AF37] transition-all">
          Explore Collection
        </Link>
      </motion.div>
    </div>
  );
}
