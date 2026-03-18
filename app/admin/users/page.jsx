"use client";

import { useEffect, useState } from "react";
import { getUsers, initStore } from "../../lib/store";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => { initStore(); setUsers(getUsers()); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-light tracking-wide">Users</h1>
        <p className="text-white/30 text-sm">{users.length} registered users</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">User</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Email</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Role</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Orders</th>
                <th className="text-left px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-sm text-[#D4AF37]">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm text-white/70">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/40">{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                      u.role === "admin" ? "bg-purple-500/10 text-purple-400" :
                      u.role === "vip" ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
                      "bg-white/[0.04] text-white/40"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/40">{u.orders}</td>
                  <td className="px-4 py-4 text-xs text-white/30">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
