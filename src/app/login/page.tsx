"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {

  const router = useRouter();

  const [nim,setNim] = useState("");
  const [tglLahir,setTglLahir] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);

    try{

      const { data,error } = await supabase
      .from("profiles")
      .select("*")
      .eq("nim",nim)
      .eq("tanggal_lahir",tglLahir)
      .single();

      if(error || !data){
        throw new Error("NIM atau tanggal lahir salah");
      }

      // simpan session login
      localStorage.setItem("user",JSON.stringify(data));

      router.push("/dashboard");

    }catch(err:any){

      alert(err.message || "Login gagal");

    }finally{

      setLoading(false);

    }

  }

  return(

<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4">

<div className="w-full max-w-md backdrop-blur-xl bg-white border border-gray-200 rounded-3xl shadow-2xl p-10">

{/* LOGO */}

<div className="flex justify-center mb-6">

<Image
src="/pti-logo.png"
alt="logo"
width={90}
height={90}
priority
className="drop-shadow-md"
/>

</div>

{/* TITLE */}

<h1 className="text-3xl font-extrabold text-center text-black tracking-tight">
Masuk Akun
</h1>

<p className="text-center text-black mt-1 mb-8 text-sm">
Platform Akademik <span className="font-semibold text-blue-600">ONEA</span>
</p>


<form onSubmit={handleLogin} className="space-y-5">

{/* NIM */}

<div>

<label className="text-sm font-semibold text-black">
NIM
</label>

<input
type="text"
value={nim}
onChange={(e)=>setNim(e.target.value)}
placeholder="Nomor Induk Mahasiswa"
required
className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3
text-black placeholder-black
focus:outline-none focus:ring-2 focus:ring-blue-500
transition shadow-sm"
/>

</div>


{/* TANGGAL LAHIR */}

<div>

<label className="text-sm font-semibold text-black">
Tanggal Lahir
</label>

<input
type="date"
value={tglLahir}
onChange={(e)=>setTglLahir(e.target.value)}
required
className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3
text-black
focus:outline-none focus:ring-2 focus:ring-blue-500
transition shadow-sm"
/>

</div>


{/* BUTTON */}

<button
type="submit"
disabled={loading}
className="w-full mt-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white font-semibold shadow-lg
hover:scale-[1.02] hover:shadow-xl transition
disabled:opacity-60 disabled:cursor-not-allowed"
>

{loading ? "Memproses..." : "Masuk"}

</button>

</form>


{/* FOOTER */}

<p className="text-center text-sm text-black mt-8">

Belum punya akun?{" "}

<a
href="/register"
className="font-semibold text-blue-600 hover:underline"
>
Daftar disini
</a>

</p>

</div>

</div>

)

}
