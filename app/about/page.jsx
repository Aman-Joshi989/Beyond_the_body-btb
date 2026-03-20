"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import Header from "../components/Header";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24 text-center">
      <Header isTransparent={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] mb-6 block">Our Story</span>
        <h1 className="text-5xl md:text-7xl font-light mb-12 tracking-tight">The Heritage of <span className="italic">Beyond The Body</span></h1>
        <p className="text-white/40 leading-relaxed text-lg font-light mb-12">
          Founded on the principle that fragrance is the ultimate expression of the soul, 
          Beyond The Body curates experiences that transcend the physical realm. 
          Each scent is a chapter, each note a memory.
        </p>
        <Link href="/" className="text-sm tracking-[0.2em] uppercase border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
