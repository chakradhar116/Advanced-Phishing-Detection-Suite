"use server"

import type { AdvancedOptions, AnalysisResult, UrlScanResult, IndicatorDetail } from "@/types/phishing-detector"

import {
  analyzeWithAI,
  analyzeBehavior,
  checkThreatIntelligence,
  determineThreatLevel,
  generateSuggestedActions,
} from "@/utils/ai-utils"

import { verifyWithBlockchain, checkDomainTrust } from "@/utils/blockchain-utils"

import { analyzeInCloud } from "@/utils/cloud-utils"

export async function analyzeEmail(emailContent: string, options: AdvancedOptions): Promise<AnalysisResult> {
  const indicators: IndicatorDetail[] = []
  let score = 0
  let accuracy = 0.7 // Base accuracy
  let aiConfidence = undefined
  let blockchainVerified = undefined
  let realTimeData = undefined
  let behavioralInsights = undefined
  let cloudVerdict = undefined

  const sensitivityMultiplier = {
    low: 0.8,
    medium: 1,
    high: 1.2,
    adaptive: 1 + (Math.random() * 0.4 - 0.2), // Adaptive sensitivity varies between 0.8 and 1.2
  }

  // Extract potential URLs from the email content
  const urls = emailContent.match(/https?:\/\/[^\s]+/g) || []
  const emailDomain = emailContent.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)?.[1] || ""
  const linkCount = urls.length

  // Basic pattern-based checks
  if (/urgent|immediate action|account.*suspend/i.test(emailContent)) {
    indicators.push({
      name: "Urgent language",
      description: "Uses urgent or threatening language to create pressure",
      severity: "medium",
      confidence: 0.85,
      category: "content",
      detectionMethod: "pattern",
    })
    score += 0.2 * sensitivityMultiplier[options.sensitivity]
  }

  if (linkCount > 3) {
    indicators.push({
      name: "Multiple links",
      description: "Contains an unusually high number of links",
      severity: "low",
      confidence: 0.75,
      category: "url",
      detectionMethod: "pattern",
    })
    score += 0.1 * sensitivityMultiplier[options.sensitivity]
  }

  if (/password|credit card|social security/i.test(emailContent)) {
    indicators.push({
      name: "Requests sensitive information",
      description: "Asks for personal or financial information",
      severity: "high",
      confidence: 0.9,
      category: "content",
      detectionMethod: "pattern",
    })
    score += 0.3 * sensitivityMultiplier[options.sensitivity]
  }

  if (/dear sir\/madam|dear customer/i.test(emailContent)) {
    indicators.push({
      name: "Generic greeting",
      description: "Uses a non-personalized greeting",
      severity: "low",
      confidence: 0.7,
      category: "content",
      detectionMethod: "pattern",
    })
    score += 0.1 * sensitivityMultiplier[options.sensitivity]
  }

  const spellingErrors = emailContent.split(/\s+/).filter((word) => !/^[a-z]+$/i.test(word)).length
  if (spellingErrors > emailContent.split(/\s+/).length * 0.1) {
    indicators.push({
      name: "Poor grammar/spelling",
      description: "Contains multiple spelling or grammatical errors",
      severity: "medium",
      confidence: 0.8,
      category: "content",
      detectionMethod: "pattern",
    })
    score += 0.1 * sensitivityMultiplier[options.sensitivity]
  }

  const urlMismatch = /<a.*?href=["'](?!https?:\/\/(?:www\.)?[^/]+\.com).*?["'].*?>.*?<\/a>/i.test(emailContent)
  if (urlMismatch) {
    indicators.push({
      name: "URL mismatch",
      description: "Link text doesn't match the actual URL destination",
      severity: "high",
      confidence: 0.95,
      category: "url",
      detectionMethod: "pattern",
    })
    score += 0.2 * sensitivityMultiplier[options.sensitivity]
  }

  // Advanced analysis based on selected options
  if (options.useAI) {
    const aiAnalysis = analyzeWithAI(emailContent)
    indicators.push(...aiAnalysis.indicators)
    score = (score + aiAnalysis.score) / 2 // Blend scores
    aiConfidence = aiAnalysis.confidence
    accuracy += 0.2 // Significant increase in accuracy when using AI
  }

  if (options.useBlockchain) {
    const blockchainResult = verifyWithBlockchain("sender@example.com", emailContent)
    blockchainVerified = blockchainResult.verified

    if (!blockchainResult.verified) {
      indicators.push({
        name: "Blockchain verification failed",
        description: "Sender identity could not be verified on the blockchain",
        severity: "medium",
        confidence: 0.9,
        category: "cryptographic",
        detectionMethod: "blockchain",
      })
      score += 0.25 * sensitivityMultiplier[options.sensitivity]
    }

    if (emailDomain) {
      const domainTrust = checkDomainTrust(emailDomain)
      if (!domainTrust.trusted) {
        indicators.push({
          name: "Untrusted domain",
          description: "Email domain is not verified in the blockchain trust registry",
          severity: "medium",
          confidence: 0.85,
          category: "cryptographic",
          detectionMethod: "blockchain",
        })
        score += 0.2 * sensitivityMultiplier[options.sensitivity]
      }
    }

    accuracy += 0.15 // Increase accuracy when using blockchain verification
  }

  if (options.useRealTimeThreatIntel) {
    const threatIntelIndicators = checkThreatIntelligence(emailContent, urls)
    indicators.push(...threatIntelIndicators)

    if (threatIntelIndicators.length > 0) {
      score += 0.3 * sensitivityMultiplier[options.sensitivity]
    }

    realTimeData = true
    accuracy += 0.1 // Increase accuracy when using threat intelligence
  }

  if (options.useUserBehaviorProfiling) {
    behavioralInsights = analyzeBehavior(emailContent)

    if (behavioralInsights.length > 0) {
      const avgSignificance =
        behavioralInsights.reduce((sum, insight) => sum + insight.significance, 0) / behavioralInsights.length
      score += avgSignificance * 0.2 * sensitivityMultiplier[options.sensitivity]
    }

    accuracy += 0.1 // Increase accuracy when using behavioral profiling
  }

  if (options.cloudAnalysis) {
    try {
      const cloudResult = await analyzeInCloud(emailContent)
      cloudVerdict = cloudResult.verdict

      if (cloudResult.verdict.includes("phishing") || cloudResult.verdict.includes("malicious")) {
        indicators.push({
          name: "Cloud analysis detection",
          description: `Cloud analysis result: ${cloudResult.verdict}`,
          severity: "high",
          confidence: cloudResult.confidence,
          category: "content",
          detectionMethod: "ai",
        })
        score += 0.3 * sensitivityMultiplier[options.sensitivity]
      }

      accuracy += 0.15 // Increase accuracy when using cloud analysis
    } catch (error) {
      console.error("Cloud analysis failed:", error)
    }
  }

  // Check links if enabled
  if (options.checkLinks && urls.length > 0) {
    const scanResults = await scanUrls(urls, options)
    const unsafeLinks = scanResults.filter((result) => !result.isSafe)

    if (unsafeLinks.length > 0) {
      indicators.push({
        name: "Malicious URLs detected",
        description: `Contains ${unsafeLinks.length} potentially unsafe link(s)`,
        severity: "high",
        confidence: 0.9,
        category: "url",
        detectionMethod: "threatIntel",
      })
      score += 0.3 * sensitivityMultiplier[options.sensitivity]
    }

    accuracy += 0.1 // Increase accuracy when checking links
  }

  // Check for attachments
  if (options.checkAttachments) {
    if (/\.exe|\.zip|\.rar|\.js|\.vbs/i.test(emailContent)) {
      indicators.push({
        name: "Suspicious attachments",
        description: "Contains potentially dangerous file attachments",
        severity: "high",
        confidence: 0.9,
        category: "attachment",
        detectionMethod: "pattern",
      })
      score += 0.3 * sensitivityMultiplier[options.sensitivity]
    }
    accuracy += 0.1 // Increase accuracy when checking attachments
  }

  // Normalize score to be between 0 and 1
  score = Math.min(score, 1)

  // Adjust accuracy based on sensitivity and analysis mode
  accuracy = Math.min(accuracy + (options.sensitivity === "high" ? 0.1 : options.sensitivity === "low" ? -0.1 : 0), 1)

  if (options.analysisMode === "advanced") accuracy += 0.05
  if (options.analysisMode === "ai") accuracy += 0.15
  if (options.analysisMode === "blockchain") accuracy += 0.1

  // Generate suggested actions
  const suggestedActions = generateSuggestedActions(score, indicators)

  // Determine threat level
  const threatLevel = determineThreatLevel(score)

  return {
    score,
    indicators,
    accuracy,
    threatLevel,
    aiConfidence,
    blockchainVerified,
    realTimeData,
    behavioralInsights,
    suggestedActions,
    cloudVerdict,
  }
}

export async function scanUrls(urls: string[], options: AdvancedOptions): Promise<UrlScanResult[]> {
  const sensitivityMultiplier = {
    low: 0.8,
    medium: 1,
    high: 1.2,
    adaptive: 1 + (Math.random() * 0.4 - 0.2), // Adaptive sensitivity varies between 0.8 and 1.2
  }

  return Promise.all(
    urls.map(async (url) => {
      // Simulating an API call or complex analysis
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

      const randomFactor = Math.random()
      const isSafe = randomFactor > 0.3 * sensitivityMultiplier[options.sensitivity] // Adjusted based on sensitivity
      const confidence = 0.7 + Math.random() * 0.3 // Base confidence between 0.7 and 1.0

      const detectionMethods: string[] = ["pattern"]

      if (options.useAI) detectionMethods.push("ai")
      if (options.useBlockchain) detectionMethods.push("blockchain")
      if (options.useRealTimeThreatIntel) detectionMethods.push("threatIntel")

      const categories = isSafe ? [] : ["phishing", "malware", "scam", "suspicious"].filter(() => Math.random() > 0.5)

      const blockchainVerified = options.useBlockchain ? Math.random() > 0.3 : undefined

      return {
        url,
        isSafe,
        reason: isSafe ? undefined : "Suspicious domain or known phishing site",
        confidence: confidence * sensitivityMultiplier[options.sensitivity],
        threatLevel: isSafe ? "safe" : determineThreatLevel(randomFactor),
        blockchainVerified,
        detectionMethods: detectionMethods as any,
        categories: categories.length > 0 ? categories : undefined,
        firstSeen: isSafe ? undefined : new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        lastSeen: isSafe ? undefined : new Date().toISOString(),
        relatedThreats: isSafe
          ? undefined
          : ["credential-theft", "data-exfiltration"].filter(() => Math.random() > 0.5),
      }
    }),
  )
}

