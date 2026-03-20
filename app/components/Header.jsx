"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart } from "../lib/store";

/* ══════════════════════════════════════
   STICKY NAVBAR
   ══════════════════════════════════════ */

function Navbar({ onMenuOpen, isTransparent = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h);
    
    // Initial cart count
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    
    // Sync cart count
    const handleCartSync = () => {
      setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    };
    window.addEventListener('storage', handleCartSync);
    // Custom event for cart updates in the same tab
    window.addEventListener('cartUpdated', handleCartSync);
    
    return () => {
      window.removeEventListener("scroll", h);
      window.removeEventListener('storage', handleCartSync);
      window.removeEventListener('cartUpdated', handleCartSync);
    };
  }, []);

  const isOpaque = !isTransparent || scrolled;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isOpaque
          ? "bg-[#050505]/95 backdrop-blur-2xl border-b border-white/[0.04] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Left: Menu Toggle */}
        <button 
          onClick={onMenuOpen}
          className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/50 hover:text-[#D4AF37] transition-all duration-500 flex items-center gap-3 group"
        >
          <div className="flex flex-col gap-1 w-5">
            <div className="h-[1px] w-full bg-current transition-all group-hover:w-full" />
            <div className="h-[1px] w-8/12 bg-current transition-all group-hover:w-full" />
          </div>
          <span className="hidden sm:inline">Menu</span>
        </button>
        
        {/* Center: Logo (Absolute on desktop) */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-500 md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          <img
            src="/BTB-Round-Icon-R-1.jpg"
            alt="BTB"
            className={`rounded-full transition-all duration-500 ${isOpaque ? 'w-8 h-8' : 'w-10 h-10'}`}
          />
          <span className="text-[13px] md:text-[15px] tracking-[0.35em] uppercase font-light text-white/90 hidden sm:inline">
            Beyond The Body
          </span>
        </Link>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-8">
           <Link
             href="/shop"
             className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/80 border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-[#050505] transition-all duration-500 hidden xs:inline-block"
           >
             Shop Now
           </Link>
           
           <Link href="/cart" className="relative group p-1">
             <svg className="w-5 h-5 text-white/60 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                 {cartCount}
               </span>
             )}
           </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════
   SIDEBAR MENU OVERLAY
   ══════════════════════════════════════ */

function MenuOverlay({ isOpen, onClose }) {
  const categories = [
    { name: "Fragrances", href: "/shop" },
    { name: "The Collections", href: "/shop" },
    { name: "The Brand", href: "/about" },
    { name: "Friends & Partners", href: "/about" },
    { name: "Our Universe", href: "/about" },
  ];

  const utilities = [
    { name: "Sign In", href: "/admin" },
    { name: "Contact", href: "/contact" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Track Orders", href: "/orders" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full md:w-[480px] bg-[#0A0A0A] z-[70] shadow-2xl border-r border-white/[0.05] p-8 md:p-12 flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-12 space-y-8 flex-1 overflow-y-auto pr-4 scrollbar-hide">
              <nav className="space-y-4">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + i * 0.05 }}
                  >
                    <Link 
                      href={cat.href}
                      onClick={onClose}
                      className="text-2xl md:text-3xl font-light tracking-wide hover:text-[#D4AF37] transition-all duration-300 block py-1"
                    >
                      {cat.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-8 border-t border-white/[0.05] space-y-4">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4">Account & Support</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                  {utilities.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 + i * 0.05 }}
                    >
                      <Link 
                        href={item.href}
                        onClick={onClose}
                        className="text-[12px] tracking-[0.15em] uppercase text-white/50 hover:text-[#D4AF37] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-12 mt-auto border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇮🇳</span>
                <span className="text-[11px] tracking-[0.2em] uppercase text-white/40">IN / English</span>
              </div>
              <img src="/BTB-Round-Icon-R-1.jpg" alt="BTB" className="w-8 h-8 opacity-20" />
            </div>

            <p className="mt-8 text-[9px] tracking-[0.3em] uppercase text-white/10 text-center">
              Beyond The Body © 2026 — Private Collection
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════
   MAIN HEADER COMPONENT
   ══════════════════════════════════════ */

export default function Header({ isTransparent = true }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar onMenuOpen={() => setIsOpen(true)} isTransparent={isTransparent} />
      <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
