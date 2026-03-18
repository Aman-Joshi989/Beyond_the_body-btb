"use client";

import { useEffect, useState } from "react";
import { getProducts, getOrders, getCategories, initStore } from "../../lib/store";

export default function ReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    initStore();
    const products = getProducts();
    const orders = getOrders();
    const categories = getCategories();

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

    // Revenue by status
    const revenueByStatus = {
      delivered: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0),
      shipped: orders.filter((o) => o.status === "shipped").reduce((s, o) => s + o.total, 0),
      pending: orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.total, 0),
    };

    // Category breakdown
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
    const catBreakdown = categories.map((c) => {
      const prods = products.filter((p) => p.categoryId === c.id);
      const catOrders = orders.filter((o) => prods.some((p) => p.id === o.productId));
      return {
        name: c.name,
        products: prods.length,
        orders: catOrders.length,
        revenue: catOrders.reduce((s, o) => s + o.total, 0),
      };
    });

    // Top products
    const productOrders = {};
    orders.forEach((o) => {
      productOrders[o.productName] = (productOrders[o.productName] || 0) + o.qty;
    });
    const topProducts = Object.entries(productOrders)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    setData({ totalRevenue, avgOrder, revenueByStatus, catBreakdown, topProducts, totalOrders: orders.length });
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-light tracking-wide">Reports</h1>
        <p className="text-white/30 text-sm">Sales & performance overview</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Total Revenue</p>
          <p className="text-3xl font-light text-[#D4AF37]">₹{data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Total Orders</p>
          <p className="text-3xl font-light text-white/70">{data.totalOrders}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Avg Order Value</p>
          <p className="text-3xl font-light text-white/70">₹{data.avgOrder.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue by Status */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm tracking-[0.15em] uppercase text-white/30 mb-6">Revenue by Status</h3>
        <div className="space-y-4">
          {Object.entries(data.revenueByStatus).map(([status, rev]) => {
            const pct = data.totalRevenue ? Math.round((rev / data.totalRevenue) * 100) : 0;
            const color = status === "delivered" ? "#4ade80" : status === "shipped" ? "#60a5fa" : "#f59e0b";
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50 capitalize">{status}</span>
                  <span className="text-sm text-white/40">₹{rev.toLocaleString()} ({pct}%)</span>
                </div>
                <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.04]">
          <h3 className="text-sm tracking-[0.15em] uppercase text-white/30">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-white/25 font-normal">Category</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-white/25 font-normal">Products</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-white/25 font-normal">Orders</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-white/25 font-normal">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.catBreakdown.map((c) => (
                <tr key={c.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-white/60">{c.name}</td>
                  <td className="px-4 py-4 text-sm text-white/40">{c.products}</td>
                  <td className="px-4 py-4 text-sm text-white/40">{c.orders}</td>
                  <td className="px-4 py-4 text-sm text-[#D4AF37]">₹{c.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm tracking-[0.15em] uppercase text-white/30 mb-6">Top Selling Products</h3>
        <div className="space-y-3">
          {data.topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="w-6 text-center text-xs text-[#D4AF37]">#{i + 1}</span>
              <div className="flex-1 flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-3">
                <span className="text-sm text-white/60">{p.name}</span>
                <span className="text-xs text-white/30">{p.qty} sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
