"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Sparkles, X, Coins } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  rewards: {
    tokens: number
    score: number
  }
}

interface AchievementModalProps {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
}

export function AchievementModal({ achievement, isOpen, onClose }: AchievementModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Auto-close after 6 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 6000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-yellow-300"
      case "epic":
        return "bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 border-purple-300"
      case "rare":
        return "bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 border-blue-300"
      default:
        return "bg-gradient-to-br from-gray-500 via-stone-500 to-slate-500 border-gray-300"
    }
  }

  const getRarityBadge = (rarity: string) => {
    const colors = {
      legendary: "bg-yellow-100 text-yellow-800 border-yellow-300",
      epic: "bg-purple-100 text-purple-800 border-purple-300",
      rare: "bg-blue-100 text-blue-800 border-blue-300",
      common: "bg-gray-100 text-gray-800 border-gray-300",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  if (!isOpen || !achievement) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        className={`
          transform transition-all duration-500 ease-out
          ${isVisible ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"}
        `}
      >
        <Card
          className={`
          ${getRarityStyle(achievement.rarity)}
          text-white shadow-2xl border-4 backdrop-blur-sm
          max-w-md w-full relative overflow-hidden
          animate-pulse-subtle
        `}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <Sparkles
                  key={i}
                  className={`
                    absolute animate-ping
                    ${i % 4 === 0 ? "h-2 w-2" : i % 4 === 1 ? "h-3 w-3" : i % 4 === 2 ? "h-1 w-1" : "h-4 w-4"}
                  `}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 z-10"
          >
            <X className="h-4 w-4" />
          </button>

          <CardContent className="p-8 text-center relative z-10">
            {/* Achievement Icon */}
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <span className="text-4xl">{achievement.icon}</span>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center animate-spin-slow">
                  <Star className="h-4 w-4 text-yellow-300" />
                </div>
              </div>
            </div>

            {/* Achievement Title */}
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">🎉 Achievement Unlocked!</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">{achievement.title}</h3>

            {/* Rarity Badge */}
            <Badge className={`${getRarityBadge(achievement.rarity)} mb-4 text-xs font-bold uppercase tracking-wider`}>
              {achievement.rarity}
            </Badge>

            {/* Description */}
            <p className="text-white/80 mb-6 leading-relaxed">{achievement.description}</p>

            {/* Rewards */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold">+{achievement.rewards.tokens} GRN</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">+{achievement.rewards.score} Score</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm font-semibold px-8 py-2"
            >
              Awesome! 🚀
            </Button>
          </CardContent>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/40 transition-all duration-100 ease-linear"
              style={{
                animation: "progressBar 6000ms linear forwards",
              }}
            ></div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Hook to trigger achievements
export function useAchievements() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const triggerAchievement = (achievementData: Partial<Achievement>) => {
    const achievement: Achievement = {
      id: Date.now().toString(),
      title: achievementData.title || "Great Job!",
      description: achievementData.description || "You've completed an eco-action!",
      icon: achievementData.icon || "🏆",
      rarity: achievementData.rarity || "common",
      rewards: achievementData.rewards || { tokens: 10, score: 20 },
      ...achievementData,
    }

    setCurrentAchievement(achievement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentAchievement(null)
  }

  return {
    currentAchievement,
    isModalOpen,
    triggerAchievement,
    closeModal,
  }
}
