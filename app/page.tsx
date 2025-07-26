"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Leaf, Zap, Trophy, TrendingUp, Coins, Upload, Brain, Users, Sparkles } from "lucide-react"
import { EnergyStatsCard } from "@/components/energy-stats-card"
import { CarbonChart } from "@/components/carbon-chart"
import { TipBox } from "@/components/tip-box"
import { GreenTokenDisplay } from "@/components/green-token-display"
import { ApplianceSetup } from "@/components/appliance-setup"
import { BillUpload } from "@/components/bill-upload"
import { Leaderboard } from "@/components/leaderboard"
import { AuthModal } from "@/components/auth-modal"
import { NotificationSystem } from "@/components/notification-system"
import { AchievementModal, useAchievements } from "@/components/achievement-modal"

export default function GreenScoreDashboard() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [greenScore, setGreenScore] = useState(1250)
  const [tokenBalance, setTokenBalance] = useState(45.7)
  const [energyData, setEnergyData] = useState({
    dailyUsage: 28.5,
    monthlyUsage: 855,
    carbonFootprint: 425.5,
    efficiency: 78,
  })

  const { currentAchievement, isModalOpen, triggerAchievement, closeModal } = useAchievements()

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("greenScoreUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    // Listen for token updates from completed actions
    const handleTokenUpdate = (event: CustomEvent) => {
      const { tokens, action } = event.detail
      setTokenBalance((prev) => prev + tokens)

      // Calculate score increase based on action type
      let scoreIncrease = 0
      if (action?.includes("Tip Completed")) scoreIncrease = tokens * 2
      else if (action?.includes("Challenge")) scoreIncrease = tokens * 3
      else if (action?.includes("Bill Upload")) scoreIncrease = tokens * 1.5
      else if (action?.includes("Wallet Connected")) scoreIncrease = tokens * 2
      else if (action?.includes("Setup Completed")) scoreIncrease = tokens * 2
      else scoreIncrease = tokens * 2 // Default multiplier

      const finalScore = Math.round(scoreIncrease)
      setGreenScore((prev) => prev + finalScore)

      // Check for achievements
      checkForAchievements(greenScore + finalScore, tokenBalance + tokens, action)
    }

    window.addEventListener("tokensUpdated", handleTokenUpdate as EventListener)

    return () => {
      window.removeEventListener("tokensUpdated", handleTokenUpdate as EventListener)
    }
  }, [greenScore, tokenBalance])

  const checkForAchievements = (newScore: number, newTokens: number, action: string) => {
    // First eco action
    if (newScore >= 1270 && greenScore < 1270) {
      triggerAchievement({
        title: "First Steps",
        description: "You've taken your first step towards sustainability!",
        icon: "🌱",
        rarity: "common",
        rewards: { tokens: 5, score: 10 },
      })
    }

    // Score milestones
    if (newScore >= 1500 && greenScore < 1500) {
      triggerAchievement({
        title: "Rising Eco-Warrior",
        description: "You've reached 1500 GreenScore points!",
        icon: "⭐",
        rarity: "rare",
        rewards: { tokens: 15, score: 30 },
      })
    }

    if (newScore >= 2000 && greenScore < 2000) {
      triggerAchievement({
        title: "Sustainability Champion",
        description: "Amazing! 2000 GreenScore points achieved!",
        icon: "🏆",
        rarity: "epic",
        rewards: { tokens: 25, score: 50 },
      })
    }

    // Token milestones
    if (newTokens >= 100 && tokenBalance < 100) {
      triggerAchievement({
        title: "Token Collector",
        description: "You've earned 100 GreenTokens!",
        icon: "💰",
        rarity: "rare",
        rewards: { tokens: 10, score: 25 },
      })
    }

    // Action-specific achievements
    if (action?.includes("Tip Completed")) {
      // Could track tip completion count and award achievements
    }
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("greenScoreUser", JSON.stringify(userData))
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("greenScoreUser")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Leaf className="h-16 w-16 text-amber-700 mr-3" />
                <Sparkles className="h-6 w-6 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700 bg-clip-text text-transparent">
                GreenScore
              </h1>
            </div>
            <p className="text-xl text-stone-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your energy habits with AI-powered insights, gamification, and blockchain rewards. Make
              sustainability fun and profitable! 🌱
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-amber-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <Brain className="h-10 w-10 text-amber-700 mx-auto mb-3" />
                  <CardTitle className="text-lg text-stone-800">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-stone-600">Smart energy insights and personalized eco-tips</p>
                </CardContent>
              </Card>
              <Card className="border-teal-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <Coins className="h-10 w-10 text-teal-700 mx-auto mb-3" />
                  <CardTitle className="text-lg text-stone-800">Blockchain Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-stone-600">Earn GreenTokens for sustainable actions</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <Trophy className="h-10 w-10 text-blue-700 mx-auto mb-3" />
                  <CardTitle className="text-lg text-stone-800">Gamification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-stone-600">Compete with friends and climb leaderboards</p>
                </CardContent>
              </Card>
            </div>
            <Button
              onClick={() => setShowAuth(true)}
              size="lg"
              className="bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 hover:from-amber-800 hover:via-orange-700 hover:to-yellow-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started - Join the Green Revolution!
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Leaf className="h-10 w-10 text-amber-700" />
                <Sparkles className="h-4 w-4 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700 bg-clip-text text-transparent">
                GreenScore
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-amber-800 border-amber-300 bg-amber-50 transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                <Trophy className="h-4 w-4 mr-1" />
                Score: {greenScore.toLocaleString()}
              </Badge>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-stone-300 hover:bg-stone-50 bg-transparent text-stone-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-2">Welcome back, {user.name || "Eco Warrior"}! 🌱</h2>
          <p className="text-stone-600 text-lg">Your sustainable journey continues. Let's make today even greener!</p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm border border-amber-100 shadow-sm">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 text-stone-600"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="setup"
              className="flex items-center gap-2 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800 text-stone-600"
            >
              <Zap className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 text-stone-600"
            >
              <Upload className="h-4 w-4" />
              Bills
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 text-stone-600"
            >
              <Coins className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 text-stone-600"
            >
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnergyStatsCard
                title="Daily Usage"
                value={`${energyData.dailyUsage} kWh`}
                change="-12%"
                icon={<Zap className="h-5 w-5" />}
              />
              <EnergyStatsCard
                title="Carbon Footprint"
                value={`${energyData.carbonFootprint} kg CO₂`}
                change="-8%"
                icon={<Leaf className="h-5 w-5" />}
              />
              <EnergyStatsCard
                title="Efficiency Score"
                value={`${energyData.efficiency}%`}
                change="+15%"
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <GreenTokenDisplay balance={tokenBalance} />
            </div>

            {/* Charts and Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CarbonChart />
              <TipBox />
            </div>

            {/* Progress Tracking */}
            <Card className="bg-white/90 backdrop-blur-sm border-amber-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  Monthly Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">Reduce Energy Usage</span>
                    <span className="text-sm text-stone-600">78%</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">Carbon Footprint Reduction</span>
                    <span className="text-sm text-stone-600">65%</span>
                  </div>
                  <Progress value={65} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">Green Actions Completed</span>
                    <span className="text-sm text-stone-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <ApplianceSetup />
          </TabsContent>

          <TabsContent value="upload">
            <BillUpload />
          </TabsContent>

          <TabsContent value="rewards">
            <GreenTokenDisplay balance={tokenBalance} detailed />
          </TabsContent>

          <TabsContent value="community">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification System */}
      <NotificationSystem />

      {/* Achievement Modal */}
      <AchievementModal achievement={currentAchievement} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
