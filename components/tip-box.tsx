"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, CheckCircle, Coins, RefreshCw, Sparkles } from "lucide-react"

const aiTips = [
  {
    id: 1,
    category: "AC Efficiency",
    tip: "Set your AC to 24°C instead of 22°C. This can reduce energy consumption by up to 20%.",
    impact: "Save 15 kWh/month",
    tokens: 10,
    difficulty: "Easy",
  },
  {
    id: 2,
    category: "Lighting",
    tip: "Replace remaining incandescent bulbs with LED. LEDs use 75% less energy.",
    impact: "Save 8 kWh/month",
    tokens: 15,
    difficulty: "Easy",
  },
  {
    id: 3,
    category: "Appliances",
    tip: "Unplug electronics when not in use. Phantom loads account for 5-10% of energy use.",
    impact: "Save 12 kWh/month",
    tokens: 8,
    difficulty: "Easy",
  },
  {
    id: 4,
    category: "Water Heating",
    tip: "Lower water heater temperature to 120°F (49°C) for optimal efficiency.",
    impact: "Save 25 kWh/month",
    tokens: 20,
    difficulty: "Medium",
  },
]

export function TipBox() {
  const [currentTips, setCurrentTips] = useState(aiTips.slice(0, 3))
  const [completedTips, setCompletedTips] = useState<number[]>([])

  const refreshTips = () => {
    const shuffled = [...aiTips].sort(() => 0.5 - Math.random())
    setCurrentTips(shuffled.slice(0, 3))
  }

  const completeTip = async (tipId: number, tokens: number) => {
    try {
      const tipCategory = currentTips.find((t) => t.id === tipId)?.category

      // Award tokens for completing tip
      const response = await fetch("/api/tokens/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "current-user-id",
          action: `Eco Tip Completed: ${tipCategory}`,
          tokens: tokens,
          metadata: {
            tipId: tipId,
            tipCategory: tipCategory,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCompletedTips([...completedTips, tipId])

        // Show success message with animation
        const tipElement = document.querySelector(`[data-tip-id="${tipId}"]`)
        if (tipElement) {
          tipElement.classList.add("animate-pulse")
          setTimeout(() => tipElement.classList.remove("animate-pulse"), 1000)
        }

        // Update user's total token balance and score
        window.dispatchEvent(
          new CustomEvent("tokensUpdated", {
            detail: {
              tokens,
              action: `Eco Tip Completed: ${tipCategory}`,
              type: "tip",
            },
          }),
        )
      }
    } catch (error) {
      console.error("Failed to complete tip:", error)
      // Show error notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Error: Failed to complete tip",
            type: "error",
          },
        }),
      )
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-stone-800">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              <Sparkles className="h-4 w-4 text-amber-600" />
              AI-Powered Eco Tips
            </CardTitle>
            <CardDescription className="text-stone-600">
              Personalized suggestions based on your energy usage patterns
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTips}
            className="border-stone-300 hover:bg-stone-50 bg-transparent text-stone-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTips.map((tip) => (
          <div
            key={tip.id}
            className="border border-stone-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-white to-stone-50/50 hover:shadow-md transition-all duration-300"
            data-tip-id={tip.id}
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">
                {tip.category}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  tip.difficulty === "Easy"
                    ? "border-teal-400 text-teal-800 bg-teal-50"
                    : tip.difficulty === "Medium"
                      ? "border-orange-400 text-orange-800 bg-orange-50"
                      : "border-red-400 text-red-800 bg-red-50"
                }`}
              >
                {tip.difficulty}
              </Badge>
            </div>

            <p className="text-sm text-stone-700">{tip.tip}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-stone-600">
                <span className="flex items-center gap-1">⚡ {tip.impact}</span>
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3 text-orange-600" />
                  {tip.tokens} GRN
                </span>
              </div>

              {completedTips.includes(tip.id) ? (
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => completeTip(tip.id, tip.tokens)}
                  className="bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
