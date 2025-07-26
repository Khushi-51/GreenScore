"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const data = [
  { name: "Jan", carbon: 520, target: 450 },
  { name: "Feb", carbon: 480, target: 450 },
  { name: "Mar", carbon: 445, target: 450 },
  { name: "Apr", carbon: 425, target: 450 },
  { name: "May", carbon: 410, target: 450 },
  { name: "Jun", carbon: 395, target: 450 },
]

export function CarbonChart() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stone-800">📊 Carbon Footprint Trend</CardTitle>
        <CardDescription className="text-stone-600">Your monthly carbon emissions (kg CO₂) vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
            <XAxis dataKey="name" stroke="#78716c" />
            <YAxis stroke="#78716c" />
            <Tooltip
              formatter={(value, name) => [`${value} kg CO₂`, name === "carbon" ? "Actual" : "Target"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #d6d3d1",
                borderRadius: "8px",
                color: "#44403c",
              }}
            />
            <Line
              type="monotone"
              dataKey="carbon"
              stroke="#0d9488"
              strokeWidth={3}
              dot={{ fill: "#0d9488", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ea580c"
              strokeDasharray="5 5"
              dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
