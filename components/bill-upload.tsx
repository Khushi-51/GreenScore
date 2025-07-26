"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Coins, Camera } from "lucide-react"

interface UploadedBill {
  id: string
  filename: string
  uploadDate: string
  status: "processing" | "completed" | "error"
  extractedData?: {
    totalUsage: number
    totalCost: number
    billingPeriod: string
  }
  tokensEarned?: number
}

export function BillUpload() {
  const [uploadedBills, setUploadedBills] = useState<UploadedBill[]>([
    {
      id: "1",
      filename: "electricity_bill_dec_2024.pdf",
      uploadDate: "2024-01-15",
      status: "completed",
      extractedData: {
        totalUsage: 856,
        totalCost: 128.4,
        billingPeriod: "Dec 2024",
      },
      tokensEarned: 5,
    },
    {
      id: "2",
      filename: "electricity_bill_nov_2024.pdf",
      uploadDate: "2024-01-10",
      status: "completed",
      extractedData: {
        totalUsage: 923,
        totalCost: 138.45,
        billingPeriod: "Nov 2024",
      },
      tokensEarned: 5,
    },
  ])

  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    setUploading(true)

    // Simulate file upload and processing
    setTimeout(() => {
      const file = files[0]
      const newBill: UploadedBill = {
        id: Date.now().toString(),
        filename: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "processing",
      }

      setUploadedBills([newBill, ...uploadedBills])
      setUploading(false)

      // Simulate processing completion
      setTimeout(() => {
        setUploadedBills((bills) =>
          bills.map((bill) =>
            bill.id === newBill.id
              ? {
                  ...bill,
                  status: "completed" as const,
                  extractedData: {
                    totalUsage: Math.floor(Math.random() * 200) + 800,
                    totalCost: Math.floor(Math.random() * 50) + 120,
                    billingPeriod: "Jan 2024",
                  },
                  tokensEarned: 5,
                }
              : bill,
          ),
        )
      }, 3000)
    }, 1000)
  }

  const totalTokensEarned = uploadedBills
    .filter((bill) => bill.status === "completed")
    .reduce((total, bill) => total + (bill.tokensEarned || 0), 0)

  return (
    <div className="space-y-6">
      {/* Upload Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Electricity Bill Analysis
          </CardTitle>
          <CardDescription>Upload your electricity bills for AI-powered analysis and earn GreenTokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{uploadedBills.length}</div>
              <div className="text-sm text-gray-600">Bills Uploaded</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalTokensEarned}</div>
              <div className="text-sm text-gray-600">GRN Tokens Earned</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {uploadedBills.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Successfully Processed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Upload New Bill
          </CardTitle>
          <CardDescription>Supported formats: PDF, JPG, PNG. Maximum file size: 10MB</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600">Uploading and processing your bill...</p>
                <Progress value={65} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop your electricity bill here</p>
                  <p className="text-gray-600">or click to browse files</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Coins className="h-4 w-4" />
              <span className="font-medium">Earn 5 GreenTokens per bill!</span>
            </div>
            <p className="text-sm text-blue-700">
              Our AI will extract usage data, compare with your appliance setup, and provide personalized insights.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Bills History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Track your uploaded bills and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedBills.map((bill) => (
              <div key={bill.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{bill.filename}</div>
                      <div className="text-sm text-gray-600">Uploaded on {bill.uploadDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bill.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {bill.status === "processing" && <Badge variant="secondary">Processing...</Badge>}
                    {bill.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    {bill.tokensEarned && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Coins className="h-3 w-3 mr-1" />+{bill.tokensEarned} GRN
                      </Badge>
                    )}
                  </div>
                </div>

                {bill.extractedData && (
                  <div className="grid grid-cols-3 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="font-semibold text-lg">{bill.extractedData.totalUsage}</div>
                      <div className="text-sm text-gray-600">kWh Used</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">${bill.extractedData.totalCost}</div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">{bill.extractedData.billingPeriod}</div>
                      <div className="text-sm text-gray-600">Period</div>
                    </div>
                  </div>
                )}

                {bill.status === "processing" && (
                  <div className="mt-3">
                    <Progress value={45} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">Extracting data using AI OCR...</p>
                  </div>
                )}
              </div>
            ))}

            {uploadedBills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bills uploaded yet. Upload your first electricity bill to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
