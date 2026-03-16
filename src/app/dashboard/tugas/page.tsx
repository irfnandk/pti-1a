"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Page(){

const [tugas,setTugas] = useState<any[]>([])
const [loading,setLoading] = useState(true)

async function getTugas(){

const { data,error } = await supabase
.from("tugas")
.select("*")
.order("created_at",{ascending:false})

if(error){
console.log(error)
}

setTugas(data || [])
setLoading(false)

}

useEffect(()=>{
getTugas()
},[])

if(loading){
return(
<div className="flex justify-center items-center h-[70vh] text-black text-lg">
Loading tugas...
</div>
)
}

const total = tugas.length

const today = new Date()

const hampirDeadline = tugas.filter(t=>{
if(!t.deadline) return false
const diff = new Date(t.deadline).getTime() - today.getTime()
return diff < 3*24*60*60*1000
}).length

return(

<div className="max-w-7xl mx-auto p-8">

{/* HEADER BANNER */}

<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white mb-10">

<h1 className="text-4xl font-bold mb-2">
Dashboard Tugas
</h1>

<p className="text-white/90">
Kelola dan kumpulkan tugas kuliah dengan mudah
</p>

</div>

{/* STATISTIK */}

<div className="grid md:grid-cols-3 gap-6 mb-10">

<div className="bg-white rounded-2xl shadow p-6 border">

<p className="text-gray-500 text-sm">
Total Tugas
</p>

<p className="text-3xl font-bold text-black mt-1">
{total}
</p>

</div>

<div className="bg-white rounded-2xl shadow p-6 border">

<p className="text-gray-500 text-sm">
Deadline Mendekat
</p>

<p className="text-3xl font-bold text-red-600 mt-1">
{hampirDeadline}
</p>

</div>

<div className="bg-white rounded-2xl shadow p-6 border">

<p className="text-gray-500 text-sm">
Status
</p>

<p className="text-lg font-semibold text-green-600 mt-1">
Aktif
</p>

</div>

</div>

{/* GRID TUGAS */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{tugas.map((t)=>{

const deadline = t.deadline ? new Date(t.deadline) : null
const now = new Date()

let statusText = "Masih Lama"
let statusColor = "text-green-600"

if(deadline){

const diff = deadline.getTime() - now.getTime()
const days = Math.floor(diff/(1000*60*60*24))

if(days <= 1){
statusText = "Deadline hari ini"
statusColor = "text-red-600"
}
else if(days <= 3){
statusText = "Segera kerjakan"
statusColor = "text-orange-500"
}

}

return(

<div
key={t.id}
className="bg-white border rounded-3xl shadow hover:shadow-xl transition p-7 flex flex-col justify-between"
>

<div>

<h2 className="text-xl font-bold text-black mb-2">
{t.judul}
</h2>

<p className="text-black text-sm mb-3">
{t.deskripsi}
</p>

<p className="text-sm text-gray-600">
Mata Kuliah:
<span className="text-black font-semibold ml-1">
{t.mata_kuliah}
</span>
</p>

<p className={`text-sm mt-2 font-semibold ${statusColor}`}>
{statusText}
</p>

</div>

<div className="flex justify-between items-center mt-6">

<p className="text-red-500 text-sm">
Deadline:
{deadline ? deadline.toLocaleDateString() : "-"}
</p>

<Link
href={`/dashboard/tugas/${t.id}`}
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
>
Kerjakan
</Link>

</div>

</div>

)

})}

</div>

</div>

)

}
