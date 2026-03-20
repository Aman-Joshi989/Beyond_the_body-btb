"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getCategories, initStore } from "../lib/store";

import Header from "../components/Header";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    initStore();
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  let filtered = activeCat === "all" ? products : products.filter((p) => p.categoryId === activeCat);
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header isTransparent={false} />

      <div className="pt-28 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-4">Our Collection</span>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.1]">
            Signature
            <span className="italic font-light"> Fragrances</span>
          </h1>
          <p className="text-white/30 mt-4 max-w-md mx-auto font-light">
            Browse our curated collection of luxury perfumes. Each scent tells a unique story.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button onClick={() => setActiveCat("all")}
              className={`px-5 py-2 rounded-full text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-all ${
                activeCat === "all" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "glass text-white/40"
              }`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`px-5 py-2 rounded-full text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-all ${
                  activeCat === c.id ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "glass text-white/40"
                }`}>
                {c.name}
              </button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 text-xs text-white/50 outline-none cursor-pointer w-auto">
            <option value="default" className="bg-[#0a0a0a]">Default</option>
            <option value="low" className="bg-[#0a0a0a]">Price: Low → High</option>
            <option value="high" className="bg-[#0a0a0a]">Price: High → Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link href={`/product/${p.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#0a0a0a] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-700">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 glass text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-full text-white/50">
                    {catMap[p.categoryId] || "—"}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base md:text-lg text-white/90">{p.name}</h3>
                    <p className="text-[#D4AF37] text-sm font-light">₹{p.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-20 text-white/20 text-sm">No products in this category yet</p>
        )}
      </div>
    </div>
  );
}
