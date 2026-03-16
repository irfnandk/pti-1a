"use client";

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function DokumentasiPage() {

  const [data,setData] = useState<any[]>([]);
  const [preview,setPreview] = useState<any>(null);

  useEffect(()=>{
    loadData();
  },[]);

  async function loadData(){

    const res = await fetch("/api/dokumentasi");
    const json = await res.json();

    setData(json);

  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold text-black mb-12">
        Dokumentasi Kegiatan
      </h1>

      <div className="space-y-16">

        {data.map((kegiatan,i)=>(

          <div key={i}>

            <h2 className="text-xl font-semibold mb-6 capitalize text-black">
              {kegiatan.judul}
            </h2>

            <Swiper
              modules={[Navigation,Pagination,Autoplay]}
              navigation
              pagination={{clickable:true}}
              autoplay={{delay:2500}}
              spaceBetween={20}
              slidesPerView={1}

              breakpoints={{
                640:{slidesPerView:2},
                1024:{slidesPerView:3},
                1280:{slidesPerView:4}
              }}
            >

              {kegiatan.files.map((file:string,index:number)=>{

                const video = file.endsWith(".mp4");

                return(

                  <SwiperSlide key={index}>

                    <div
                      className="relative group cursor-pointer"
                      onClick={()=>setPreview(file)}
                    >

                      {video ? (

                        <video
                          src={file}
                          className="h-52 w-full object-cover rounded-xl"
                        />

                      ) : (

                        <img
                          src={file}
                          className="h-52 w-full object-cover rounded-xl transition group-hover:scale-105"
                        />

                      )}

                      <a
                        href={file}
                        download
                        className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        Download
                      </a>

                    </div>

                  </SwiperSlide>

                );

              })}

            </Swiper>

          </div>

        ))}

      </div>

      {preview && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="max-w-4xl w-full px-6">

            {preview.endsWith(".mp4") ? (

              <video
                src={preview}
                controls
                autoPlay
                className="rounded-lg w-full"
              />

            ) : (

              <img
                src={preview}
                className="rounded-lg w-full"
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

    </div>

  );
}