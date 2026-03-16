"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Jadwal = {
  id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  kode_mk: string;
  mata_kuliah: string;
  sks: number;
  dosen: string;
  ruang: string;
};

const HARI_URUT = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function JadwalKuliah() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });

  useEffect(() => {
    loadJadwal();
  }, []);

  async function loadJadwal() {
    setLoading(true);

    const { data, error } = await supabase
      .from("jadwal_kuliah")
      .select("*")
      .order("jam_mulai", { ascending: true });

    if (!error) setJadwal(data || []);
    setLoading(false);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-extrabold text-black mb-4">
        Jadwal Kuliah Semester Ini
      </h2>

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">
          Memuat jadwal...
        </p>
      )}

      {!loading &&
        HARI_URUT.map((hari) => {
          const list = jadwal.filter((j) => j.hari === hari);
          if (list.length === 0) return null;

          const isToday = hari === today;

          return (
            <div
              key={hari}
              className={`mb-6 rounded-xl border p-4 transition
                ${isToday ? "border-blue-600 bg-blue-50" : "border-gray-200"}
                animate-fade-in`}
            >
              <h3
                className={`font-bold text-lg mb-3
                ${isToday ? "text-blue-700" : "text-black"}`}
              >
                {hari}
                {isToday && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Hari Ini
                  </span>
                )}
              </h3>

              <div className="space-y-3">
                {list.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition animate-scale-in"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-black">
                          {j.mata_kuliah}
                        </p>
                        <p className="text-sm text-gray-600">
                          {j.kode_mk} • {j.dosen}
                        </p>
                        <p className="text-sm text-gray-600">
                           {j.jam_mulai} – {j.jam_selesai}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                          {j.sks} SKS
                        </span>
                        <p className="text-xs mt-2 text-gray-500">
                          Ruang {j.ruang}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      {/* ANIMASI */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}