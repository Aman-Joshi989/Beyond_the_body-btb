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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} variants={fadeUp} custom={i} initial="hidden" animate="visible">
            <Link
              href={c.href}
              className="block glass rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{c.icon}</span>
                <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-light" style={{ color: c.color }}>{c.value}</p>
              <p className="text-white/30 text-xs tracking-[0.15em] uppercase mt-1">{c.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {stats.pendingOrders > 0 && (
          <div className="glass rounded-2xl p-5 border-l-2 border-amber-400/50">
            <p className="text-amber-400 text-sm font-medium">⚠️ {stats.pendingOrders} Pending Orders</p>
            <p className="text-white/30 text-xs mt-1">Require review and processing</p>
          </div>
        )}
        {stats.lowStock > 0 && (
          <div className="glass rounded-2xl p-5 border-l-2 border-red-400/50">
            <p className="text-red-400 text-sm font-medium">🔴 {stats.lowStock} Low Stock Items</p>
            <p className="text-white/30 text-xs mt-1">Below 15 units threshold</p>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
          <h3 className="text-sm tracking-[0.15em] uppercase text-white/50">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[11px] tracking-[0.15em] uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {orders.map((o) => (
            <div key={o.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">{o.productName}</p>
                <p className="text-xs text-white/30">{o.customer} · {o.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/50">₹{o.total.toLocaleString()}</span>
                <span className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                  o.status === "delivered" ? "bg-green-500/10 text-green-400" :
                  o.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                  "bg-amber-500/10 text-amber-400"
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
