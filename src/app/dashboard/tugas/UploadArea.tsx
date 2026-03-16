"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { UploadCloud } from "lucide-react"

export default function UploadArea({tugas_id}:any){

const [file,setFile] = useState<any>()

async function upload(){

const {data:user} = await supabase.auth.getUser()

const fileName = Date.now()+"-"+file.name

await supabase.storage
.from("tugas")
.upload(fileName,file)

const url = supabase
.storage
.from("tugas")
.getPublicUrl(fileName).data.publicUrl

await supabase
.from("pengumpulan_tugas")
.insert({

tugas_id,
user_id:user.user?.id,
file_url:url,
status:"dikumpulkan"

})

alert("Tugas berhasil dikumpulkan")

}

return(

<div className="bg-white rounded-2xl shadow p-8">

<h2 className="text-xl font-semibold text-black mb-6">
Upload Tugas
</h2>

<div className="border-2 border-dashed rounded-xl p-10 text-center">

<UploadCloud size={40} className="mx-auto mb-4"/>

<p className="text-black mb-4">
Drag file atau pilih file
</p>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0])}
/>

</div>

<button
onClick={upload}
className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
>
Upload Tugas
</button>

</div>

)

}
