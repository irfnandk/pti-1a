"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Page(){

const params = useParams()
const id = params.id as string

const [tugas,setTugas] = useState<any>(null)
const [file,setFile] = useState<File | null>(null)
const [loading,setLoading] = useState(false)
const [status,setStatus] = useState("")

async function getTugas(){

const { data,error } = await supabase
.from("tugas")
.select("*")
.eq("id",id)
.single()

if(error){
console.log(error)
}

setTugas(data)

}

useEffect(()=>{
getTugas()
},[])

async function upload(){

if(!file){
alert("Pilih file")
return
}

setLoading(true)

const folder = tugas.folder || "umum"
const filePath = `${folder}/${Date.now()}-${file.name}`

const { error:uploadError } = await supabase.storage
.from("tugas")
.upload(filePath,file)

if(uploadError){
console.log(uploadError)
setStatus("Upload gagal")
setLoading(false)
return
}

const { data:urlData } = supabase.storage
.from("tugas")
.getPublicUrl(filePath)

const fileUrl = urlData.publicUrl

const { data:user } = await supabase.auth.getUser()

const { error:dbError } = await supabase
.from("tugas")
.update({

file_url:fileUrl,
user_id:user.user?.id

})
.eq("id",id)

if(dbError){
console.log(dbError)
setStatus("Database gagal disimpan")
setLoading(false)
return
}

setStatus("Tugas berhasil dikumpulkan ✅")
setLoading(false)

}

return(

<div className="max-w-3xl mx-auto p-8">

<h1 className="text-3xl font-bold text-black mb-2">
{tugas?.judul}
</h1>

<p className="text-black mb-2">
{tugas?.deskripsi}
</p>

<p className="text-red-500 mb-6">
Deadline:
{tugas?.deadline && new Date(tugas.deadline).toLocaleDateString()}
</p>

<div className="bg-white border rounded-2xl shadow p-8">

<div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">

<p className="text-black text-lg mb-2">
Upload Tugas
</p>

<p className="text-gray-500 text-sm">
Folder: {tugas?.folder}
</p>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
className="mt-4 text-black"
/>

</div>

<button
onClick={upload}
className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
>

{loading ? "Uploading..." : "Kumpulkan Tugas"}

</button>

{status && (
<p className="text-black mt-4 text-center">
{status}
</p>
)}

</div>

</div>

)

}
