import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface EnergyStatsCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export function EnergyStatsCard({ title, value, change, icon }: EnergyStatsCardProps) {
  const isPositive = change.startsWith("+")
  const isNegative = change.startsWith("-")

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-600">{title}</CardTitle>
        <div className="text-amber-700">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-stone-800 mb-2">{value}</div>
        <Badge
          variant={isNegative ? "default" : isPositive ? "secondary" : "outline"}
          className={`text-xs ${
            isNegative
              ? "bg-teal-100 text-teal-800 hover:bg-teal-100"
              : isPositive
                ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                : ""
          }`}
        >
          {isNegative ? (
            <TrendingDown className="h-3 w-3 mr-1" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : null}
          {change} from last month
        </Badge>
      </CardContent>
    </Card>
  )
}
