"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getCategories, addCategory, deleteCategory, initStore,
} from "../../lib/store";

const EMPTY_PRODUCT = {
  name: "", categoryId: "", price: "", description: "",
  notes: "", topNote: "", heartNote: "", baseNote: "",
  img: "/img-1.jpg", stock: 0, longevity: 50, sillage: 50, volume: "100ml",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { initStore(); reload(); }, []);

  function reload() {
    setProducts(getProducts());
    setCategories(getCategories());
  }

  function openNewProduct() {
    setEditProduct(null);
    setForm({ ...EMPTY_PRODUCT, categoryId: categories[0]?.id || "" });
    setShowModal(true);
  }

  function openEditProduct(p) {
    setEditProduct(p);
    setForm({ ...p, price: String(p.price) });
    setShowModal(true);
  }

  function handleSave() {
    const data = { ...form, price: Number(form.price), stock: Number(form.stock), longevity: Number(form.longevity), sillage: Number(form.sillage) };
    if (editProduct) updateProduct(editProduct.id, data);
    else addProduct(data);
    setShowModal(false);
    reload();
  }

  function handleDelete(id) {
    deleteProduct(id);
    setDeleteConfirm(null);
    reload();
  }

  function handleAddCategory() {
    if (!newCat.name.trim()) return;
    addCategory(newCat);
    setNewCat({ name: "", description: "" });
    reload();
  }

  function handleDeleteCategory(id) {
    deleteCategory(id);
    reload();
  }

  const filtered = filterCat === "all" ? products : products.filter((p) => p.categoryId === filterCat);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-light tracking-wide">Products</h1>
          <p className="text-white/30 text-sm">{products.length} products across {categories.length} categories</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCatModal(true)} className="glass px-5 py-2.5 rounded-xl text-xs tracking-[0.1em] uppercase hover:border-[#D4AF37]/30 transition-all">
            Manage Categories
          </button>
          <button onClick={openNewProduct} className="bg-[#D4AF37] text-[#050505] px-5 py-2.5 rounded-xl text-xs tracking-[0.1em] uppercase font-semibold hover:bg-[#e8c44a] transition-colors">
            + Add Product
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setFilterCat("all")}
          className={`px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-all ${
            filterCat === "all" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "glass text-white/40"
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((c) => {
          const count = products.filter((p) => p.categoryId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-all ${
                filterCat === c.id ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "glass text-white/40"
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Product</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Category</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Price</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Stock</th>
                <th className="text-right px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80">{p.name}</p>
                        <p className="text-xs text-white/25">{p.notes}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-white/[0.04] text-white/40">
                      {catMap[p.categoryId] || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/50">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`text-sm ${p.stock < 15 ? "text-red-400" : "text-white/50"}`}>
                      {p.stock} {p.stock < 15 && "⚠️"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditProduct(p)} className="text-white/30 hover:text-[#D4AF37] text-sm mr-4 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="text-white/30 hover:text-red-400 text-sm transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-12 text-white/20 text-sm">No products in this category</p>
        )}
      </div>

      {/* ═══ ADD/EDIT PRODUCT MODAL ═══ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-light mb-6">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors">
                    {categories.map((c) => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Image Path</label>
                  <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Volume</label>
                  <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Top Note</label>
                  <input value={form.topNote} onChange={(e) => setForm({ ...form, topNote: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Heart Note</label>
                  <input value={form.heartNote} onChange={(e) => setForm({ ...form, heartNote: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Base Note</label>
                  <input value={form.baseNote} onChange={(e) => setForm({ ...form, baseNote: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Longevity ({form.longevity}%)</label>
                  <input type="range" min="0" max="100" value={form.longevity} onChange={(e) => setForm({ ...form, longevity: e.target.value })}
                    className="w-full accent-[#D4AF37]" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1.5">Sillage ({form.sillage}%)</label>
                  <input type="range" min="0" max="100" value={form.sillage} onChange={(e) => setForm({ ...form, sillage: e.target.value })}
                    className="w-full accent-[#D4AF37]" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 glass py-3 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 bg-[#D4AF37] text-[#050505] py-3 rounded-xl text-sm font-semibold hover:bg-[#e8c44a] transition-colors">
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ DELETE CONFIRM ═══ */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="glass rounded-2xl p-6 max-w-sm w-full text-center">
              <p className="text-lg mb-2">Delete Product?</p>
              <p className="text-white/30 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass py-2.5 rounded-xl text-sm text-white/40">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm hover:bg-red-500/30 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CATEGORY MANAGEMENT MODAL ═══ */}
      <AnimatePresence>
        {showCatModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowCatModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="glass rounded-3xl p-6 md:p-8 max-w-lg w-full">
              <h3 className="text-lg font-light mb-6">Manage Categories</h3>

              <div className="space-y-2 mb-6">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm text-white/70">{c.name}</p>
                      <p className="text-xs text-white/25">{c.description}</p>
                    </div>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-white/20 hover:text-red-400 text-xs transition-colors">
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.04] pt-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">Add New Category</p>
                <div className="flex gap-3">
                  <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="Name"
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                  <input value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} placeholder="Description"
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/30 transition-colors" />
                </div>
                <button onClick={handleAddCategory} className="mt-3 bg-[#D4AF37] text-[#050505] px-6 py-2.5 rounded-xl text-xs tracking-[0.1em] uppercase font-semibold hover:bg-[#e8c44a] transition-colors">
                  Add Category
                </button>
              </div>

              <button onClick={() => setShowCatModal(false)} className="mt-6 w-full glass py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
