"use client";

/* ══════════════════════════════════════
   BEYOND THE BODY — DATA STORE
   localStorage-based CRUD for products,
   categories, orders, users, inventory
   ══════════════════════════════════════ */

const STORE_VERSION = "v4"; // bump to re-seed localStorage

const KEYS = {
  PRODUCTS: "btb_products",
  CATEGORIES: "btb_categories",
  ORDERS: "btb_orders",
  USERS: "btb_users",
  AUTH: "btb_auth",
  VERSION: "btb_store_version",
};

/* ─── Default Data ─── */

const DEFAULT_CATEGORIES = [
  { id: "sig", name: "Signature", description: "Core everyday fragrances" },
  { id: "int", name: "Intense", description: "Bold, statement scents" },
  { id: "pre", name: "Prestige", description: "Premium oud-based" },
  { id: "ltd", name: "Limited Edition", description: "Seasonal & exclusive releases" },
];

const DEFAULT_PRODUCTS = [
  {
    id: "p1", name: "Suave", categoryId: "sig", price: 4999,
    description: "Effortlessly sophisticated. A refined composition of aquatic freshness and warm woody undertones. For the man who lets his presence do the talking.",
    notes: "Aquatic · Bergamot · Sandalwood", topNote: "Bergamot", heartNote: "Sea Breeze", baseNote: "Sandalwood",
    img: "/bottle-suave.png",
    images: ["/bottle-suave.png", "/Bottle-Labels-1.jpg", "/img-5.jpg", "/img-15.jpg", "/box.jpg", "/img-9.jpg", "/BTB-Side-A-1.jpg"],
    stock: 50, longevity: 78, sillage: 70, volume: "100ml",
  },
  {
    id: "p2", name: "Heartthrob", categoryId: "int", price: 5499,
    description: "Magnetic and irresistible. A bold fusion of spicy warmth and intoxicating sweetness that leaves an unforgettable trail. Designed to captivate.",
    notes: "Spicy · Amber · Vanilla", topNote: "Pink Pepper", heartNote: "Amber", baseNote: "Vanilla",
    img: "/bottle-heartthrob.png",
    images: ["/bottle-heartthrob.png", "/Bottle-Labels-2.jpg", "/img-2.jpg", "/img-7.jpg", "/box-open.jpg", "/img-8.jpg", "/BTB-Side-B-1.jpg"],
    stock: 35, longevity: 85, sillage: 80, volume: "100ml",
  },
  {
    id: "p3", name: "Don Amour", categoryId: "pre", price: 6999,
    description: "The epitome of commanding elegance. Rich oud meets delicate florals in a masterpiece of contrasts. For the one who rules every room.",
    notes: "Oud · Rose · Saffron", topNote: "Saffron", heartNote: "Rose", baseNote: "Oud",
    img: "/bottle-don-amour.png",
    images: ["/bottle-don-amour.png", "/Bottle-Labels-3.jpg", "/img-3.jpg", "/img-13.jpg", "/img-15.jpg", "/img-7.jpg", "/BTB-Packaging-Design-3.jpg"],
    stock: 20, longevity: 92, sillage: 88, volume: "100ml",
  },
  {
    id: "p4", name: "Mon Amour", categoryId: "sig", price: 5999,
    description: "Pure romance in a bottle. A tender embrace of soft florals and warm musk that whispers love. The scent of timeless devotion.",
    notes: "Rose · Musk · Peony", topNote: "Peony", heartNote: "Rose", baseNote: "White Musk",
    img: "/img-10.jpg",
    images: ["/img-10.jpg", "/Bottle-Labels-4.jpg", "/img-12.jpg", "/img-11.jpg", "/img-14.jpg", "/card-in-place-1.jpg"],
    stock: 40, longevity: 80, sillage: 72, volume: "100ml",
  },
  {
    id: "p5", name: "Desir", categoryId: "ltd", price: 7499,
    description: "Raw desire, bottled. An intense and provocative blend of dark woods and smoky leather. Unapologetically bold, impossibly addictive.",
    notes: "Leather · Oud · Tobacco", topNote: "Black Pepper", heartNote: "Leather", baseNote: "Smoky Oud",
    img: "/bottle-desir.png",
    images: ["/bottle-desir.png", "/Bottle-Labels-5.jpg", "/img-6.jpg", "/img-8.jpg", "/img-9.jpg", "/BTB-Packaging-Design-5.jpg", "/perfume.jpg"],
    stock: 15, longevity: 95, sillage: 90, volume: "100ml",
  },
];

const DEFAULT_ORDERS = [
  { id: "o1", productId: "p1", productName: "Suave", customer: "Arjun Mehta", qty: 1, total: 4999, status: "delivered", date: "2026-03-15" },
  { id: "o2", productId: "p3", productName: "Don Amour", customer: "Priya Sharma", qty: 1, total: 6999, status: "shipped", date: "2026-03-16" },
  { id: "o3", productId: "p2", productName: "Heartthrob", customer: "Rahul Singh", qty: 2, total: 10998, status: "pending", date: "2026-03-17" },
  { id: "o4", productId: "p4", productName: "Mon Amour", customer: "Neha Gupta", qty: 1, total: 5999, status: "pending", date: "2026-03-18" },
];

const DEFAULT_USERS = [
  { id: "u1", name: "Arjun Mehta", email: "arjun@gmail.com", role: "customer", orders: 3, joined: "2026-01-10" },
  { id: "u2", name: "Priya Sharma", email: "priya@gmail.com", role: "customer", orders: 1, joined: "2026-02-20" },
  { id: "u3", name: "Rahul Singh", email: "rahul@gmail.com", role: "customer", orders: 2, joined: "2026-03-01" },
  { id: "u4", name: "Neha Gupta", email: "neha@gmail.com", role: "vip", orders: 5, joined: "2025-12-15" },
  { id: "u5", name: "Admin", email: "admin@btb.com", role: "admin", orders: 0, joined: "2025-01-01" },
];

/* ─── Helpers ─── */

function get(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ─── Init (seed data on first load, or re-seed on version bump) ─── */

export function initStore() {
  if (typeof window === "undefined") return;
  const currentVersion = localStorage.getItem(KEYS.VERSION);
  if (currentVersion !== STORE_VERSION) {
    // Version changed — re-seed all data (preserves auth)
    set(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    set(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    set(KEYS.ORDERS, DEFAULT_ORDERS);
    set(KEYS.USERS, DEFAULT_USERS);
    localStorage.setItem(KEYS.VERSION, STORE_VERSION);
    return;
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) set(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  if (!localStorage.getItem(KEYS.CATEGORIES)) set(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  if (!localStorage.getItem(KEYS.ORDERS)) set(KEYS.ORDERS, DEFAULT_ORDERS);
  if (!localStorage.getItem(KEYS.USERS)) set(KEYS.USERS, DEFAULT_USERS);
}

/* ═══════════ CATEGORIES ═══════════ */

export function getCategories() {
  return get(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

export function addCategory(cat) {
  const cats = getCategories();
  const newCat = { ...cat, id: uid() };
  set(KEYS.CATEGORIES, [...cats, newCat]);
  return newCat;
}

export function updateCategory(id, updates) {
  const cats = getCategories().map((c) => (c.id === id ? { ...c, ...updates } : c));
  set(KEYS.CATEGORIES, cats);
}

export function deleteCategory(id) {
  set(KEYS.CATEGORIES, getCategories().filter((c) => c.id !== id));
}

/* ═══════════ PRODUCTS ═══════════ */

export function getProducts() {
  return get(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

export function getProductsByCategory(categoryId) {
  return getProducts().filter((p) => p.categoryId === categoryId);
}

export function addProduct(product) {
  const products = getProducts();
  const newP = { ...product, id: uid() };
  set(KEYS.PRODUCTS, [...products, newP]);
  return newP;
}

export function updateProduct(id, updates) {
  const products = getProducts().map((p) => (p.id === id ? { ...p, ...updates } : p));
  set(KEYS.PRODUCTS, products);
}

export function deleteProduct(id) {
  set(KEYS.PRODUCTS, getProducts().filter((p) => p.id !== id));
}

/* ═══════════ ORDERS ═══════════ */

export function getOrders() {
  return get(KEYS.ORDERS, DEFAULT_ORDERS);
}

export function updateOrderStatus(id, status) {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  set(KEYS.ORDERS, orders);
}

export function addOrder(order) {
  const orders = getOrders();
  set(KEYS.ORDERS, [...orders, { ...order, id: uid() }]);
}

/* ═══════════ USERS ═══════════ */

export function getUsers() {
  return get(KEYS.USERS, DEFAULT_USERS);
}

/* ═══════════ AUTH ═══════════ */

const ADMIN_CREDS = { username: "admin", password: "btb2026" };

export function login(username, password) {
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    set(KEYS.AUTH, { loggedIn: true, user: "admin", loginTime: new Date().toISOString() });
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEYS.AUTH);
}

export function isLoggedIn() {
  return get(KEYS.AUTH, { loggedIn: false }).loggedIn;
}

/* ═══════════ STATS ═══════════ */

export function getStats() {
  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock < 15).length;

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    totalUsers: users.filter((u) => u.role !== "admin").length,
    pendingOrders,
    lowStock,
  };
}
