"use client"

import type { IndicatorDetail } from "@/types/phishing-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, AlertTriangle, CheckCircle } from "lucide-react"

interface AIAnalysisProps {
  score: number
  confidence?: number
  indicators: IndicatorDetail[]
}

export function AIAnalysisCard({ score, confidence, indicators }: AIAnalysisProps) {
  const aiIndicators = indicators.filter((i) => i.detectionMethod === "ai")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis
          </CardTitle>
        </div>
        <CardDescription>Advanced machine learning analysis results</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {confidence && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">AI Confidence</span>
              <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={confidence * 100} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          {aiIndicators.length > 0 ? (
            aiIndicators.map((indicator, index) => (
              <div key={index} className="p-3 rounded-md bg-muted">
                <div className="flex items-start gap-2">
                  {indicator.severity === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{indicator.name}</p>
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {(indicator.confidence * 100).toFixed(0)}%
                      </span>
                      <span className="text-xs text-muted-foreground">Severity: {indicator.severity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>No AI-detected indicators found</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

