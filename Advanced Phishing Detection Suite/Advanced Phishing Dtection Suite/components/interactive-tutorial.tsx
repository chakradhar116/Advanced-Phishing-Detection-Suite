"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, X, CheckCircle, HelpCircle, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TutorialStep {
  id: number
  title: string
  description: string
  image?: string
  element?: string
  position?: "top" | "right" | "bottom" | "left"
  action?: string
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to the Security Suite",
    description:
      "This interactive tutorial will guide you through the key features of our advanced phishing detection system.",
    position: "bottom",
  },
  {
    id: 2,
    title: "Email Analysis",
    description:
      "Paste suspicious emails here for AI-powered analysis. Our system will check for phishing indicators and provide a detailed report.",
    element: "#email-analysis",
    position: "right",
  },
  {
    id: 3,
    title: "URL Scanning",
    description: "Scan suspicious URLs to check if they lead to phishing sites or contain malware.",
    element: "#url-scan",
    position: "left",
  },
  {
    id: 4,
    title: "Advanced Options",
    description:
      "Configure detection sensitivity and enable advanced features like AI analysis and blockchain verification.",
    element: "#advanced-options",
    position: "bottom",
  },
  {
    id: 5,
    title: "Security Dashboard",
    description: "Monitor your security status, view threat statistics, and track your security score.",
    element: "#security-dashboard",
    position: "top",
  },
  {
    id: 6,
    title: "You're All Set!",
    description:
      "You now know the basics of using our security suite. Remember to check back regularly for new threats and updates.",
    position: "bottom",
  },
]

export function InteractiveTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [completed, setCompleted] = useState<number[]>([])

  useEffect(() => {
    if (isOpen && currentStep > 0) {
      const step = tutorialSteps[currentStep - 1]
      if (step.element) {
        const element = document.querySelector(step.element)
        if (element) {
          const rect = element.getBoundingClientRect()
          const scrollTop = window.scrollY || document.documentElement.scrollTop

          let top = 0
          let left = 0

          switch (step.position) {
            case "top":
              top = rect.top + scrollTop - 10
              left = rect.left + rect.width / 2
              break
            case "right":
              top = rect.top + scrollTop + rect.height / 2
              left = rect.right + 10
              break
            case "bottom":
              top = rect.bottom + scrollTop + 10
              left = rect.left + rect.width / 2
              break
            case "left":
              top = rect.top + scrollTop + rect.height / 2
              left = rect.left - 10
              break
            default:
              top = rect.bottom + scrollTop + 10
              left = rect.left + rect.width / 2
          }

          setPosition({ top, left })

          // Scroll element into view
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else {
        // Center in viewport if no element
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        })
      }
    }
  }, [isOpen, currentStep])

  const startTutorial = () => {
    setCurrentStep(1)
    setIsOpen(true)
  }

  const closeTutorial = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length) {
      setCompleted((prev) => [...prev, currentStep])
      setCurrentStep(currentStep + 1)
    } else {
      closeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTutorialStep = tutorialSteps[currentStep - 1]

  return (
    <>
      <Button variant="outline" className="fixed bottom-4 left-4 z-40 gap-2" onClick={startTutorial}>
        <HelpCircle className="h-4 w-4" />
        Interactive Tutorial
      </Button>

      <AnimatePresence>
        {isOpen && currentTutorialStep && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={closeTutorial}
            />

            {/* Tutorial Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed z-50"
              style={{
                top: position.top,
                left: position.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Card className="w-80 shadow-lg border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      Step {currentStep} of {tutorialSteps.length}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1" onClick={closeTutorial}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {currentTutorialStep.title}
                  </CardTitle>
                  <CardDescription>{currentTutorialStep.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentTutorialStep.image && (
                    <div className="rounded-md overflow-hidden mb-4">
                      <img
                        src={currentTutorialStep.image || "/placeholder.svg"}
                        alt={currentTutorialStep.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <Progress value={(currentStep / tutorialSteps.length) * 100} className="h-1" />
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button size="sm" onClick={nextStep}>
                    {currentStep === tutorialSteps.length ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Finish
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

