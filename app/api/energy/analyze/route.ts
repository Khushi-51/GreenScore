import { type NextRequest, NextResponse } from "next/server"

// AI-powered energy analysis simulation
export async function POST(request: NextRequest) {
  try {
    const { appliances, location = "US" } = await request.json()

    // Carbon emission factors (kg CO2 per kWh) by region
    const emissionFactors = {
      US: 0.5,
      EU: 0.3,
      IN: 0.8,
      CN: 0.7,
    }

    const emissionFactor = emissionFactors[location as keyof typeof emissionFactors] || 0.5

    // Calculate energy usage and carbon footprint
    let totalDailyUsage = 0
    const applianceAnalysis = appliances.map((appliance: any) => {
      const dailyUsage = (appliance.wattage * appliance.hoursPerDay * appliance.daysPerWeek) / 7 / 1000
      totalDailyUsage += dailyUsage

      return {
        ...appliance,
        dailyUsage,
        monthlyUsage: dailyUsage * 30,
        carbonFootprint: dailyUsage * emissionFactor,
        efficiency: Math.max(20, Math.min(100, 100 - appliance.wattage / 50)),
      }
    })

    // Generate AI tips based on usage patterns
    const tips = generateAITips(applianceAnalysis)

    // Calculate overall metrics
    const analysis = {
      totalDailyUsage,
      totalMonthlyUsage: totalDailyUsage * 30,
      totalCarbonFootprint: totalDailyUsage * emissionFactor,
      overallEfficiency: applianceAnalysis.reduce((sum, a) => sum + a.efficiency, 0) / applianceAnalysis.length,
      appliances: applianceAnalysis,
      tips,
      recommendations: generateRecommendations(applianceAnalysis),
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Analysis failed" }, { status: 500 })
  }
}

function generateAITips(appliances: any[]) {
  const tips = []

  // AC optimization tips
  const ac = appliances.find((a) => a.type === "ac")
  if (ac && ac.hoursPerDay > 8) {
    tips.push({
      category: "AC Efficiency",
      tip: `Your AC runs ${ac.hoursPerDay} hours daily. Set temperature to 24°C and use ceiling fans to reduce usage by 20%.`,
      impact: `Save ${(ac.dailyUsage * 0.2).toFixed(1)} kWh/day`,
      tokens: 15,
      difficulty: "Easy",
    })
  }

  // High wattage appliance tips
  const highWattageAppliances = appliances.filter((a) => a.wattage > 2000)
  if (highWattageAppliances.length > 0) {
    tips.push({
      category: "High Power Usage",
      tip: "Consider using high-power appliances during off-peak hours (10 PM - 6 AM) for lower rates.",
      impact: "Save 15-20% on electricity costs",
      tokens: 10,
      difficulty: "Easy",
    })
  }

  // Always-on appliances
  const alwaysOn = appliances.filter((a) => a.hoursPerDay >= 20)
  if (alwaysOn.length > 1) {
    tips.push({
      category: "Standby Power",
      tip: "Unplug devices when not in use. Phantom loads can account for 5-10% of total energy consumption.",
      impact: `Save ${(appliances.reduce((sum, a) => sum + a.dailyUsage, 0) * 0.075).toFixed(1)} kWh/day`,
      tokens: 8,
      difficulty: "Easy",
    })
  }

  return tips.slice(0, 3) // Return top 3 tips
}

function generateRecommendations(appliances: any[]) {
  const recommendations = []

  // Energy-efficient appliance upgrades
  const oldAppliances = appliances.filter((a) => a.efficiency < 60)
  if (oldAppliances.length > 0) {
    recommendations.push({
      type: "upgrade",
      title: "Energy-Efficient Appliance Upgrades",
      description: "Consider upgrading to ENERGY STAR certified appliances",
      potentialSavings: "20-30% energy reduction",
      priority: "high",
    })
  }

  // Smart home integration
  recommendations.push({
    type: "automation",
    title: "Smart Home Integration",
    description: "Install smart plugs and thermostats for automated energy management",
    potentialSavings: "10-15% energy reduction",
    priority: "medium",
  })

  return recommendations
}
