"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {

  const router = useRouter();

  const [nama,setNama] = useState("");
  const [nim,setNim] = useState("");
  const [tglLahir,setTglLahir] = useState("");
  const [loading,setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);

    try{

      const email = `${nim}@student.onea`;
      const password = `${nim}_${tglLahir.replace(/-/g,"")}`;

      // REGISTER USER
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if(error) throw error;
      if(!data.user) throw new Error("User gagal dibuat");

      // BUAT / UPDATE PROFILE
      const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        nama,
        nim,
        tanggal_lahir: tglLahir
      });

      if(profileError) throw profileError;

      alert("Registrasi berhasil");

      router.push("/login");

    }catch(err:any){

      if(err.message.includes("User already registered")){
        alert("NIM sudah terdaftar");
      }else{
        alert(err.message);
      }

    }finally{
      setLoading(false);
    }

  };


  return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">

<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

{/* LOGO */}

<div className="flex justify-center mb-6">

<Image
src="/pti-logo.png"
alt="Logo"
width={80}
height={80}
/>

</div>


{/* TITLE */}

<h1 className="text-2xl font-bold text-center text-black">

Registrasi Akun

</h1>

<p className="text-center text-sm text-black mt-1 mb-6">

Lengkapi data mahasiswa

</p>


{/* FORM */}

<form
onSubmit={handleRegister}
className="space-y-4"
>

{/* NAMA */}

<div>

<label className="block text-sm font-semibold text-black mb-1">

Nama Lengkap

</label>

<input
type="text"
value={nama}
onChange={(e)=>setNama(e.target.value)}
placeholder="Nama lengkap"
required
className="w-full border border-black rounded-lg px-4 py-2.5
text-black placeholder-black
focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

</div>


{/* NIM */}

<div>

<label className="block text-sm font-semibold text-black mb-1">

NIM

</label>

<input
type="text"
value={nim}
onChange={(e)=>setNim(e.target.value)}
placeholder="Nomor Induk Mahasiswa"
required
className="w-full border border-black rounded-lg px-4 py-2.5
text-black placeholder-black
focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

</div>


{/* TANGGAL LAHIR */}

<div>

<label className="block text-sm font-semibold text-black mb-1">

Tanggal Lahir

</label>

<input
type="date"
value={tglLahir}
onChange={(e)=>setTglLahir(e.target.value)}
required
className="w-full border border-black rounded-lg px-4 py-2.5
text-black
focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

</div>


{/* BUTTON */}

<button
type="submit"
disabled={loading}
className="w-full mt-3 bg-blue-600 text-white py-3 rounded-full font-semibold
hover:bg-blue-700 transition disabled:opacity-60"
>

{loading ? "Memproses..." : "Daftar"}

</button>

</form>


{/* FOOTER */}

<p className="text-center text-sm text-black mt-6">

Sudah punya akun?

<a
href="/login"
className="text-blue-600 font-semibold ml-1"
>

Login

</a>

</p>

</div>

</div>

  )

}
