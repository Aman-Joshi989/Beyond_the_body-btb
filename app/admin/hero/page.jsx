"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHeroSettings, updateHeroSettings, initStore } from "../../lib/store";

export default function HeroCuration() {
  const [settings, setSettings] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    initStore();
    setSettings(getHeroSettings());
  }, []);

  if (!settings) return <div className="animate-pulse space-y-8">
    <div className="h-64 bg-white/[0.02] rounded-3xl" />
    <div className="grid grid-cols-2 gap-6">
      <div className="h-32 bg-white/[0.02] rounded-2xl" />
      <div className="h-32 bg-white/[0.02] rounded-2xl" />
    </div>
  </div>;

  const handleUpdate = (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    updateHeroSettings(newSettings);
    setSaveStatus("Changes synced live");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const orbitSpeedOptions = [
    { label: "Majestic (Slow)", value: 40 },
    { label: "Standard", value: 25 },
    { label: "Dynamic (Fast)", value: 12 },
  ];

  const backgroundOptions = [
    { label: "Midnight Silk", value: "/img-4.jpg", preview: "/img-4.jpg" },
    { label: "Deep Charcoal", value: "/box.jpg", preview: "/box.jpg" },
    { label: "Atmospheric", value: "/img-12.jpg", preview: "/img-12.jpg" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Hero Curation</h1>
        <p className="text-white/30 text-xs tracking-[0.15em] uppercase mt-2">Design your brand's first impression</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column — Controls */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Centerpiece Selection */}
          <section className="glass rounded-[2.5rem] p-8 border border-white/[0.05]">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-6 font-semibold">Centerpiece Architecture</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleUpdate({ centerpiece: 'logo' })}
                className={`p-6 rounded-2xl border transition-all duration-500 text-left group ${settings.centerpiece === 'logo' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'}`}
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">🏷️</div>
                <p className="text-xs tracking-[0.1em] uppercase font-medium">Celestial Seal</p>
                <p className="text-[10px] text-white/30 mt-1">Refined brand identity logo</p>
              </button>
              <button 
                onClick={() => handleUpdate({ centerpiece: 'box' })}
                className={`p-6 rounded-2xl border transition-all duration-500 text-left group ${settings.centerpiece === 'box' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'}`}
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">📦</div>
                <p className="text-xs tracking-[0.1em] uppercase font-medium">Bespoke Parcel</p>
                <p className="text-[10px] text-white/30 mt-1">Cinematic "Box Reveal" reveal</p>
              </button>
            </div>
          </section>

          {/* Orbit Physics */}
          <section className="glass rounded-[2.5rem] p-8 border border-white/[0.05] space-y-8">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">Orbital Physics</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 block">Rotation Speed</label>
                <div className="flex flex-col gap-2">
                  {orbitSpeedOptions.map(opt => (
                    <button 
                      key={opt.value}
                      onClick={() => handleUpdate({ orbitSpeed: opt.value })}
                      className={`px-4 py-3 rounded-xl text-[11px] tracking-wider text-left transition-all ${settings.orbitSpeed === opt.value ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 block">Orbit Volume (Radius: {settings.orbitRadius}x)</label>
                <input 
                  type="range" min="0.5" max="1.5" step="0.1" 
                  value={settings.orbitRadius} 
                  onChange={(e) => handleUpdate({ orbitRadius: parseFloat(e.target.value) })}
                  className="w-full accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[8px] tracking-widest text-white/20 uppercase">
                  <span>Intimate</span>
                  <span>Grand</span>
                </div>
              </div>
            </div>
          </section>

          {/* Environmental Settings */}
          <section className="glass rounded-[2.5rem] p-8 border border-white/[0.05]">
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[11px] tracking-[0.2em] uppercase mb-1">Celestial Dust Particles</h3>
                  <p className="text-[10px] text-white/30 tracking-wide">Atmospheric floating particles effect</p>
                </div>
                <button 
                  onClick={() => handleUpdate({ showParticles: !settings.showParticles })}
                  className={`w-14 h-7 rounded-full transition-all duration-500 relative ${settings.showParticles ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-500 ${settings.showParticles ? 'left-8' : 'left-1'}`} />
                </button>
             </div>
          </section>
        </div>

        {/* Right Column — Background & Visuals */}
        <div className="space-y-6">
          <div className="glass rounded-[2.5rem] p-8 border border-white/[0.05] space-y-6">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">Visual Atmosphere</h3>
            
            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 block">Background Canvas</label>
              <div className="grid gap-3">
                {backgroundOptions.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => handleUpdate({ bgImage: opt.value })}
                    className={`relative rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all ${settings.bgImage === opt.value ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={opt.preview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                      <span className="text-[9px] tracking-[0.1em] uppercase text-white font-medium">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 flex justify-end">
            <AnimatePresence>
              {saveStatus && (
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[#D4AF37] text-[10px] tracking-widest uppercase font-medium bg-[#D4AF37]/10 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  {saveStatus}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
