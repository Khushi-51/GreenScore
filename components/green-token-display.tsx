"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Wallet, TrendingUp, Gift, Zap, CheckCircle, Sparkles } from "lucide-react"
import { useState } from "react"

interface GreenTokenDisplayProps {
  balance: number
  detailed?: boolean
}

const recentTransactions = [
  { id: 1, action: "AC Efficiency Tip Completed", tokens: 10, date: "2024-01-15" },
  { id: 2, action: "Weekly Challenge: Reduce Usage", tokens: 25, date: "2024-01-14" },
  { id: 3, action: "Bill Upload Bonus", tokens: 5, date: "2024-01-13" },
  { id: 4, action: "LED Bulb Installation", tokens: 15, date: "2024-01-12" },
]

const rewards = [
  { name: "Plant a Tree", cost: 50, description: "Fund tree planting in your area" },
  { name: "Solar Panel Discount", cost: 200, description: "10% off solar installation" },
  { name: "Energy Audit", cost: 100, description: "Free home energy assessment" },
  { name: "Green Gadget", cost: 75, description: "Smart power strip or LED bulbs" },
]

export function GreenTokenDisplay({ balance, detailed = false }: GreenTokenDisplayProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          setWalletAddress(address)
          setWalletConnected(true)

          // Award tokens for connecting wallet
          await fetch("/api/tokens/award", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: "current-user-id",
              action: "Wallet Connected",
              tokens: 10,
              metadata: { walletAddress: address },
            }),
          })

          // Update tokens and score
          window.dispatchEvent(
            new CustomEvent("tokensUpdated", {
              detail: {
                tokens: 10,
                action: "Wallet Connected",
                type: "tokens",
              },
            }),
          )
        }
      } else {
        // Show error notification instead of alert
        window.dispatchEvent(
          new CustomEvent("tokensUpdated", {
            detail: {
              tokens: 0,
              action: "Error: MetaMask not detected",
              type: "error",
            },
          }),
        )
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
      // Show error notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Error: Failed to connect wallet",
            type: "error",
          },
        }),
      )
    } finally {
      setIsConnecting(false)
    }
  }

  if (!detailed) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-stone-600">GreenTokens</CardTitle>
          <div className="flex items-center gap-1">
            <Coins className="h-5 w-5 text-orange-600" />
            <Sparkles className="h-3 w-3 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800 mb-2">{balance.toFixed(1)} GRN</div>
          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12% this week
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Token Balance Overview */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Coins className="h-6 w-6" />
            <Sparkles className="h-4 w-4 text-amber-600" />
            GreenToken Wallet
          </CardTitle>
          <CardDescription className="text-stone-600">
            Earn tokens for sustainable actions and redeem for real rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-orange-800 mb-4">{balance.toFixed(1)} GRN</div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-white/90 rounded-lg border border-stone-200">
              <div className="text-lg font-semibold text-stone-800">156.3</div>
              <div className="text-sm text-stone-600">Total Earned</div>
            </div>
            <div className="text-center p-3 bg-white/90 rounded-lg border border-stone-200">
              <div className="text-lg font-semibold text-stone-800">110.6</div>
              <div className="text-sm text-stone-600">Total Redeemed</div>
            </div>
          </div>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`w-full ${walletConnected ? "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"} text-white`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {isConnecting
              ? "Connecting..."
              : walletConnected
                ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
          </Button>

          {walletConnected && (
            <div className="mt-4 p-3 bg-teal-50 rounded-lg text-sm border border-teal-200">
              <div className="flex items-center gap-2 text-teal-800 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Wallet Connected!</span>
              </div>
              <p className="text-teal-700">You can now earn and redeem GreenTokens directly to your wallet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800">
            <Zap className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 hover:shadow-sm transition-all duration-300"
              >
                <div>
                  <div className="font-medium text-sm text-stone-800">{transaction.action}</div>
                  <div className="text-xs text-stone-600">{transaction.date}</div>
                </div>
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">+{transaction.tokens} GRN</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Marketplace */}
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800">
            <Gift className="h-5 w-5 text-purple-600" />
            Rewards Marketplace
          </CardTitle>
          <CardDescription className="text-stone-600">
            Redeem your GreenTokens for real-world environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="border border-stone-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-white to-stone-50/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-stone-800">{reward.name}</h4>
                  <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">
                    {reward.cost} GRN
                  </Badge>
                </div>
                <p className="text-sm text-stone-600">{reward.description}</p>
                <Button
                  size="sm"
                  variant={balance >= reward.cost ? "default" : "secondary"}
                  disabled={balance < reward.cost}
                  className={`w-full ${balance >= reward.cost ? "bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white" : ""}`}
                >
                  {balance >= reward.cost ? "Redeem" : "Insufficient Balance"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
