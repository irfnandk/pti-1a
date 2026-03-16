"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

export default function TugasCard({tugas}:any){

return(

<div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border">

<div className="flex items-center gap-3 mb-4">

<div className="bg-blue-100 p-3 rounded-lg">
<FileText size={22}/>
</div>

<div>

<h2 className="font-semibold text-black text-lg">
{tugas.judul}
</h2>

<p className="text-sm text-black">
{tugas.mata_kuliah}
</p>

</div>

</div>

<p className="text-black mb-4">
{tugas.deskripsi}
</p>

<div className="flex justify-between items-center">

<span className="text-sm text-red-500 font-medium">
Deadline:
{new Date(tugas.deadline).toLocaleDateString()}
</span>

<Link
href={`/dashboard/tugas/${tugas.id}`}
className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
Lihat
</Link>

</div>

</div>

)

}
