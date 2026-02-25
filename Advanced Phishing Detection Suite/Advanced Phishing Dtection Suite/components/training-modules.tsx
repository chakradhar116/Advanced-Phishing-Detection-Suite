"use client"

import type { TrainingModule } from "@/types/phishing-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrainingModulesProps {
  modules: TrainingModule[]
}

export function TrainingModulesCard({ modules }: TrainingModulesProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Security Training
          </CardTitle>
        </div>
        <CardDescription>Improve your phishing detection skills</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {modules.map((module, index) => (
            <div key={index} className="p-3 rounded-md border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{module.title}</span>
                    {module.completed && <CheckCircle className="h-4 w-4 text-success" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                </div>
                <Badge variant="outline">{module.difficulty}</Badge>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{module.points} points</span>
                </div>
                <Button size="sm" variant={module.completed ? "outline" : "default"}>
                  {module.completed ? "Review" : "Start"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

