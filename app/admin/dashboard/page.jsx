"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getStats, getOrders, initStore } from "../../lib/store";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    initStore();
    setStats(getStats());
    setOrders(getOrders().slice(-5).reverse());
  }, []);

  if (!stats) return null;

  const cards = [
    { label: "Products", value: stats.totalProducts, icon: "🧴", color: "#D4AF37", href: "/admin/products" },
    { label: "Orders", value: stats.totalOrders, icon: "📦", color: "#4ade80", href: "/admin/orders" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "💰", color: "#c084fc", href: "/admin/reports" },
    { label: "Users", value: stats.totalUsers, icon: "👥", color: "#60a5fa", href: "/admin/users" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((c, i) => (
          <motion.div key={c.label} variants={fadeUp} custom={i} initial="hidden" animate="visible">
            <Link
              href={c.href}
              className="relative block glass rounded-[2.5rem] p-8 hover:border-[#D4AF37]/20 transition-all duration-500 group overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/[0.02] rounded-full blur-[40px] group-hover:bg-[#D4AF37]/5 transition-colors" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  {c.icon}
                </div>
                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg className="w-2.5 h-2.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-light tracking-tight mb-1" style={{ color: c.color }}>{c.value}</p>
                <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-medium">{c.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {stats.pendingOrders > 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-6 border-l-4 border-amber-400/30 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-xl">⚠️</div>
            <div>
              <p className="text-amber-400 text-sm font-semibold tracking-wide">{stats.pendingOrders} Processing Required</p>
              <p className="text-white/30 text-[11px] mt-0.5 uppercase tracking-wider">New orders awaiting fulfillment</p>
            </div>
          </motion.div>
        )}
        {stats.lowStock > 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-6 border-l-4 border-red-400/30 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-red-400/10 flex items-center justify-center text-xl">🔴</div>
            <div>
              <p className="text-red-400 text-sm font-semibold tracking-wide">{stats.lowStock} Inventory Alerts</p>
              <p className="text-white/30 text-[11px] mt-0.5 uppercase tracking-wider">Stock levels below minimum threshold</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/[0.05]">
        <div className="p-8 border-b border-white/[0.04] flex items-center justify-between">
          <h3 className="text-xs tracking-[0.2em] uppercase text-white/50 font-medium">Recent Activity</h3>
          <Link href="/admin/orders" className="text-[10px] tracking-[0.15em] uppercase text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
            Ledger →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {orders.map((o) => (
            <div key={o.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
              <div>
                <p className="text-sm text-white/80 group-hover:text-white transition-colors">{o.productName}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.1em] mt-1 font-medium">{o.customer} · {o.date}</p>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors font-light">₹{o.total.toLocaleString()}</span>
                <span className={`text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full font-bold border ${
                  o.status === "delivered" ? "bg-green-500/5 text-green-400/80 border-green-500/10" :
                  o.status === "shipped" ? "bg-blue-500/5 text-blue-400/80 border-blue-500/10" :
                  "bg-amber-500/5 text-amber-400/80 border-amber-500/10"
                }`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Add Product", href: "/admin/products", icon: "➕" },
          { label: "View Orders", href: "/admin/orders", icon: "📦" },
          { label: "Check Stock", href: "/admin/inventory", icon: "📋" },
          { label: "View Reports", href: "/admin/reports", icon: "📈" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="glass rounded-xl p-4 text-center hover:border-[#D4AF37]/20 transition-all duration-300 group"
          >
            <span className="text-xl block mb-2">{a.icon}</span>
            <span className="text-[11px] tracking-[0.1em] uppercase text-white/40 group-hover:text-white/60">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
