"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import ActivityChart from "@/components/ActivityChart";
import JadwalKuliah from "./JadwalKuliah";
import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Image as ImageIcon,
  CreditCard
} from "lucide-react";

export default function DashboardPage() {

  const [nama, setNama] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  const [tugas, setTugas] = useState<any[]>([]);
  const [jadwalHariIni, setJadwalHariIni] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [notif, setNotif] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUser();
    loadTugas();
    loadJadwalHariIni();
    loadChart();
  }, []);

  /* ================= UTIL ================= */

  function showNotif(type: "success" | "error", msg: string) {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 2500);
  }

  /* ================= LOAD USER ================= */

  async function loadUser() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("nama,foto")
      .eq("id", user.id)
      .single();

    if (data) {
      setNama(data.nama);
      setFoto(data.foto);
    }
  }

  /* ================= LOAD DATA ================= */

  async function loadTugas() {

    const { data } = await supabase
      .from("tugas")
      .select("*")
      .order("deadline", { ascending: true })
      .limit(3);

    setTugas(data || []);
  }

  async function loadJadwalHariIni() {

    const today = new Date().toLocaleDateString("id-ID", {
      weekday: "long"
    });

    const { data } = await supabase
      .from("jadwal_kuliah")
      .select("*")
      .eq("hari", today)
      .order("jam_mulai");

    setJadwalHariIni(data || []);
  }

  async function loadChart() {

    setChartData([
      { name: "Sen", value: 4 },
      { name: "Sel", value: 6 },
      { name: "Rab", value: 3 },
      { name: "Kam", value: 7 },
      { name: "Jum", value: 2 }
    ]);

  }

  /* ================= FOTO ================= */

  async function uploadFoto(file: File) {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const fileName = `profile-${user.id}-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("profile")
      .upload(fileName, file);

    if (error) {
      showNotif("error", "Upload gagal");
      return;
    }

    const { data: url } = supabase.storage
      .from("profile")
      .getPublicUrl(data.path);

    await supabase
      .from("profiles")
      .update({ foto: url.publicUrl })
      .eq("id", user.id);

    setFoto(url.publicUrl);
    showNotif("success", "Foto diperbarui");
  }

  async function hapusFoto() {

    if (!foto) return;

    const path = new URL(foto).pathname.split("/profile/")[1];

    await supabase.storage.from("profile").remove([path]);

    await supabase
      .from("profiles")
      .update({ foto: null });

    setFoto(null);
    setShowPreview(false);

    showNotif("success", "Foto dihapus");
  }

  /* ================= STATISTIK ================= */

  const totalTugas = tugas.length;

  const deadlineDekat = tugas.filter((t) => {

    if (!t.deadline) return false;

    const diff =
      new Date(t.deadline).getTime() - new Date().getTime();

    return diff < 3 * 24 * 60 * 60 * 1000;

  }).length;

  const totalJadwal = jadwalHariIni.length;

  /* ================= UI ================= */

  return (

<div className="space-y-10 max-w-7xl mx-auto px-4 text-black">

{/* NOTIF */}

{notif && (
<div
className={`fixed top-5 right-5 px-4 py-2 rounded-md text-white text-sm shadow
${notif.type === "success" ? "bg-green-600" : "bg-red-600"}`}
>
{notif.msg}
</div>
)}

{/* BANNER */}

<section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-8 shadow">

<h1 className="text-3xl font-bold">
Dashboard Mahasiswa
</h1>

<p className="text-sm text-white/90 mt-1">
Kelola tugas, jadwal, dan aktivitas kuliahmu
</p>

</section>

{/* HEADER USER */}

<div className="flex justify-between items-center">

<div>

<h1 className="text-xl font-semibold">
Halo, {nama}
</h1>

<p className="text-sm text-gray-600">
Selamat datang kembali
</p>

</div>

<div className="relative">

<div
onClick={() => setShowMenu(!showMenu)}
className="cursor-pointer"
>

{foto ? (
<img
src={foto}
className="w-14 h-14 rounded-full object-cover border"
/>
) : (
<div className="w-14 h-14 rounded-full bg-gray-300"/>
)}

</div>

{showMenu && (

<div className="absolute right-0 mt-2 bg-white border rounded-md shadow w-40 text-sm">

<button
onClick={()=>{
setShowPreview(true)
setShowMenu(false)
}}
className="w-full px-4 py-2 text-left hover:bg-gray-100"
>
Lihat Foto
</button>

<button
onClick={()=>fileInputRef.current?.click()}
className="w-full px-4 py-2 text-left hover:bg-gray-100"
>
Ganti Foto
</button>

{foto && (
<button
onClick={hapusFoto}
className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
>
Hapus
</button>
)}

</div>

)}

<input
ref={fileInputRef}
type="file"
hidden
accept="image/*"
onChange={(e)=>e.target.files && uploadFoto(e.target.files[0])}
/>

</div>

</div>

{/* STATISTIK */}

<section className="grid md:grid-cols-3 gap-6">

<div className="bg-white rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500">
Total Tugas
</p>

<p className="text-3xl font-bold mt-1">
{totalTugas}
</p>

</div>

<div className="bg-white rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500">
Deadline Dekat
</p>

<p className="text-3xl font-bold text-red-600 mt-1">
{deadlineDekat}
</p>

</div>

<div className="bg-white rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500">
Jadwal Hari Ini
</p>

<p className="text-3xl font-bold text-blue-600 mt-1">
{totalJadwal}
</p>

</div>

</section>

{/* MENU */}

<section className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold mb-6">
Layanan
</h2>

<div className="grid grid-cols-3 md:grid-cols-5 gap-6 text-center">

<Link href="/dashboard">
<div className="flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
<LayoutDashboard/>
<span className="text-sm">Dashboard</span>
</div>
</Link>

<Link href="/dashboard/tugas">
<div className="flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
<ClipboardList/>
<span className="text-sm">Tugas</span>
</div>
</Link>

<Link href="/dashboard/jadwal">
<div className="flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
<CalendarDays/>
<span className="text-sm">Jadwal</span>
</div>
</Link>

<Link href="/dashboard/dokumentasi">
<div className="flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
<ImageIcon/>
<span className="text-sm">Dokumentasi</span>
</div>
</Link>

<Link href="/dashboard/pembayaran">
<div className="flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
<CreditCard/>
<span className="text-sm">Pembayaran</span>
</div>
</Link>

</div>

</section>

{/* GRID */}

<div className="grid md:grid-cols-2 gap-6">

{/* JADWAL */}

<section className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold mb-4">
Jadwal Hari Ini
</h2>

{jadwalHariIni.length === 0 ? (
<p className="text-sm text-gray-500">
Tidak ada jadwal hari ini
</p>
) : (
jadwalHariIni.map((j)=>(
<div key={j.id} className="border-b last:border-none py-2">

<p className="font-medium">
{j.mata_kuliah}
</p>

<p className="text-sm text-gray-500">
{j.jam_mulai} – {j.jam_selesai} • Ruang {j.ruang}
</p>

</div>
))
)}

</section>

{/* TUGAS */}

<section className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold mb-4">
Tugas Aktif
</h2>

{tugas.length === 0 ? (
<p className="text-sm text-gray-500">
Tidak ada tugas
</p>
) : (
tugas.map((t)=>{

const diff =
new Date(t.deadline).getTime() - new Date().getTime();

let status="Aman"
let color="text-green-600"

if(diff < 86400000){
status="Deadline Hari Ini"
color="text-red-600"
}
else if(diff < 259200000){
status="Segera Kerjakan"
color="text-orange-500"
}

return(

<div key={t.id} className="border-b last:border-none py-2">

<p className="font-medium">
{t.judul}
</p>

<p className="text-sm text-gray-500">
Deadline: {t.deadline}
</p>

<p className={`text-xs font-semibold ${color}`}>
{status}
</p>

</div>

)

})
)}

</section>

</div>

{/* CHART */}

<div className="grid md:grid-cols-2 gap-6">

<ActivityChart data={chartData}/>
<JadwalKuliah/>

</div>

{/* PREVIEW FOTO */}

{showPreview && foto && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center">

<div className="bg-white p-4 rounded-lg max-w-sm w-full relative">

<button
onClick={()=>setShowPreview(false)}
className="absolute top-2 right-2 text-lg"
>
✕
</button>

<img
src={foto}
className="rounded-md"
/>

</div>

</div>

)}

</div>

  );

}
