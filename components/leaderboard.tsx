"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, TrendingUp, Users, Zap, Leaf, Coins } from "lucide-react"
import { useState } from "react"

const leaderboardData = [
  {
    rank: 1,
    name: "EcoWarrior2024",
    score: 2850,
    tokens: 156.7,
    reduction: 35,
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🏆 Carbon Crusher",
  },
  {
    rank: 2,
    name: "GreenGuru",
    score: 2720,
    tokens: 142.3,
    reduction: 32,
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🥈 Energy Saver",
  },
  {
    rank: 3,
    name: "SustainableSam",
    score: 2650,
    tokens: 138.9,
    reduction: 30,
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🥉 Eco Champion",
  },
  {
    rank: 4,
    name: "ClimateHero",
    score: 2580,
    tokens: 134.2,
    reduction: 28,
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🌱 Green Pioneer",
  },
  {
    rank: 5,
    name: "You",
    score: 1250,
    tokens: 45.7,
    reduction: 15,
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🌿 Rising Star",
    isCurrentUser: true,
  },
]

const challenges = [
  {
    id: 1,
    title: "Energy Reduction Challenge",
    description: "Reduce your energy usage by 20% this month",
    participants: 1247,
    reward: 50,
    timeLeft: "12 days",
    progress: 65,
    icon: <Zap className="h-5 w-5 text-yellow-600" />,
  },
  {
    id: 2,
    title: "Carbon Footprint Challenge",
    description: "Lower your carbon emissions by 25%",
    participants: 892,
    reward: 75,
    timeLeft: "8 days",
    progress: 42,
    icon: <Leaf className="h-5 w-5 text-green-600" />,
  },
  {
    id: 3,
    title: "Appliance Efficiency Challenge",
    description: "Optimize 5 appliances for better efficiency",
    participants: 634,
    reward: 30,
    timeLeft: "15 days",
    progress: 80,
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
  },
]

export function Leaderboard() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([])

  const handleInviteFriends = () => {
    setInviteModalOpen(true)
  }

  const shareInviteLink = async (platform: string) => {
    const inviteLink = `https://greenscore.app/invite?ref=user123`
    const message =
      "🌱 Join me on GreenScore! Earn rewards for sustainable living and help save the planet. Use my referral link:"

    if (platform === "copy") {
      await navigator.clipboard.writeText(`${message} ${inviteLink}`)
      // Show success notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Invite link copied to clipboard!",
            type: "success",
          },
        }),
      )
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(inviteLink)}`,
        "_blank",
      )
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${message} ${inviteLink}`)}`, "_blank")
    } else if (platform === "email") {
      window.open(`mailto:?subject=Join GreenScore&body=${encodeURIComponent(`${message} ${inviteLink}`)}`, "_blank")
    }
  }

  const joinChallenge = async (challengeId: number) => {
    try {
      const response = await fetch("/api/challenges/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "current-user-id",
          challengeId: challengeId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setJoinedChallenges([...joinedChallenges, challengeId])

        // Award tokens for joining challenge
        await fetch("/api/tokens/award", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "current-user-id",
            action: "Challenge Joined",
            tokens: 5,
            metadata: { challengeId },
          }),
        })

        // Update tokens and score
        window.dispatchEvent(
          new CustomEvent("tokensUpdated", {
            detail: {
              tokens: 5,
              action: "Challenge Joined",
              type: "challenge",
            },
          }),
        )
      }
    } catch (error) {
      console.error("Failed to join challenge:", error)
      // Show error notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Error: Failed to join challenge",
            type: "error",
          },
        }),
      )
    }
  }

  const followUser = async (userId: string) => {
    try {
      const response = await fetch("/api/social/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: "current-user-id",
          followingId: userId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Show success notification instead of alert
        window.dispatchEvent(
          new CustomEvent("tokensUpdated", {
            detail: {
              tokens: 0,
              action: "Now following user!",
              type: "success",
            },
          }),
        )
      }
    } catch (error) {
      console.error("Failed to follow user:", error)
      // Show error notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Error: Failed to follow user",
            type: "error",
          },
        }),
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            GreenScore Community
          </CardTitle>
          <CardDescription>Join thousands of eco-warriors making a difference together</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12,847</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.3M</div>
              <div className="text-sm text-gray-600">kWh Saved</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.1M</div>
              <div className="text-sm text-gray-600">kg CO₂ Reduced</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">45.7K</div>
              <div className="text-sm text-gray-600">Trees Planted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>Top eco-warriors ranked by GreenScore points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  user.isCurrentUser ? "bg-green-50 border-green-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                    {user.rank === 1 && <Trophy className="h-4 w-4 text-yellow-600" />}
                    {user.rank === 2 && <Medal className="h-4 w-4 text-gray-400" />}
                    {user.rank === 3 && <Award className="h-4 w-4 text-amber-600" />}
                    {user.rank > 3 && <span className="text-sm font-bold text-gray-600">#{user.rank}</span>}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{user.badge}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">{user.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    {user.tokens} GRN • {user.reduction}% reduction
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Active Challenges
          </CardTitle>
          <CardDescription>Join community challenges to earn extra GreenTokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {challenge.icon}
                    <div>
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{challenge.reward} GRN</Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{challenge.participants.toLocaleString()} participants</span>
                  <span>{challenge.timeLeft} left</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  key={challenge.id}
                  onClick={() => joinChallenge(challenge.id)}
                  disabled={joinedChallenges.includes(challenge.id)}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {joinedChallenges.includes(challenge.id) ? "✅ Joined" : "Join Challenge"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Friends & Social */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Friends & Social
          </CardTitle>
          <CardDescription>Connect with friends and share your eco journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">John Doe</div>
                  <div className="text-xs text-gray-600">Reduced energy by 22%</div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Following
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">Sarah Miller</div>
                  <div className="text-xs text-gray-600">Earned 25 GRN today</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => followUser("user-id")}>
                Follow
              </Button>
            </div>

            <Button onClick={handleInviteFriends} className="w-full bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        </CardContent>
      </Card>
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Invite Friends to GreenScore</h3>
              <Button variant="ghost" size="sm" onClick={() => setInviteModalOpen(false)}>
                ✕
              </Button>
            </div>

            <p className="text-gray-600 mb-4">
              Share GreenScore with friends and earn 15 GreenTokens for each successful referral!
            </p>

            <div className="space-y-3">
              <Button onClick={() => shareInviteLink("copy")} className="w-full" variant="outline">
                📋 Copy Invite Link
              </Button>
              <Button
                onClick={() => shareInviteLink("whatsapp")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                📱 Share on WhatsApp
              </Button>
              <Button
                onClick={() => shareInviteLink("twitter")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                🐦 Share on Twitter
              </Button>
              <Button
                onClick={() => shareInviteLink("email")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                📧 Share via Email
              </Button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-yellow-800">
                <Coins className="h-4 w-4" />
                <span className="font-medium">Referral Rewards</span>
              </div>
              <p className="text-yellow-700 mt-1">
                Earn 15 GRN for each friend who joins and completes their first eco-action!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
