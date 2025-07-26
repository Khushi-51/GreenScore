import { type NextRequest, NextResponse } from "next/server"

// Mock token transactions database
const tokenTransactions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { userId, action, tokens, metadata } = await request.json()

    // Create transaction record
    const transaction = {
      id: Date.now().toString(),
      userId,
      action,
      tokens,
      metadata,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    tokenTransactions.push(transaction)

    // In a real app, you would:
    // 1. Verify the action was actually completed
    // 2. Update user's token balance in database
    // 3. Mint tokens on blockchain if using real crypto

    return NextResponse.json({
      success: true,
      transaction,
      message: `Awarded ${tokens} GreenTokens for ${action}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Token award failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  const userTransactions = tokenTransactions.filter((t) => t.userId === userId)
  const totalTokens = userTransactions.reduce((sum, t) => sum + t.tokens, 0)

  return NextResponse.json({
    success: true,
    balance: totalTokens,
    transactions: userTransactions.slice(-10), // Last 10 transactions
  })
}
