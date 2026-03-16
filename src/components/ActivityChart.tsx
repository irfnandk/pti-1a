"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ActivityChart({data}:any){

return(

<div className="bg-white p-6 rounded-2xl shadow">

<h2 className="text-lg font-bold mb-4">

Aktivitas Mahasiswa

</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={data}>

<XAxis dataKey="name"/>

<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#000"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

)

}
