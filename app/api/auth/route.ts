import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "demo@greenscore.com",
    password: "demo123",
    name: "Demo User",
    walletAddress: "0x742d35Cc6634C0532925a3b8D404d3aABe09e444",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json()

    if (action === "login") {
      const user = users.find((u) => u.email === email && u.password === password)
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        return NextResponse.json({ success: true, user: userWithoutPassword })
      }
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    if (action === "signup") {
      // Check if user already exists
      const existingUser = users.find((u) => u.email === email)
      if (existingUser) {
        return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 })
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        walletAddress: "0x" + Math.random().toString(16).substr(2, 40),
      }
      users.push(newUser)

      const { password: _, ...userWithoutPassword } = newUser
      return NextResponse.json({ success: true, user: userWithoutPassword })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
