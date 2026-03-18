"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, updateProduct, initStore } from "../../lib/store";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => { initStore(); reload(); }, []);

  function reload() {
    setProducts(getProducts());
    setCategories(getCategories());
  }

  function adjustStock(id, delta) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    updateProduct(id, { stock: Math.max(0, p.stock + delta) });
    reload();
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const sorted = [...products].sort((a, b) => a.stock - b.stock);
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 15).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-light tracking-wide">Inventory</h1>
        <p className="text-white/30 text-sm">{totalStock} total units · {lowStock} low stock alerts</p>
      </div>

      {/* Alerts */}
      {lowStock > 0 && (
        <div className="glass rounded-2xl p-5 border-l-2 border-red-400/50">
          <p className="text-red-400 text-sm font-medium">⚠️ {lowStock} product{lowStock > 1 ? "s" : ""} below 15 units</p>
          <p className="text-white/30 text-xs mt-1">
            {sorted.filter((p) => p.stock < 15).map((p) => p.name).join(", ")}
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Product</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Category</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Stock Level</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Status</th>
                <th className="text-right px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {sorted.map((p) => {
                const pct = Math.min((p.stock / 80) * 100, 100);
                const color = p.stock < 15 ? "#ef4444" : p.stock < 30 ? "#f59e0b" : "#4ade80";
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-white/70">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/30">{catMap[p.categoryId] || "—"}</td>
                    <td className="px-4 py-4 w-48">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/[0.04] h-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="text-sm text-white/50 w-8 text-right">{p.stock}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                        p.stock < 15 ? "bg-red-500/10 text-red-400" :
                        p.stock < 30 ? "bg-amber-500/10 text-amber-400" :
                        "bg-green-500/10 text-green-400"
                      }`}>
                        {p.stock < 15 ? "Low" : p.stock < 30 ? "Medium" : "Good"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => adjustStock(p.id, -5)}
                          className="w-8 h-8 rounded-lg bg-white/[0.04] text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm">−</button>
                        <button onClick={() => adjustStock(p.id, 5)}
                          className="w-8 h-8 rounded-lg bg-white/[0.04] text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all text-sm">+</button>
                        <button onClick={() => adjustStock(p.id, 20)}
                          className="px-3 h-8 rounded-lg bg-white/[0.04] text-white/30 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-[10px] tracking-wider uppercase">+20</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
