"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProducts, getCategories, initStore } from "./lib/store";

/* ══════════════════════════════════════
   ANIMATION VARIANTS
   ══════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ══════════════════════════════════════
   STICKY NAVBAR
   ══════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-2xl border-b border-white/[0.04] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12">
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-white/30 hover:text-[#D4AF37] transition-colors duration-500 hidden md:block w-20">
          Admin
        </Link>
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-500">
          <img
            src="/BTB-Round-Icon-R-1.jpg"
            alt="BTB"
            className={`rounded-full transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
          />
          <span className="text-[13px] md:text-[15px] tracking-[0.35em] uppercase font-light text-white/90 hidden md:inline">
            Beyond The Body
          </span>
        </Link>
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-[#D4AF37] transition-colors duration-500 hidden md:block"
        >
          Shop →
        </Link>
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════
   STATIC DATA (gallery)
   ══════════════════════════════════════ */

const galleryImages = [
  'Bottle-Labels-1.jpg', 'Bottle-Labels-2.jpg', 'Bottle-Labels-3.jpg',
  'Bottle-Labels-4.jpg', 'Bottle-Labels-5.jpg', 'BTB-Logo-+-Icon-R-1.jpg',
  'BTB-Logo-+-Icon-TM-1.jpg', 'BTB-Logo-+-Icon-1.jpg', 'BTB-Packaging-Design-1.jpg',
  'BTB-Round-Icon-R-1.jpg', 'BTB-Round-Icon-T-1.jpg', 'BTB-Round-Icon-1.jpg',
  'BTB-Side-A-1.jpg', 'BTB-Side-B-1.jpg', 'card-in-place-1.jpg',
];

/* ══════════════════════════════════════
   PARALLAX IMAGE COMPONENT
   ══════════════════════════════════════ */

function ParallaxImage({ src, alt, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-[120%] object-cover absolute top-[-10%] left-0"
      />
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════ */

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    initStore();
    setProducts(getProducts().slice(0, 5));
    setCategories(getCategories());
  }, []);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 1.1]);
  const heroTextY = useTransform(heroScroll, [0, 0.5], [0, 100]);

  return (
    <main className="bg-[#050505] text-white overflow-x-hidden glow-frame">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
          ═══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[110vh] flex items-center justify-center overflow-hidden">
        {/* Parallax BG Image */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img
            src="/img-4.jpg"
            alt="Beyond The Body"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/20 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-[#050505]/40" />
        </motion.div>

        {/* Hero Content */}
        <motion.div className="relative z-10 text-center px-6 max-w-4xl" style={{ opacity: heroOpacity, y: heroTextY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <img
              src="/BTB-Logo-+-Icon-R-1.jpg"
              alt="Beyond The Body"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl mx-auto mb-4 shadow-2xl shadow-[#D4AF37]/10"
            />
            <span className="text-[11px] md:text-[13px] tracking-[0.5em] uppercase text-[#D4AF37]/80 font-light">
              ✦ Luxury Fragrances ✦
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] mb-2"
            >
              You don&apos;t wear
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] italic font-light"
            >
              a fragrance.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-8 text-[clamp(1rem,2vw,1.25rem)] text-white/60 tracking-wide font-light"
          >
            You become it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <Link
              href="/product"
              className="inline-flex items-center gap-3 mt-12 glass-white px-10 py-4 rounded-full text-[13px] tracking-[0.2em] uppercase font-medium hover:scale-105 transition-transform duration-500"
            >
              Explore Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — EDITORIAL QUOTE (Rotoris-style)
          ═══════════════════════════════════════════════ */}
      <section className="py-32 md:py-44 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            variants={fadeIn}
            custom={0}
            className="editorial-quote text-[clamp(1.5rem,4vw,3rem)] text-white/80 leading-[1.5]"
          >
            &ldquo;What you carry on your skin
            <br className="hidden md:block" />
            should speak{" "}
            <span className="text-gradient-gold not-italic font-medium">louder</span>
            <br className="hidden md:block" />
            than the words you choose.&rdquo;
          </motion.p>
          <motion.div variants={fadeIn} custom={1} className="mt-10">
            <div className="section-divider max-w-[120px] mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — BRAND STORY
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-28 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-5">
              The Philosophy
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] mb-8">
              Crafted beyond
              <br />
              <span className="italic font-light text-white/70">the body.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg leading-[1.8] max-w-lg font-light">
              This is not just fragrance. This is identity, presence, emotion.
              Each bottle holds a story waiting to unfold — a memory that
              lingers long after you&apos;ve left the room.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 section-divider max-w-[80px]" />
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative group"
          >
            <ParallaxImage
              src="/lifestyle-philosophy.png"
              alt="Man applying luxury fragrance"
              className="rounded-3xl h-[600px] md:h-[700px]"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — SIGNATURE COLLECTION (Premium Redesign)
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
          >
            <div>
              <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-4">
                The Collection
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4vw,3.5rem)]">
                Signature{" "}
                <span className="italic font-light text-white/60">Collection</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/30 text-sm mt-3 max-w-md font-light">
                Five distinct personalities. One unmistakable identity.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 glass px-8 py-3 rounded-full text-[12px] tracking-[0.2em] uppercase text-[#D4AF37]/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all duration-500 group"
              >
                View all
                <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Card — First Product */}
          {products[0] && (
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <Link href={`/product/${products[0].id}`} className="group block relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/[0.04] hover:border-[#D4AF37]/20 transition-all duration-700">
                <div className="grid md:grid-cols-2 items-center">
                  {/* Image Side */}
                  <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:h-[520px]">
                    <img
                      src={products[0].img}
                      alt={products[0].name}
                      className="w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:hidden" />
                    {/* Glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-[#D4AF37]/5 via-transparent to-transparent" />
                  </div>

                  {/* Info Side */}
                  <div className="p-8 md:p-14">
                    <span className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50 block mb-4">
                      {catMap[products[0].categoryId] || "Signature"} · Eau de Parfum
                    </span>
                    <h3 className="text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] mb-4 group-hover:text-[#D4AF37]/90 transition-colors duration-500">
                      {products[0].name}
                    </h3>
                    <p className="text-white/30 text-sm leading-[1.8] mb-8 font-light max-w-sm">
                      {products[0].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(products[0].notes || "").split(" · ").map((n) => (
                        <span key={n} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border border-white/[0.06] text-white/40">
                          {n}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] text-2xl font-light">₹{products[0].price.toLocaleString()}</span>
                      <span className="text-[11px] tracking-[0.2em] uppercase text-white/30 group-hover:text-[#D4AF37]/70 transition-colors duration-500 flex items-center gap-2">
                        Explore
                        <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Product Grid — Remaining 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {products.slice(1, 5).map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link href={`/product/${p.id}`} className="group block relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border border-white/[0.04] hover:border-[#D4AF37]/20 transition-all duration-700">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

                    {/* Tag */}
                    <span className="absolute top-4 left-4 glass text-[9px] tracking-[0.25em] uppercase px-3 py-1 rounded-full text-white/50">
                      {catMap[p.categoryId] || "Signature"}
                    </span>

                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-[#D4AF37]/8 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-base md:text-lg mb-1 group-hover:text-[#D4AF37]/90 transition-colors duration-500">{p.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#D4AF37]/80 text-sm font-light">₹{p.price.toLocaleString()}</span>
                      <span className="text-white/20 text-[10px] tracking-wider uppercase">{p.volume || "100ml"}</span>
                    </div>
                    {/* Longevity bar */}
                    <div className="w-full bg-white/[0.04] h-[3px] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-100 opacity-60"
                        style={{
                          width: `${p.longevity || 80}%`,
                          background: "linear-gradient(90deg, #D4AF37, #f5e6a3)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[8px] tracking-[0.2em] uppercase text-white/20">Longevity</span>
                      <span className="text-[8px] text-white/20">{Math.round((p.longevity || 80) * 0.12)}h</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — FULL BLEED PARALLAX IMAGE
          ═══════════════════════════════════════════════ */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden my-12">
        <ParallaxImage
          src="/lifestyle-parallax.png"
          alt="Spraying luxury fragrance"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-[#050505]/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] mb-6"
            >
              Not opened.
              <br />
              <span className="italic font-light">Revealed.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-white/50 text-lg md:text-xl max-w-lg mx-auto font-light"
            >
              Every box is an experience. Every detail speaks luxury.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — PERSONALITY SELECTOR (Premium Redesign)
          ═══════════════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-5">
              Find Your Identity
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,5vw,4rem)] mb-4">
              Who are you{" "}
              <span className="italic font-light text-white/60">today?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/30 text-sm max-w-md mx-auto font-light">
              Every fragrance tells a story. Choose yours.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
              { type: "Bold", desc: "Command every room", product: "Don Amour", img: "/bottle-don-amour.png", link: "/product/p3", accent: "#C9A227" },
              { type: "Romantic", desc: "Whispers of devotion", product: "Mon Amour", img: "/img-10.jpg", link: "/product/p4", accent: "#E8B4B8" },
              { type: "Mysterious", desc: "Dark & unforgettable", product: "Desir", img: "/bottle-desir.png", link: "/product/p5", accent: "#8B7355" },
              { type: "Refined", desc: "Effortless elegance", product: "Suave", img: "/bottle-suave.png", link: "/product/p1", accent: "#D4AF37" },
              { type: "Passionate", desc: "Irresistibly magnetic", product: "Heartthrob", img: "/bottle-heartthrob.png", link: "/product/p2", accent: "#C41E3A" },
            ].map((item, i) => (
              <motion.div
                key={item.type}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={i === 0 ? "col-span-2 md:col-span-2 row-span-1" : "col-span-1"}
              >
                <Link
                  href={item.link}
                  className="group relative block overflow-hidden rounded-2xl border border-white/[0.04] hover:border-[#D4AF37]/30 transition-all duration-700"
                  style={{ aspectRatio: i === 0 ? "2/1.4" : "3/4" }}
                >
                  {/* BG Image */}
                  <img
                    src={item.img}
                    alt={item.type}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent" />

                  {/* Corner accents on hover */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37]/60 mb-1.5">
                      {item.desc}
                    </span>
                    <h3 className="text-lg md:text-2xl mb-1 group-hover:text-[#D4AF37]/90 transition-colors duration-500">
                      {item.type}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-white/30">
                        → {item.product}
                      </span>
                      <motion.span
                        className="text-[10px] tracking-[0.15em] uppercase text-white/0 group-hover:text-white/40 transition-all duration-500"
                      >
                        Discover ›
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — VISUAL IDENTITY GALLERY (Premium Masonry)
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-4">
                Brand Identity
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4vw,3.5rem)]">
                Visual{" "}
                <span className="italic font-light text-white/60">Identity</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/30 text-sm mt-3 max-w-md font-light">
                A curated gallery of the BTB universe — from concept to creation.
              </motion.p>
            </div>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
            {[
              { src: "/bottle-suave.png", label: "Suave", span: "row-span-2" },
              { src: "/BTB-Packaging-Design-1.jpg", label: "Packaging Design", span: "" },
              { src: "/lifestyle-philosophy.png", label: "The Experience", span: "row-span-2 col-span-2 md:col-span-1" },
              { src: "/img-10.jpg", label: "Mon Amour", span: "" },
              { src: "/BTB-Side-A-1.jpg", label: "Box Detail", span: "" },
              { src: "/bottle-don-amour.png", label: "Don Amour", span: "row-span-2" },
              { src: "/lifestyle-for-him.png", label: "For Him", span: "" },
              { src: "/bottle-heartthrob.png", label: "Heartthrob", span: "row-span-2" },
              { src: "/img-15.jpg", label: "Craftsmanship", span: "" },
              { src: "/lifestyle-cta.png", label: "Atmosphere", span: "col-span-2 md:col-span-1" },
              { src: "/bottle-desir.png", label: "Desir", span: "row-span-2" },
              { src: "/BTB-Logo-+-Icon-R-1.jpg", label: "Beyond The Body", span: "" },
            ].map((item, i) => (
              <motion.div
                key={`gallery-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.6 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.04] hover:border-[#D4AF37]/20 transition-all duration-700 ${item.span}`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 block">
                    {item.label}
                  </span>
                </div>
                {/* Corner accents */}
                <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-700" />
                <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — FOR HIM / FOR HER (Premium)
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span variants={fadeUp} custom={0} className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37]/70 block mb-4">
            Shop by Category
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4vw,3.5rem)]">
            Choose Your{" "}
            <span className="italic font-light text-white/60">World</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {[
            { title: "For Him", subtitle: "Signature Scents", desc: "Bold, woody compositions for the modern man", img: "/lifestyle-for-him.png", link: "/shop", products: "3 Fragrances" },
            { title: "For Her", subtitle: "Enchanted Collection", desc: "Romantic florals and intoxicating orientals", img: "/lifestyle-for-her.png", link: "/shop", products: "2 Fragrances" },
          ].map((cat, i) => (
            <motion.div
              key={cat.title}
              variants={i === 0 ? slideFromLeft : slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                href={cat.link}
                className="relative block h-[350px] md:h-[500px] overflow-hidden rounded-3xl group border border-white/[0.04] hover:border-[#D4AF37]/20 transition-all duration-700"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-transparent" />

                {/* Golden hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-[#D4AF37]/8 via-transparent to-transparent" />

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700" />

                {/* Product count badge */}
                <span className="absolute top-6 right-6 glass text-[9px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full text-white/50">
                  {cat.products}
                </span>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/60 block mb-2">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-[32px] md:text-[44px] leading-[1] mb-3 group-hover:text-[#D4AF37]/90 transition-colors duration-500">
                    {cat.title}
                  </h3>
                  <p className="text-white/30 text-sm font-light mb-4 max-w-xs">
                    {cat.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/40 group-hover:text-[#D4AF37] transition-colors duration-500">
                    Explore Collection
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 9 — CTA (Premium Immersive)
          ═══════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        {/* Background layers */}
        <ParallaxImage src="/img-4.jpg" alt="Luxury perfume collection" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-[#050505]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        {/* Decorative side elements */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 hidden md:block"
        >
          <img src="/bottle-suave.png" alt="" className="w-28 h-auto opacity-40 blur-[1px]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden md:block"
        >
          <img src="/bottle-don-amour.png" alt="" className="w-28 h-auto opacity-40 blur-[1px]" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          {/* BTB Logo Mark */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <img
              src="/BTB-Round-Icon-R-1.jpg"
              alt="BTB"
              className="w-16 h-16 rounded-full mx-auto shadow-xl shadow-[#D4AF37]/10"
            />
          </motion.div>

          <motion.span variants={fadeUp} custom={1} className="text-[11px] tracking-[0.5em] uppercase text-[#D4AF37]/70 block mb-6">
            Your Journey Begins
          </motion.span>

          <motion.h2 variants={fadeUp} custom={2} className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] mb-6">
            Find Your
            <br />
            <span className="italic font-light text-white/80">Signature Scent</span>
          </motion.h2>

          <motion.p variants={fadeUp} custom={3} className="text-white/30 text-base md:text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed">
            Five distinct fragrances, each crafted to tell a different story.
            Discover the one that speaks to your soul.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="flex flex-col items-center gap-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-14 py-4.5 rounded-full text-[13px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e8c44a] hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500"
            >
              Discover Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Trust bar */}
            <div className="flex items-center gap-6 mt-2">
              {["5 Fragrances", "Handcrafted", "100ml EDP"].map((item, i) => (
                <span key={i} className="text-[9px] tracking-[0.2em] uppercase text-white/20 flex items-center gap-2">
                  {i > 0 && <span className="w-px h-3 bg-white/10" />}
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Decorative divider */}
          <motion.div variants={fadeUp} custom={5} className="mt-16 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
            <span className="text-[#D4AF37]/40 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════ */}
      <footer className="py-20 md:py-28 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 md:gap-16 mb-20">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/BTB-Round-Icon-R-1.jpg"
                  alt="BTB"
                  className="w-12 h-12 rounded-full"
                />
                <h3 className="text-[15px] tracking-[0.3em] uppercase font-light">
                  Beyond The Body
                </h3>
              </div>
              <p className="text-white/30 text-sm leading-[1.8] max-w-sm font-light">
                Luxury fragrances crafted to transcend the ordinary.
                Each scent is a journey — a signature that speaks before you do.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/50 mb-6 font-sans">
                Navigate
              </h4>
              <ul className="space-y-4">
                {["Collection", "Our Story", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/30 text-sm hover:text-white/70 transition-colors duration-500 font-light">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/50 mb-6 font-sans">
                Connect
              </h4>
              <ul className="space-y-4">
                {["Instagram", "Facebook", "Twitter"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/30 text-sm hover:text-white/70 transition-colors duration-500 font-light">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="section-divider mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-[11px] tracking-[0.2em] uppercase">
              © 2026 Beyond The Body
            </p>
            <p className="text-white/20 text-[11px] tracking-[0.2em] uppercase font-light italic">
              Crafted with intention
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
