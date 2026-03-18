"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, logout, initStore } from "../lib/store";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Products", href: "/admin/products", icon: "🧴" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Inventory", href: "/admin/inventory", icon: "📋" },
  { label: "Reports", href: "/admin/reports", icon: "📈" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initStore();
    if (pathname === "/admin") return; // login page handles its own auth
    if (!isLoggedIn()) {
      router.replace("/admin");
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  // Login page — no sidebar
  if (pathname === "/admin") return <>{children}</>;

  // Not authed yet
  if (!authed) return <div className="min-h-screen bg-[#050505]" />;

  function handleLogout() {
    logout();
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/[0.04] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/[0.04]">
          <Link href="/" className="text-[12px] tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors block">
            Beyond The Body
          </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]/40 mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  active
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout & Return */}
        <div className="p-4 border-t border-white/[0.04] space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
          >
            <span className="text-lg">🏡</span>
            <span className="tracking-wide">Return to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-400/[0.05] transition-all duration-300"
          >
            <span className="text-lg">🚪</span>
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white/40 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-sm tracking-[0.15em] uppercase text-white/50 font-light">
            {navItems.find((n) => n.href === pathname)?.label || "Admin"}
          </h2>
          <Link href="/" className="text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-[#D4AF37] transition-colors">
            View Store →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
