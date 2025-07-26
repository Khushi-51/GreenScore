"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Trophy, Zap, CheckCircle, Sparkles, X, Award } from "lucide-react"

interface Notification {
  id: string
  type: "score" | "tokens" | "achievement" | "challenge" | "tip" | "error" | "success"
  title: string
  message: string
  tokens?: number
  score?: number
  icon?: React.ReactNode
  duration?: number
}

interface NotificationItemProps {
  notification: Notification
  onClose: (id: string) => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100)

    // Auto-close after duration
    const timer = setTimeout(() => {
      handleClose()
    }, notification.duration || 4000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(notification.id)
    }, 300)
  }

  const getNotificationStyle = () => {
    switch (notification.type) {
      case "score":
        return "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 border-amber-300"
      case "tokens":
        return "bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 border-teal-300"
      case "achievement":
        return "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 border-purple-300"
      case "challenge":
        return "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 border-blue-300"
      case "tip":
        return "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 border-orange-300"
      case "error":
        return "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 border-red-300"
      case "success":
        return "bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 border-green-300"
      default:
        return "bg-gradient-to-r from-stone-500 via-gray-500 to-slate-500 border-stone-300"
    }
  }

  const getIcon = () => {
    if (notification.icon) return notification.icon

    switch (notification.type) {
      case "score":
        return <Trophy className="h-5 w-5" />
      case "tokens":
        return <Coins className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      case "challenge":
        return <Zap className="h-5 w-5" />
      case "tip":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <X className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100 scale-100"
            : isLeaving
              ? "translate-x-full opacity-0 scale-95"
              : "translate-x-full opacity-0 scale-95"
        }
      `}
    >
      <Card
        className={`
          ${getNotificationStyle()}
          text-white shadow-2xl border-2 backdrop-blur-sm
          hover:shadow-3xl transition-all duration-300
          animate-pulse-subtle cursor-pointer group
          min-w-[320px] max-w-[400px]
        `}
        onClick={handleClose}
      >
        <div className="p-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-6 translate-y-6"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <X className="h-3 w-3" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 p-2 bg-white/20 rounded-full backdrop-blur-sm">{getIcon()}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm truncate">{notification.title}</h4>
                <Sparkles className="h-3 w-3 animate-spin" />
              </div>

              <p className="text-xs opacity-90 mb-2 leading-relaxed">{notification.message}</p>

              {/* Rewards Display */}
              <div className="flex items-center gap-2 flex-wrap">
                {notification.tokens && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-2 py-1">
                    <Coins className="h-3 w-3 mr-1" />+{notification.tokens} GRN
                  </Badge>
                )}
                {notification.score && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-2 py-1">
                    <Trophy className="h-3 w-3 mr-1" />+{notification.score} Score
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/40 transition-all duration-100 ease-linear animate-progress-bar"
              style={{
                animation: `progressBar ${notification.duration || 4000}ms linear forwards`,
              }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { tokens, action, score, type = "score" } = event.detail

      // Calculate score if not provided
      const calculatedScore = score || (tokens ? tokens * 2 : 0)

      const notification: Notification = {
        id: Date.now().toString(),
        type: type,
        title: getNotificationTitle(action, type),
        message: getNotificationMessage(action, tokens, calculatedScore),
        tokens: tokens,
        score: calculatedScore,
        duration: 5000,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 2)]) // Keep max 3 notifications

      // Add celebration effect
      if (calculatedScore >= 50) {
        triggerCelebration()
      }
    }

    window.addEventListener("tokensUpdated", handleNotification as EventListener)

    return () => {
      window.removeEventListener("tokensUpdated", handleNotification as EventListener)
    }
  }, [])

  const getNotificationTitle = (action: string, type: string) => {
    if (type === "error") return "❌ Oops!"
    if (type === "success") return "✅ Success!"
    if (action?.includes("Tip Completed")) return "🎯 Eco Tip Mastered!"
    if (action?.includes("Challenge")) return "🏆 Challenge Conquered!"
    if (action?.includes("Wallet Connected")) return "💰 Wallet Connected!"
    if (action?.includes("Bill Upload")) return "📄 Bill Analyzed!"
    if (action?.includes("Setup Completed")) return "⚡ Setup Complete!"
    return "🌱 Great Job!"
  }

  const getNotificationMessage = (action: string, tokens: number, score: number) => {
    const messages = [
      "You're making the planet greener! 🌍",
      "Sustainability level up! Keep going! 🚀",
      "Your eco-impact is growing! 🌱",
      "Amazing progress on your green journey! ✨",
      "You're an environmental champion! 🏆",
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  const triggerCelebration = () => {
    // Create confetti effect
    const colors = ["#f59e0b", "#ea580c", "#0d9488", "#3b82f6", "#8b5cf6"]

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.style.cssText = `
          position: fixed;
          top: 20%;
          left: ${Math.random() * 100}%;
          width: 8px;
          height: 8px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: confettiFall 3s ease-out forwards;
        `
        document.body.appendChild(confetti)

        setTimeout(() => confetti.remove(), 3000)
      }, i * 50)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <>
      {/* Notification Container */}
      <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem notification={notification} onClose={removeNotification} />
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes progressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  )
}
