"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductById, getCategories, initStore } from "../../lib/store";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
};

/* ═══════════════════════════════════
   IMAGE GALLERY — main + thumbnails
   ═══════════════════════════════════ */
function ProductGallery({ images, alt, catName }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const allImages = images && images.length > 0 ? images : ["/img-1.jpg"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Main Image */}
      <div className="relative rounded-3xl overflow-hidden group">
        <div className="relative h-[450px] md:h-[650px] overflow-hidden bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={allImages[activeIdx]}
              alt={`${alt} view ${activeIdx + 1}`}
              style={{ y }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-[120%] absolute top-[-10%] left-0 object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
        <span className="absolute top-6 left-6 glass text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full text-white/60">
          {catName}
        </span>

        {/* Image counter */}
        <div className="absolute bottom-6 right-6 glass text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full text-white/40">
          {activeIdx + 1} / {allImages.length}
        </div>

        {/* Prev/Next arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {allImages.map((src, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIdx(i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500 ${
                activeIdx === i
                  ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#050505] scale-[1.02]"
                  : "ring-1 ring-white/[0.06] opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                className="w-16 h-16 md:w-20 md:h-20 object-cover"
              />
              {activeIdx === i && (
                <motion.div
                  layoutId="thumb-active"
                  className="absolute inset-0 ring-2 ring-[#D4AF37] rounded-xl pointer-events-none"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════
   PRODUCT PAGE
   ═══════════════════════════════════ */
export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    initStore();
    const p = getProductById(params.id);
    if (p) {
      setProduct(p);
      const cats = getCategories();
      const cat = cats.find((c) => c.id === p.categoryId);
      setCatName(cat?.name || "");
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-lg mb-4">Product not found</p>
          <Link href="/shop" className="text-[#D4AF37] text-sm hover:underline">← Back to shop</Link>
        </div>
      </div>
    );
  }

  const notes = [
    { note: product.topNote || "Fresh", desc: "Top Note", icon: "🍋" },
    { note: product.heartNote || "Floral", desc: "Heart Note", icon: "🌸" },
    { note: product.baseNote || "Woody", desc: "Base Note", icon: "🪵" },
  ];

  const features = [
    { label: "Volume", value: product.volume || "100ml" },
    { label: "Type", value: "Eau de Parfum" },
    { label: "Longevity", value: `${Math.round(product.longevity * 0.12)} hrs` },
    { label: "Sillage", value: product.sillage >= 80 ? "Strong" : product.sillage >= 50 ? "Moderate" : "Light" },
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden glow-frame">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <Link href="/shop" className="text-white/40 hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Shop
          </Link>
          <span className="text-[13px] tracking-[0.35em] uppercase font-light text-white/90">Beyond The Body</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Image Gallery */}
          <ProductGallery
            images={product.images || [product.img]}
            alt={product.name}
            catName={catName}
          />

          {/* Details */}
          <motion.div initial="hidden" animate="visible" className="md:pt-4 md:sticky md:top-28">
            <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-4">
              {catName}
            </motion.span>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(3rem,6vw,5rem)] leading-[1] mb-4">
                {product.name}
              </motion.h1>
            </div>
            <motion.p variants={fadeUp} custom={1} className="text-[#D4AF37] text-2xl md:text-3xl font-light mb-8">
              ₹{product.price.toLocaleString()}
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="section-divider max-w-[60px] mb-8" />
            <motion.p variants={fadeUp} custom={3} className="text-white/35 text-base leading-[1.9] mb-10 max-w-md font-light">
              {product.description}
            </motion.p>

            <motion.div variants={fadeUp} custom={4}>
              <button className="w-full md:w-auto bg-[#D4AF37] text-[#050505] px-14 py-4 rounded-full text-[13px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e8c44a] hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 animate-pulse-glow">
                Add to Cart
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>

            {/* Fragrance Journey */}
            <motion.div variants={fadeUp} custom={5} className="mt-16">
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50 mb-8 font-sans">Fragrance Journey</h3>
              <div className="grid grid-cols-3 gap-3">
                {notes.map((item, i) => (
                  <motion.div key={item.note} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="glass rounded-2xl p-5 text-center group hover:border-[#D4AF37]/20 transition-all duration-500">
                    <span className="text-2xl block mb-3">{item.icon}</span>
                    <p className="text-white/80 text-sm mb-1 font-medium">{item.note}</p>
                    <p className="text-white/25 text-[10px] tracking-[0.2em] uppercase">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Specs */}
            <motion.div variants={fadeUp} custom={6} className="mt-12">
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50 mb-6 font-sans">Specifications</h3>
              {features.map((f, i) => (
                <motion.div key={f.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                  <span className="text-white/30 text-sm font-light">{f.label}</span>
                  <span className="text-white/70 text-sm">{f.value}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Bars */}
            <motion.div variants={fadeUp} custom={7} className="mt-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50 font-sans">Longevity</span>
                <span className="text-white/30 text-xs">{Math.round(product.longevity * 0.12)} hours</span>
              </div>
              <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${product.longevity}%` }}
                  transition={{ duration: 2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #D4AF37, #f5e6a3)" }} />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={8} className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50 font-sans">Sillage</span>
                <span className="text-white/30 text-xs">{product.sillage >= 80 ? "Strong" : product.sillage >= 50 ? "Moderate" : "Light"}</span>
              </div>
              <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${product.sillage}%` }}
                  transition={{ duration: 2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #D4AF37, #f5e6a3)" }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
