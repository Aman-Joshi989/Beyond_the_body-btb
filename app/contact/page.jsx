"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] mb-6 block">Concierge</span>
        <h1 className="text-5xl md:text-7xl font-light mb-12 tracking-tight">How may we <span className="italic">assist you?</span></h1>
        <div className="space-y-6 mb-12">
            <p className="text-white/40 tracking-wider">boutique@beyondthebody.luxury</p>
            <p className="text-white/40 tracking-wider">+91 98765 43210</p>
        </div>
        <Link href="/" className="text-sm tracking-[0.2em] uppercase border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
          Return to Essence
        </Link>
      </motion.div>
    </div>
  );
}
