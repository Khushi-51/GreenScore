"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Zap, Home, Save } from "lucide-react"

interface Appliance {
  id: string
  name: string
  type: string
  wattage: number
  hoursPerDay: number
  daysPerWeek: number
}

const applianceTypes = [
  { value: "ac", label: "Air Conditioner", defaultWattage: 3500 },
  { value: "refrigerator", label: "Refrigerator", defaultWattage: 150 },
  { value: "washing_machine", label: "Washing Machine", defaultWattage: 2000 },
  { value: "tv", label: "Television", defaultWattage: 200 },
  { value: "computer", label: "Computer", defaultWattage: 300 },
  { value: "microwave", label: "Microwave", defaultWattage: 1200 },
  { value: "dishwasher", label: "Dishwasher", defaultWattage: 1800 },
  { value: "water_heater", label: "Water Heater", defaultWattage: 4000 },
  { value: "lighting", label: "LED Lights (per room)", defaultWattage: 60 },
  { value: "fan", label: "Ceiling Fan", defaultWattage: 75 },
]

export function ApplianceSetup() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      id: "1",
      name: "Living Room AC",
      type: "ac",
      wattage: 3500,
      hoursPerDay: 8,
      daysPerWeek: 7,
    },
    {
      id: "2",
      name: "Main Refrigerator",
      type: "refrigerator",
      wattage: 150,
      hoursPerDay: 24,
      daysPerWeek: 7,
    },
  ])

  const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({
    name: "",
    type: "",
    wattage: 0,
    hoursPerDay: 4,
    daysPerWeek: 7,
  })

  const addAppliance = () => {
    if (newAppliance.name && newAppliance.type) {
      const appliance: Appliance = {
        id: Date.now().toString(),
        name: newAppliance.name,
        type: newAppliance.type,
        wattage: newAppliance.wattage || 0,
        hoursPerDay: newAppliance.hoursPerDay || 4,
        daysPerWeek: newAppliance.daysPerWeek || 7,
      }
      setAppliances([...appliances, appliance])
      setNewAppliance({
        name: "",
        type: "",
        wattage: 0,
        hoursPerDay: 4,
        daysPerWeek: 7,
      })
    }
  }

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id))
  }

  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    setAppliances(appliances.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const calculateDailyUsage = (appliance: Appliance) => {
    return (appliance.wattage * appliance.hoursPerDay * appliance.daysPerWeek) / 7 / 1000
  }

  const totalDailyUsage = appliances.reduce((total, appliance) => total + calculateDailyUsage(appliance), 0)

  const handleTypeChange = (type: string) => {
    const selectedType = applianceTypes.find((t) => t.value === type)
    setNewAppliance({
      ...newAppliance,
      type,
      wattage: selectedType?.defaultWattage || 0,
    })
  }

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)

  const handleSaveAndAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      // Save appliance configuration
      const configData = {
        appliances: appliances,
        location: "US", // You can add location selection
        userId: "current-user-id",
      }

      // Call AI analysis API
      const response = await fetch("/api/energy/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      const result = await response.json()

      if (result.success && result.analysis) {
        setAnalysisResults(result.analysis)

        // Award tokens for completing setup
        await fetch("/api/tokens/award", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "current-user-id",
            action: "Appliance Setup Completed",
            tokens: 20,
            metadata: { applianceCount: appliances.length },
          }),
        })

        // Update tokens and score
        window.dispatchEvent(
          new CustomEvent("tokensUpdated", {
            detail: {
              tokens: 20,
              action: "Appliance Setup Completed",
              type: "achievement",
            },
          }),
        )
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      // Show error notification instead of alert
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: {
            tokens: 0,
            action: "Error: Analysis failed",
            type: "error",
          },
        }),
      )
      setAnalysisResults(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            Home Energy Setup
          </CardTitle>
          <CardDescription>
            Configure your appliances to get personalized energy insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{appliances.length}</div>
              <div className="text-sm text-gray-600">Appliances Tracked</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalDailyUsage.toFixed(1)}</div>
              <div className="text-sm text-gray-600">kWh/day Estimated</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{(totalDailyUsage * 0.5).toFixed(0)}</div>
              <div className="text-sm text-gray-600">kg CO₂/day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Appliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Appliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appliance-name">Appliance Name</Label>
              <Input
                id="appliance-name"
                placeholder="e.g., Living Room AC"
                value={newAppliance.name}
                onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appliance-type">Type</Label>
              <Select value={newAppliance.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appliance type" />
                </SelectTrigger>
                <SelectContent>
                  {applianceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wattage">Power (Watts)</Label>
              <Input
                id="wattage"
                type="number"
                value={newAppliance.wattage}
                onChange={(e) => setNewAppliance({ ...newAppliance, wattage: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours per Day: {newAppliance.hoursPerDay}</Label>
              <Slider
                value={[newAppliance.hoursPerDay || 4]}
                onValueChange={(value) => setNewAppliance({ ...newAppliance, hoursPerDay: value[0] })}
                max={24}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Days per Week: {newAppliance.daysPerWeek}</Label>
              <Slider
                value={[newAppliance.daysPerWeek || 7]}
                onValueChange={(value) => setNewAppliance({ ...newAppliance, daysPerWeek: value[0] })}
                max={7}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Button onClick={addAppliance} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Appliance
          </Button>
        </CardContent>
      </Card>

      {/* Current Appliances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Your Appliances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appliances.map((appliance) => (
              <div key={appliance.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{appliance.name}</h4>
                    <Badge variant="outline" className="mt-1">
                      {applianceTypes.find((t) => t.value === appliance.type)?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {calculateDailyUsage(appliance).toFixed(1)} kWh/day
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => removeAppliance(appliance.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Power (Watts)</Label>
                    <Input
                      type="number"
                      value={appliance.wattage}
                      onChange={(e) => updateAppliance(appliance.id, "wattage", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hours per Day: {appliance.hoursPerDay}</Label>
                    <Slider
                      value={[appliance.hoursPerDay]}
                      onValueChange={(value) => updateAppliance(appliance.id, "hoursPerDay", value[0])}
                      max={24}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Days per Week: {appliance.daysPerWeek}</Label>
                    <Slider
                      value={[appliance.daysPerWeek]}
                      onValueChange={(value) => updateAppliance(appliance.id, "daysPerWeek", value[0])}
                      max={7}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {appliances.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appliances added yet. Add your first appliance above to get started!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSaveAndAnalyze}
            disabled={isAnalyzing || appliances.length === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Save Configuration & Generate AI Analysis"}
          </Button>
        </CardContent>
      </Card>

      {analysisResults && analysisResults.summary && (
        <Card className="mt-4 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 Analysis Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Daily Usage:</strong> {analysisResults.summary.total_daily_usage || "N/A"} kWh
              </div>
              <div>
                <strong>Monthly Cost:</strong> ${analysisResults.summary.estimated_monthly_cost || "N/A"}
              </div>
              <div>
                <strong>Carbon Footprint:</strong> {analysisResults.summary.carbon_footprint_daily || "N/A"} kg CO₂/day
              </div>
              <div>
                <strong>Efficiency Score:</strong> {analysisResults.efficiency_score || "N/A"}/100
              </div>
            </div>

            {analysisResults.ai_tips && analysisResults.ai_tips.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-green-800 mb-2">🔍 AI Recommendations:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {analysisResults.ai_tips.slice(0, 3).map((tip, index) => (
                    <li key={index}>• {tip.tip || tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
