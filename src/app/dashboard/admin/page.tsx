"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const menuItems = [
  { key: "home", title: "Beranda" },
  { key: "krs", title: "KRS" },
  { key: "khs", title: "KHS" },
  { key: "profil", title: "Profil" },
];

export default function DashboardMahasiswa() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home");

  useEffect(() => {
    const userType = localStorage.getItem("user_type");

    if (!userType) {
      router.replace("/");
      return;
    }

    if (userType === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-black">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-6">SIAKAD PTI</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={`w-full text-left px-4 py-2 rounded-md font-semibold transition ${
                  activeMenu === item.key
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {menuItems.find((m) => m.key === activeMenu)?.title}
          </h2>
          <button
            onClick={() => {
              localStorage.removeItem("user_type");
              router.replace("/");
            }}
            className="px-4 py-2 border border-black rounded-lg hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeMenu === "home" && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Selamat Datang 👋</h2>
              <p className="text-sm">
                Ini adalah halaman utama dashboard Mahasiswa SIAKAD PTI.
              </p>
            </div>
          )}

          {activeMenu === "krs" && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Kartu Rencana Studi</h2>
              <p className="text-sm">Isi KRS semester ini di sini.</p>
              {/* Tambahkan tabel KRS atau form */}
            </div>
          )}

          {activeMenu === "khs" && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Kartu Hasil Studi</h2>
              <p className="text-sm">Lihat KHS semester sebelumnya di sini.</p>
              {/* Tambahkan tabel KHS */}
            </div>
          )}

          {activeMenu === "profil" && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Profil Mahasiswa</h2>
              <p className="text-sm">Informasi pribadi dan akademik mahasiswa.</p>
              {/* Tambahkan form atau detail profil */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
