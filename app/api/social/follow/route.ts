import { type NextRequest, NextResponse } from "next/server"

// Mock social connections database
const socialConnections: any[] = []
const users = [
  { id: "user-1", name: "John Doe", email: "john@example.com", greenScore: 1850 },
  { id: "user-2", name: "Sarah Miller", email: "sarah@example.com", greenScore: 2100 },
  { id: "user-3", name: "Mike Johnson", email: "mike@example.com", greenScore: 1650 },
]

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    // Check if users exist
    const follower = users.find((u) => u.id === followerId)
    const following = users.find((u) => u.id === followingId)

    if (!follower || !following) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if already following
    const existingConnection = socialConnections.find(
      (c) => c.followerId === followerId && c.followingId === followingId,
    )

    if (existingConnection) {
      return NextResponse.json({ success: false, error: "Already following this user" }, { status: 400 })
    }

    // Create connection
    const connection = {
      id: Date.now().toString(),
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    socialConnections.push(connection)

    return NextResponse.json({
      success: true,
      connection,
      message: `Now following ${following.name}!`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to follow user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type") // 'following' or 'followers'

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  let connections
  if (type === "followers") {
    connections = socialConnections.filter((c) => c.followingId === userId)
  } else {
    connections = socialConnections.filter((c) => c.followerId === userId)
  }

  // Get user details for connections
  const connectionsWithUsers = connections.map((connection) => {
    const targetUserId = type === "followers" ? connection.followerId : connection.followingId
    const user = users.find((u) => u.id === targetUserId)
    return {
      ...connection,
      user,
    }
  })

  return NextResponse.json({
    success: true,
    connections: connectionsWithUsers,
    count: connections.length,
  })
}
