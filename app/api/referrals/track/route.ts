import { type NextRequest, NextResponse } from "next/server"

// Mock referrals database
const referrals: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { referrerId, newUserId, referralCode } = await request.json()

    // Validate referral code
    if (!referralCode || !referralCode.startsWith("ref-")) {
      return NextResponse.json({ success: false, error: "Invalid referral code" }, { status: 400 })
    }

    // Check if referral already exists
    const existingReferral = referrals.find((r) => r.newUserId === newUserId)
    if (existingReferral) {
      return NextResponse.json({ success: false, error: "User already referred" }, { status: 400 })
    }

    // Create referral record
    const referral = {
      id: Date.now().toString(),
      referrerId,
      newUserId,
      referralCode,
      status: "pending", // pending -> completed -> rewarded
      createdAt: new Date().toISOString(),
      completedAt: null,
      rewardedAt: null,
    }

    referrals.push(referral)

    return NextResponse.json({
      success: true,
      referral,
      message: "Referral tracked successfully!",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to track referral" }, { status: 500 })
  }
}

// Complete referral when new user performs first eco-action
export async function PUT(request: NextRequest) {
  try {
    const { newUserId, action } = await request.json()

    const referral = referrals.find((r) => r.newUserId === newUserId && r.status === "pending")

    if (!referral) {
      return NextResponse.json({ success: false, error: "No pending referral found" }, { status: 404 })
    }

    // Mark referral as completed
    referral.status = "completed"
    referral.completedAt = new Date().toISOString()

    // Award tokens to referrer
    const tokenResponse = await fetch("/api/tokens/award", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: referral.referrerId,
        action: "Successful Referral",
        tokens: 15,
        metadata: {
          referredUserId: newUserId,
          triggerAction: action,
        },
      }),
    })

    if (tokenResponse.ok) {
      referral.status = "rewarded"
      referral.rewardedAt = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      referral,
      tokensAwarded: 15,
      message: "Referral completed and rewards distributed!",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to complete referral" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  const userReferrals = referrals.filter((r) => r.referrerId === userId)
  const totalRewards = userReferrals.filter((r) => r.status === "rewarded").length * 15

  return NextResponse.json({
    success: true,
    referrals: userReferrals,
    stats: {
      total: userReferrals.length,
      pending: userReferrals.filter((r) => r.status === "pending").length,
      completed: userReferrals.filter((r) => r.status === "completed").length,
      rewarded: userReferrals.filter((r) => r.status === "rewarded").length,
      totalRewards,
    },
  })
}
