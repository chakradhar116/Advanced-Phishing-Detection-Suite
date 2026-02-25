"use client"

import type { CloudAnalysisResult } from "@/types/phishing-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Server, Clock } from "lucide-react"

interface CloudAnalysisProps {
  result: CloudAnalysisResult
}

export function CloudAnalysisCard({ result }: CloudAnalysisProps) {
  const { verdict, confidence, processingTime, resourcesUsed } = result

  const isNegative =
    verdict.toLowerCase().includes("phishing") ||
    verdict.toLowerCase().includes("malicious") ||
    verdict.toLowerCase().includes("suspicious")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Cloud Analysis
          </CardTitle>
          <Badge variant={isNegative ? "destructive" : "success"}>{isNegative ? "Threat Detected" : "Clean"}</Badge>
        </div>
        <CardDescription>Results from distributed cloud analysis</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Verdict</span>
            <p className="font-medium">{verdict}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Confidence</span>
            <p className="font-medium">{(confidence * 100).toFixed(1)}%</p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Processed in {processingTime.toFixed(2)} seconds</span>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Resources Used</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {resourcesUsed.map((resource, index) => (
                <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                  <Server className="h-3 w-3" />
                  <span>{resource}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

