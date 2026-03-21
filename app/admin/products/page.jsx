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
  isHero: false,
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
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => { initStore(); reload(); }, []);

  function reload() {
    setProducts(getProducts());
    setCategories(getCategories());
  }

  function openNewProduct() {
    setEditProduct(null);
    setForm({ ...EMPTY_PRODUCT, categoryId: categories[0]?.id || "" });
    setActiveTab("identity");
    setShowModal(true);
  }

  function openEditProduct(p) {
    setEditProduct(p);
    setForm({ ...p, price: String(p.price) });
    setActiveTab("identity");
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
                <th className="text-center px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Hero</th>
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
                  <td className="px-4 py-4 text-center">
                    {p.isHero ? (
                      <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase bg-[#D4AF37]/10 px-2 py-1 rounded">Yes</span>
                    ) : (
                      <span className="text-white/10 text-xs tracking-widest uppercase">No</span>
                    )}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(212,175,55,0.15)] border-[#D4AF37]/10"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                <div>
                  <h3 className="text-2xl font-light tracking-tight text-white/90">
                    {editProduct ? "Refine Product" : "Curate New Arrival"}
                  </h3>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mt-1 font-semibold opacity-70">
                    Beyond The Body • Atelier
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  ✕
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-white/[0.05] px-8 bg-black/20">
                {[
                  { id: 'identity', label: 'Identity' },
                  { id: 'olfactory', label: 'Scent Profile' },
                  { id: 'media', label: 'Architecture & Media' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-5 px-6 text-[11px] tracking-[0.2em] uppercase transition-all ${
                      activeTab === tab.id ? "text-[#D4AF37]" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/10">
                <AnimatePresence mode="wait">
                  {activeTab === 'identity' && (
                    <motion.div 
                      key="identity"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Product Name</label>
                          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Collection / Category</label>
                          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer">
                            {categories.map((c) => <option key={c.id} value={c.id} className="bg-[#0a0a0a] py-4">{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Price (₹)</label>
                          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Stock Availability</label>
                          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all" />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Atmospheric Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all resize-none leading-relaxed" />
                      </div>

                      <div className="p-6 bg-[#D4AF37]/5 rounded-3xl border border-[#D4AF37]/10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${form.isHero ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-white/20'}`}>
                             ✦
                          </div>
                          <div>
                            <p className="text-sm text-white/80 font-medium">Flagship Hero Curation</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] mt-0.5">Elevate this product to the main 3D Orbital experience</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setForm({ ...form, isHero: !form.isHero })}
                          className={`w-14 h-7 rounded-full transition-all relative ${form.isHero ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${form.isHero ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'olfactory' && (
                    <motion.div 
                      key="olfactory"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-10"
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {[
                          { key: 'topNote', label: 'Top Note', desc: 'Initial Impression' },
                          { key: 'heartNote', label: 'Heart Note', desc: 'Signature Soul' },
                          { key: 'baseNote', label: 'Base Note', desc: 'Lasting Echo' }
                        ].map((note) => (
                          <div key={note.key}>
                            <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">{note.label}</label>
                            <input value={form[note.key]} onChange={(e) => setForm({ ...form, [note.key]: e.target.value })}
                              placeholder={note.desc}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-sm font-light outline-none focus:border-[#D4AF37]/40 transition-all" />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-8 mt-10 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                        <h4 className="text-xs uppercase tracking-[0.4em] text-white/20 text-center mb-8">Performance Metrics</h4>
                        <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <label className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">Longevity</label>
                              <span className="text-xl font-extralight text-white/80">{form.longevity}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={form.longevity} onChange={(e) => setForm({ ...form, longevity: e.target.value })}
                              className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer transition-all" />
                            <p className="text-[9px] text-white/20 uppercase tracking-[0.1em]">Time duration on skin</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <label className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">Sillage</label>
                              <span className="text-xl font-extralight text-white/80">{form.sillage}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={form.sillage} onChange={(e) => setForm({ ...form, sillage: e.target.value })}
                              className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer transition-all" />
                              <p className="text-[9px] text-white/20 uppercase tracking-[0.1em]">Fragrance trail intensity</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'media' && (
                    <motion.div 
                      key="media"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Product Image</label>
                            <input type="file" accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setForm({ ...form, img: reader.result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-[9px] text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all font-mono file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:tracking-widest file:uppercase file:bg-[#D4AF37] file:text-black hover:file:bg-[#e8c44a] cursor-pointer" />
                            <p className="text-[9px] text-white/20 mt-2 ml-1 italic">Upload image (Transparent PNG recommended)</p>
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 ml-1">Vessel Volume</label>
                            <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-base font-light outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2.5 self-start ml-1">Live Aperture</label>
                          <div className="w-full aspect-[4/5] bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center justify-center group relative shadow-inner">
                            {form.img ? (
                              <>
                                <img src={form.img} alt="Preview" className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                              </>
                            ) : (
                              <div className="text-white/10 text-center">
                                <div className="text-4xl mb-2">✦</div>
                                <div className="text-[9px] tracking-widest uppercase">Mirroring Asset</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-white/[0.05] flex gap-4 bg-black/20">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 rounded-2xl text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] bg-white text-black py-4 rounded-2xl text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[#D4AF37] transition-all shadow-xl active:scale-95 translate-y-0"
                >
                  {editProduct ? "Authorize Refinement" : "Confirm Addition"}
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
