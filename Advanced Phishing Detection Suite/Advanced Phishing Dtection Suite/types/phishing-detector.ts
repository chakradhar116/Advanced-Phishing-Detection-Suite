export type SensitivityLevel = "low" | "medium" | "high" | "adaptive"

export type AnalysisMode = "standard" | "advanced" | "ai" | "blockchain"

export interface AdvancedOptions {
  checkLinks: boolean
  checkAttachments: boolean
  useAI: boolean
  useBlockchain: boolean
  useRealTimeThreatIntel: boolean
  useUserBehaviorProfiling: boolean
  sensitivity: SensitivityLevel
  analysisMode: AnalysisMode
  autoResponse: boolean
  cloudAnalysis: boolean
}

export interface AnalysisResult {
  score: number
  indicators: IndicatorDetail[]
  accuracy: number
  threatLevel: ThreatLevel
  aiConfidence?: number
  blockchainVerified?: boolean
  realTimeData?: boolean
  behavioralInsights?: BehavioralInsight[]
  suggestedActions?: string[]
  cloudVerdict?: string
}

export interface IndicatorDetail {
  name: string
  description: string
  severity: "low" | "medium" | "high"
  confidence: number
  category: IndicatorCategory
  detectionMethod: DetectionMethod
}

export type IndicatorCategory =
  | "content"
  | "url"
  | "sender"
  | "attachment"
  | "behavior"
  | "contextual"
  | "cryptographic"
  | "network"

export type DetectionMethod =
  | "pattern"
  | "ml"
  | "ai"
  | "blockchain"
  | "cryptographic"
  | "behavioral"
  | "threatIntel"
  | "contextual"

export type ThreatLevel = "safe" | "low" | "medium" | "high" | "critical"

export interface UrlScanResult {
  url: string
  isSafe: boolean
  reason?: string
  confidence: number
  threatLevel: ThreatLevel
  blockchainVerified?: boolean
  detectionMethods: DetectionMethod[]
  categories?: string[]
  firstSeen?: string
  lastSeen?: string
  relatedThreats?: string[]
}

export interface BehavioralInsight {
  pattern: string
  significance: number
  recommendation: string
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  points: number
  completed: boolean
}

export interface ThreatIntelligence {
  source: string
  lastUpdated: string
  indicators: number
  coverage: number
}

export interface BlockchainVerification {
  verified: boolean
  timestamp: string
  trustScore: number
  network: string
}

export interface CloudAnalysisResult {
  verdict: string
  confidence: number
  processingTime: number
  resourcesUsed: string[]
}

