"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DokumentasiGallery() {

  const [kegiatan,setKegiatan] = useState<any[]>([]);
  const [preview,setPreview] = useState<any>(null);
  const [filter,setFilter] = useState("semua");

  useEffect(()=>{
    loadData();
  },[]);

  async function loadData(){

    const { data } = await supabase
      .from("dokumentasi_kegiatan")
      .select(`
        *,
        dokumentasi_file(*)
      `)
      .order("tanggal",{ascending:false});

    setKegiatan(data || []);
  }

  const kategori = [
    "semua",
    ...new Set(kegiatan.map((k)=>k.kategori))
  ];

  return(

    <section className="max-w-7xl mx-auto py-20 px-6">

      <h2 className="text-3xl font-bold text-center mb-10">
        Dokumentasi Kegiatan
      </h2>

      {/* FILTER */}

      <div className="flex flex-wrap gap-3 justify-center mb-12">

        {kategori.map((k)=>(
          <button
            key={k}
            onClick={()=>setFilter(k)}
            className={`px-4 py-2 rounded-full text-sm border
            ${filter===k ? "bg-black text-white" : "bg-white"}
            `}
          >
            {k}
          </button>
        ))}

      </div>

      {/* KEGIATAN */}

      <div className="space-y-16">

        {kegiatan
        .filter((k)=> filter==="semua" || k.kategori===filter)
        .map((k)=>(

          <div key={k.id}>

            <div className="mb-5">

              <h3 className="text-xl font-semibold">
                {k.judul}
              </h3>

              <p className="text-gray-600 text-sm">
                {k.deskripsi}
              </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {k.dokumentasi_file.map((f:any)=>(
                
                <div
                  key={f.id}
                  className="relative group cursor-pointer"
                >

                  {f.tipe === "foto" ? (

                    <img
                      src={f.file_url}
                      loading="lazy"
                      className="rounded-lg object-cover h-40 w-full"
                      onClick={()=>setPreview(f)}
                    />

                  ) : (

                    <video
                      src={f.file_url}
                      className="rounded-lg h-40 w-full object-cover"
                    />

                  )}

                  <a
                    href={f.file_url}
                    download
                    className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Download
                  </a>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

      {/* LIGHTBOX */}

      {preview && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="max-w-4xl w-full px-6">

            {preview.tipe==="foto" ? (

              <img
                src={preview.file_url}
                className="rounded-lg"
              />

            ):(

              <video
                src={preview.file_url}
                controls
                autoPlay
                className="rounded-lg"
              />

            )}

            <button
              onClick={()=>setPreview(null)}
              className="text-white mt-4"
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </section>
  )
}