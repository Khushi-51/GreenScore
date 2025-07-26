import { type NextRequest, NextResponse } from "next/server"

// Mock challenges database
const challenges = [
  {
    id: 1,
    title: "Energy Reduction Challenge",
    description: "Reduce your energy usage by 20% this month",
    participants: 1247,
    reward: 50,
    timeLeft: "12 days",
    requirements: { energyReduction: 20 },
  },
  {
    id: 2,
    title: "Carbon Footprint Challenge",
    description: "Lower your carbon emissions by 25%",
    participants: 892,
    reward: 75,
    timeLeft: "8 days",
    requirements: { carbonReduction: 25 },
  },
  {
    id: 3,
    title: "Appliance Efficiency Challenge",
    description: "Optimize 5 appliances for better efficiency",
    participants: 634,
    reward: 30,
    timeLeft: "15 days",
    requirements: { appliancesOptimized: 5 },
  },
]

const challengeParticipants: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId } = await request.json()

    // Check if challenge exists
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) {
      return NextResponse.json({ success: false, error: "Challenge not found" }, { status: 404 })
    }

    // Check if user already joined
    const existingParticipation = challengeParticipants.find(
      (p) => p.userId === userId && p.challengeId === challengeId,
    )

    if (existingParticipation) {
      return NextResponse.json({ success: false, error: "Already joined this challenge" }, { status: 400 })
    }

    // Add user to challenge
    const participation = {
      id: Date.now().toString(),
      userId,
      challengeId,
      joinedAt: new Date().toISOString(),
      progress: 0,
      completed: false,
      status: "active",
    }

    challengeParticipants.push(participation)

    // Update participant count
    challenge.participants += 1

    return NextResponse.json({
      success: true,
      participation,
      message: `Successfully joined ${challenge.title}!`,
      reward: challenge.reward,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to join challenge" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  const userChallenges = challengeParticipants.filter((p) => p.userId === userId)

  return NextResponse.json({
    success: true,
    challenges: userChallenges,
    activeCount: userChallenges.filter((c) => c.status === "active").length,
  })
}
