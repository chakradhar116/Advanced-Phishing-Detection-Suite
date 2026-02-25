import type { TrainingModule } from "@/types/phishing-detector"

// Get available training modules
export function getTrainingModules(): TrainingModule[] {
  return [
    {
      id: "phishing-basics",
      title: "Phishing Basics",
      description: "Learn to identify common phishing techniques",
      difficulty: "beginner",
      points: 100,
      completed: Math.random() > 0.5,
    },
    {
      id: "url-analysis",
      title: "URL Analysis",
      description: "Advanced techniques for identifying malicious URLs",
      difficulty: "intermediate",
      points: 200,
      completed: Math.random() > 0.7,
    },
    {
      id: "social-engineering",
      title: "Social Engineering Defense",
      description: "Protect yourself from manipulation tactics",
      difficulty: "intermediate",
      points: 200,
      completed: Math.random() > 0.8,
    },
    {
      id: "advanced-threats",
      title: "Advanced Threat Recognition",
      description: "Identify sophisticated phishing campaigns",
      difficulty: "advanced",
      points: 300,
      completed: Math.random() > 0.9,
    },
    {
      id: "incident-response",
      title: "Incident Response",
      description: "What to do when you encounter a phishing attempt",
      difficulty: "beginner",
      points: 100,
      completed: Math.random() > 0.6,
    },
  ]
}

// Get user's security score
export function getUserSecurityScore(): {
  score: number
  level: string
  nextLevel: string
  progress: number
} {
  const score = Math.floor(Math.random() * 850) + 150 // 150-1000
  let level, nextLevel, progress

  if (score < 300) {
    level = "Novice"
    nextLevel = "Apprentice"
    progress = score / 300
  } else if (score < 500) {
    level = "Apprentice"
    nextLevel = "Adept"
    progress = (score - 300) / 200
  } else if (score < 700) {
    level = "Adept"
    nextLevel = "Expert"
    progress = (score - 500) / 200
  } else if (score < 900) {
    level = "Expert"
    nextLevel = "Master"
    progress = (score - 700) / 200
  } else {
    level = "Master"
    nextLevel = "Grandmaster"
    progress = (score - 900) / 100
  }

  return {
    score,
    level,
    nextLevel,
    progress: Math.min(progress, 1),
  }
}

// Get security tips based on analysis
export function getSecurityTips(indicators: string[]): string[] {
  const allTips = [
    "Always verify the sender's email address",
    "Check for spelling and grammar errors",
    "Hover over links before clicking them",
    "Never provide sensitive information via email",
    "Be wary of urgent requests for action",
    "Use two-factor authentication when available",
    "Keep your software and browsers updated",
    "Report suspicious emails to your IT department",
    "Use different passwords for different accounts",
    "Be cautious of attachments, even from known senders",
  ]

  // Return 3 random tips
  return allTips.sort(() => 0.5 - Math.random()).slice(0, 3)
}

