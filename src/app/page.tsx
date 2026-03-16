"use client";

import DokumentasiGallery from "@/components/DokumentasiGallery";

<DokumentasiGallery />
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  LineChart,
  Calendar,
  ShieldCheck,
  Zap,
  Camera,
} from "lucide-react";

export default function LandingPage() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const [scrolled, setScrolled] = useState(false);
  const [text, setText] = useState("");

  const fullText = "PTI One A Class — Tahun 2025";

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-white text-neutral-900 overflow-x-hidden">

      {/* Scroll Progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-black origin-left z-[60]"
      />

      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-neutral-200 shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          
          <div className="font-semibold tracking-wide text-lg">
            ONEA CLASS
          </div>

          <div className="flex items-center gap-10">
            
            <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
              {[
                { name: "Fitur", id: "features" },
                { name: "Preview", id: "preview" },
                { name: "Keunggulan", id: "advantages" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(item.id)}
                  className="relative group hover:text-black transition"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            <a
              href="/login"
              className="text-sm px-6 py-2.5 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
            >
              Login
            </a>

          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-56 pb-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-8"
        >
          <h1 className="text-6xl md:text-7xl font-semibold leading-tight">
            {text}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="mt-8 text-lg text-neutral-500 leading-relaxed">
            Platform terpadu untuk membantu mahasiswa mengelola akademik,
            memantau performa, dan merencanakan kelulusan dengan lebih
            terstruktur dan efisien.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => scrollTo("features")}
              className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition"
            >
              Lihat Fitur <ArrowRight size={16} />
            </button>

            <a
              href="/login"
              className="px-8 py-4 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
            >
              Akses Sistem
            </a>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES PREMIUM ================= */}
      <section id="features" className="py-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-20 tracking-tight">
            Fitur Utama Sistem
          </h2>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
            {[
              {
                icon: Camera,
                title: "Dokumentasi Akademik",
                desc: "Simpan dan akses foto tugas, proyek, dan momen kampus.",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                icon: ClipboardList,
                title: "Manajemen Tugas",
                desc: "Kelola deadline dan submission dalam satu tempat.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: LineChart,
                title: "Monitoring Nilai",
                desc: "Lihat perkembangan nilai per mata kuliah.",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: Calendar,
                title: "Jadwal & Kalender",
                desc: "Akses jadwal kuliah dan agenda akademik.",
                gradient: "from-pink-500 to-rose-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-neutral-200 to-neutral-300 hover:shadow-2xl transition duration-500"
              >
                <div className="relative bg-white rounded-3xl p-8 h-full">
                  
                  {/* Gradient icon */}
                  <div
                    className={`w-14 h-14 flex items-center justify-center 
                                rounded-2xl text-white mb-6 
                                bg-gradient-to-br ${item.gradient}
                                group-hover:scale-110 transition duration-500`}
                  >
                    <item.icon size={22} />
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADVANTAGES ================= */}
      <section id="advantages" className="py-32 bg-neutral-50 text-center">
        <h2 className="text-4xl font-semibold mb-16">
          Keunggulan Sistem
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto px-8">
          {[
            { icon: Zap, title: "Cepat & Responsif" },
            { icon: ShieldCheck, title: "Aman & Terintegrasi" },
            { icon: LayoutDashboard, title: "User Friendly" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="transition"
            >
              <item.icon className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-20 text-center text-sm text-neutral-400 border-t border-neutral-200">
        © 2026 PTI IA — Sistem Informasi Akademik Modern
      </footer>
    </div>
  );
}