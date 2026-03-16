"use client"

import { useEffect,useState,useRef } from "react"
import { supabase } from "@/lib/supabase"

export default function JadwalPage(){

const [jadwal,setJadwal] = useState<any[]>([])
const [allTugas,setAllTugas] = useState<any[]>([])
const [tugas,setTugas] = useState<any[]>([])
const [selected,setSelected] = useState("")
const [file,setFile] = useState<any>(null)

const tugasRef = useRef<HTMLDivElement>(null)

useEffect(()=>{
getJadwal()
getAllTugas()
},[])

/* AMBIL JADWAL */

async function getJadwal(){

const {data} = await supabase
.from("jadwal_kuliah")
.select("*")
.order("hari")

setJadwal(data || [])

}

/* AMBIL SEMUA TUGAS (UNTUK BADGE) */

async function getAllTugas(){

const {data} = await supabase
.from("tugas")
.select("*")

setAllTugas(data || [])

}

/* AMBIL TUGAS PER MATKUL */

async function getTugas(matkul:string){

setSelected(matkul)

const {data} = await supabase
.from("tugas")
.select("*")
.eq("mata_kuliah",matkul)
.order("deadline",{ascending:true})

setTugas(data || [])

setTimeout(()=>{
tugasRef.current?.scrollIntoView({
behavior:"smooth"
})
},200)

}

/* UPLOAD */

async function uploadTugas(id:string,matkul:string){

if(!file){
alert("Pilih file dulu")
return
}

const folder = matkul.toLowerCase().replaceAll(" ","_")
const filename = `${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("tugas")
.upload(`${folder}/${filename}`,file)

if(error){
alert("Upload gagal")
return
}

const {data:urlData} = supabase.storage
.from("tugas")
.getPublicUrl(`${folder}/${filename}`)

await supabase
.from("tugas")
.update({
file_url:urlData.publicUrl,
status:"sudah"
})
.eq("id",id)

alert("Tugas berhasil dikumpulkan")

getTugas(matkul)
getAllTugas()

}

/* PROGRESS */

const totalTugas = tugas.length
const selesai = tugas.filter(t => t.status === "sudah").length
const belum = totalTugas - selesai
const progress = totalTugas === 0 ? 0 : Math.round((selesai/totalTugas)*100)

return(

<div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 text-black">

{/* HEADER */}

<div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 md:p-8 rounded-xl shadow">

<h1 className="text-2xl md:text-3xl font-bold">
Jadwal Kuliah
</h1>

<p className="text-sm opacity-90">
Lihat jadwal dan kumpulkan tugas
</p>

</div>

{/* JADWAL */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

{jadwal.map((j)=>{

const jumlahTugas = allTugas.filter(
t => t.mata_kuliah === j.mata_kuliah
).length

return(

<div
key={j.id}
className="bg-white border rounded-xl p-5 shadow-sm space-y-3"
>

<div className="flex justify-between items-start">

<div className="text-base md:text-lg font-semibold">
{j.mata_kuliah}
</div>

<div className="text-xs bg-gray-100 px-2 py-1 rounded">
{jumlahTugas} tugas
</div>

</div>

<div className="text-sm">
{j.hari}
</div>

<div className="text-sm text-gray-600">
{j.jam_mulai} - {j.jam_selesai}
</div>

<div className="text-sm text-gray-500">
{j.ruang}
</div>

<div className="text-sm text-gray-500">
{j.dosen}
</div>

<button
onClick={()=>getTugas(j.mata_kuliah)}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
>
Lihat Tugas
</button>

</div>

)

})}

</div>

{/* TUGAS */}

{selected && (

<div ref={tugasRef} className="space-y-8">

<h2 className="text-xl md:text-2xl font-semibold">
Tugas {selected}
</h2>

{/* PROGRESS */}

<div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">

<div className="flex justify-between text-xs md:text-sm">

<div>Total : {totalTugas}</div>
<div>Sudah : {selesai}</div>
<div>Belum : {belum}</div>

</div>

<div className="w-full bg-gray-200 rounded-full h-3">

<div
className="bg-blue-600 h-3 rounded-full"
style={{width:`${progress}%`}}
></div>

</div>

<div className="text-xs md:text-sm text-gray-600">
Progress {progress}%
</div>

</div>

{/* LIST TUGAS */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

{tugas.map((t)=>{

const statusColor =
t.status === "sudah"
? "text-green-600"
: "text-red-500"

return(

<div
key={t.id}
className="bg-white border rounded-xl p-5 space-y-3 shadow-sm"
>

<div className="text-base md:text-lg font-semibold">
{t.judul}
</div>

<div className="text-sm text-gray-600">
{t.deskripsi}
</div>

<div className="text-sm text-gray-500">
Deadline :
{t.deadline
? new Date(t.deadline).toLocaleDateString()
: "-"
}
</div>

<div className={`text-sm font-medium ${statusColor}`}>
Status : {t.status}
</div>

{t.status !== "sudah" && (

<div className="space-y-2">

<input
type="file"
className="text-sm w-full"
onChange={(e)=>setFile(e.target.files?.[0])}
/>

<button
onClick={()=>uploadTugas(t.id,t.mata_kuliah)}
className="bg-blue-600 w-full text-white py-2 rounded-lg text-sm"
>
Upload Tugas
</button>

</div>

)}

{t.file_url &&(

<a
href={t.file_url}
target="_blank"
className="text-blue-600 text-sm"
>
Lihat File
</a>

)}

</div>

)

})}

</div>

</div>

)}

</div>

)

}
