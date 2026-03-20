"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, removeFromCart, updateCartQuantity, clearCart, initStore } from "../lib/store";
import Header from "../components/Header";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    initStore();
    setItems(getCart());
  }, []);

  const refresh = () => setItems(getCart());

  const handleRemove = (id) => {
    removeFromCart(id);
    window.dispatchEvent(new Event('cartUpdated'));
    refresh();
  };

  const handleQty = (id, q) => {
    updateCartQuantity(id, q);
    window.dispatchEvent(new Event('cartUpdated'));
    refresh();
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 2500);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 glow-frame">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20">
            <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-light mb-4">Order Authorized</h1>
          <p className="text-white/40 font-light mb-10 leading-relaxed">
            Your selection is being prepared by our master perfumers. A confirmation of prestige has been sent to your digital residence.
          </p>
          <Link href="/shop" className="inline-block bg-[#D4AF37] text-black px-12 py-4 rounded-full text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#e8c44a] transition-all">
            Return to Atelier
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37]/30 glow-frame">
      <Header isTransparent={false} />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40"
          >
            <p className="text-white/20 text-lg mb-8 font-light italic">Your selection is currently empty</p>
            <Link href="/shop" className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase hover:underline">
              Begin your journey
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-10">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-8 group relative"
                  >
                    <div className="w-28 h-36 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex-shrink-0 group-hover:border-[#D4AF37]/30 transition-all duration-700">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain p-4 filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-light tracking-tight">{item.name}</h3>
                        <p className="text-[#D4AF37] font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-white/30 text-xs tracking-widest uppercase mb-6">{item.volume || "100ml"}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center glass rounded-full px-2 py-1 border border-white/5">
                          <button onClick={() => handleQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors">
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => handleQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors">
                            +
                          </button>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors">
                          Retract
                        </button>
                      </div>
                    </div>
                    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl sticky top-32"
            >
              <h2 className="text-[11px] tracking-[0.4em] uppercase text-white/30 mb-8 font-semibold">Prestige Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 font-light">Boutique Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 font-light">White Glove Delivery</span>
                  <span className="text-green-400">Complimentary</span>
                </div>
                <div className="h-px bg-white/5 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37]">Exclusivity Total</span>
                  <span className="text-2xl font-light">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-5 rounded-full text-[11px] tracking-[0.3em] uppercase font-bold transition-all duration-500 overflow-hidden relative shadow-2xl ${
                  isCheckingOut ? "bg-white/5 text-white/20" : "bg-white text-black hover:bg-[#D4AF37] hover:scale-[1.02]"
                }`}
              >
                {isCheckingOut ? (
                  <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                ) : null}
                {isCheckingOut ? "Authorizing Security..." : "Secure Order Acquisition"}
              </button>
              
              <p className="text-[9px] text-center text-white/20 uppercase tracking-[0.15em] mt-6 leading-relaxed">
                Trusted by collectors globally. All transactions are encrypted by Atelier Security.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
