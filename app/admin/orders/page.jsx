"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, initStore } from "../../lib/store";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { initStore(); setOrders(getOrders()); }, []);

  function changeStatus(id, status) {
    updateOrderStatus(id, status);
    setOrders(getOrders());
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = { all: orders.length, pending: orders.filter((o) => o.status === "pending").length, shipped: orders.filter((o) => o.status === "shipped").length, delivered: orders.filter((o) => o.status === "delivered").length };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-light tracking-wide">Orders</h1>
        <p className="text-white/30 text-sm">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "shipped", "delivered"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase transition-all ${
              filter === s ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "glass text-white/40"
            }`}>
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Order</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Product</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Customer</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Total</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Date</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Status</th>
                <th className="text-right px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs text-white/30 font-mono">{o.id}</td>
                  <td className="px-4 py-4 text-sm text-white/70">{o.productName}</td>
                  <td className="px-4 py-4 text-sm text-white/50">{o.customer}</td>
                  <td className="px-4 py-4 text-sm text-white/50">₹{o.total.toLocaleString()}</td>
                  <td className="px-4 py-4 text-xs text-white/30">{o.date}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                      o.status === "delivered" ? "bg-green-500/10 text-green-400" :
                      o.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="pending" className="bg-[#0a0a0a]">Pending</option>
                      <option value="shipped" className="bg-[#0a0a0a]">Shipped</option>
                      <option value="delivered" className="bg-[#0a0a0a]">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
