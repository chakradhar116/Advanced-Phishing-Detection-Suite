"use client"

import type { BehavioralInsight } from "@/types/phishing-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User, AlertCircle } from "lucide-react"

interface BehavioralInsightsProps {
  insights: BehavioralInsight[]
}

export function BehavioralInsightsCard({ insights }: BehavioralInsightsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Behavioral Analysis
          </CardTitle>
        </div>
        <CardDescription>Insights based on user behavior patterns</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="font-medium">{insight.pattern}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Significance</span>
                <span>{(insight.significance * 100).toFixed(0)}%</span>
              </div>
              <Progress value={insight.significance * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

