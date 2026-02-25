"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Info, LinkIcon, Brain, Shield, Cloud, User, Zap } from "lucide-react"
import { analyzeEmail, scanUrls } from "@/app/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AIAnalysisCard } from "./ai-analysis"
import { BlockchainVerificationCard } from "./blockchain-verification"
import { BehavioralInsightsCard } from "./behavioral-insights"
import { CloudAnalysisCard } from "./cloud-analysis"
import { TrainingModulesCard } from "./training-modules"
import { getTrainingModules, getUserSecurityScore, getSecurityTips } from "@/utils/training-utils"
import { verifyWithBlockchain } from "@/utils/blockchain-utils"
import { analyzeInCloud } from "@/utils/cloud-utils"
import type {
  AdvancedOptions,
  AnalysisResult,
  UrlScanResult,
  SensitivityLevel,
  AnalysisMode,
  ThreatLevel,
} from "@/types/phishing-detector"

export function PhishingDetector() {
  const [email, setEmail] = useState("")
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [urlResults, setUrlResults] = useState<UrlScanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("email")
  const [blockchainVerification, setBlockchainVerification] = useState<any>(null)
  const [cloudAnalysis, setCloudAnalysis] = useState<any>(null)
  const [trainingModules, setTrainingModules] = useState(getTrainingModules())
  const [securityScore, setSecurityScore] = useState(getUserSecurityScore())
  const [securityTips, setSecurityTips] = useState<string[]>([])
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    checkLinks: true,
    checkAttachments: true,
    useAI: true,
    useBlockchain: true,
    useRealTimeThreatIntel: true,
    useUserBehaviorProfiling: true,
    sensitivity: "adaptive" as SensitivityLevel,
    analysisMode: "ai" as AnalysisMode,
    autoResponse: true,
    cloudAnalysis: true,
  })

  const handleAnalysis = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setBlockchainVerification(null)
    setCloudAnalysis(null)
    setSecurityTips([])

    try {
      // If blockchain verification is enabled, start it in parallel
      let blockchainPromise = null
      if (advancedOptions.useBlockchain) {
        blockchainPromise = verifyWithBlockchain("sender@example.com", email)
      }

      // If cloud analysis is enabled, start it in parallel
      let cloudPromise = null
      if (advancedOptions.cloudAnalysis) {
        cloudPromise = analyzeInCloud(email)
      }

      // Run the main analysis
      const analysisResult = await analyzeEmail(email, advancedOptions)
      setResult(analysisResult)

      // Wait for blockchain verification if it was started
      if (blockchainPromise) {
        const blockchainResult = await blockchainPromise
        setBlockchainVerification(blockchainResult)
      }

      // Wait for cloud analysis if it was started
      if (cloudPromise) {
        const cloudResult = await cloudPromise
        setCloudAnalysis(cloudResult)
      }

      // Generate security tips based on the analysis
      setSecurityTips(getSecurityTips(analysisResult.indicators.map((i) => i.name)))
    } catch (err) {
      setError("An error occurred while analyzing the email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUrlScan = async () => {
    setLoading(true)
    setError(null)
    setUrlResults([])

    try {
      const scanResult = await scanUrls([url], advancedOptions)
      setUrlResults(scanResult)
    } catch (err) {
      setError("An error occurred while scanning the URL. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getThreatLevelColor = (level: ThreatLevel) => {
    switch (level) {
      case "critical":
        return "text-destructive"
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      case "low":
        return "text-warning"
      case "safe":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  const getThreatLevelBg = (level: ThreatLevel) => {
    switch (level) {
      case "critical":
        return "bg-destructive/10"
      case "high":
        return "bg-destructive/10"
      case "medium":
        return "bg-warning/10"
      case "low":
        return "bg-warning/10"
      case "safe":
        return "bg-success/10"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Advanced Phishing Detection Suite
          </CardTitle>
          <CardDescription>Analyze emails and scan URLs using AI, blockchain, and cloud technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Analysis</TabsTrigger>
              <TabsTrigger value="url">URL Scan</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Textarea
                placeholder="Paste email content here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                rows={10}
                className="mb-4"
              />

              <Accordion type="single" collapsible defaultValue="options">
                <AccordionItem value="options">
                  <AccordionTrigger>Advanced Detection Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="check-links"
                            checked={advancedOptions.checkLinks}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, checkLinks: checked }))
                            }
                          />
                          <Label htmlFor="check-links">Check links in email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="check-attachments"
                            checked={advancedOptions.checkAttachments}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, checkAttachments: checked }))
                            }
                          />
                          <Label htmlFor="check-attachments">Analyze attachments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-ai"
                            checked={advancedOptions.useAI}
                            onCheckedChange={(checked) => setAdvancedOptions((prev) => ({ ...prev, useAI: checked }))}
                          />
                          <Label htmlFor="use-ai" className="flex items-center gap-1">
                            <Brain className="h-4 w-4" /> Use AI analysis
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-blockchain"
                            checked={advancedOptions.useBlockchain}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, useBlockchain: checked }))
                            }
                          />
                          <Label htmlFor="use-blockchain" className="flex items-center gap-1">
                            <Shield className="h-4 w-4" /> Blockchain verification
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-threat-intel"
                            checked={advancedOptions.useRealTimeThreatIntel}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, useRealTimeThreatIntel: checked }))
                            }
                          />
                          <Label htmlFor="use-threat-intel" className="flex items-center gap-1">
                            <Zap className="h-4 w-4" /> Real-time threat intelligence
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-behavior"
                            checked={advancedOptions.useUserBehaviorProfiling}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, useUserBehaviorProfiling: checked }))
                            }
                          />
                          <Label htmlFor="use-behavior" className="flex items-center gap-1">
                            <User className="h-4 w-4" /> User behavior profiling
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-cloud"
                            checked={advancedOptions.cloudAnalysis}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, cloudAnalysis: checked }))
                            }
                          />
                          <Label htmlFor="use-cloud" className="flex items-center gap-1">
                            <Cloud className="h-4 w-4" /> Cloud-based analysis
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="auto-response"
                            checked={advancedOptions.autoResponse}
                            onCheckedChange={(checked) =>
                              setAdvancedOptions((prev) => ({ ...prev, autoResponse: checked }))
                            }
                          />
                          <Label htmlFor="auto-response">Automated incident response</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="sensitivity" className="mb-1 block">
                          Analysis Sensitivity:
                        </Label>
                        <Select
                          value={advancedOptions.sensitivity}
                          onValueChange={(value: SensitivityLevel) =>
                            setAdvancedOptions((prev) => ({ ...prev, sensitivity: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sensitivity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="adaptive">Adaptive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="analysis-mode" className="mb-1 block">
                          Analysis Mode:
                        </Label>
                        <Select
                          value={advancedOptions.analysisMode}
                          onValueChange={(value: AnalysisMode) =>
                            setAdvancedOptions((prev) => ({ ...prev, analysisMode: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="ai">AI-Powered</SelectItem>
                            <SelectItem value="blockchain">Blockchain-Verified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                onClick={handleAnalysis}
                disabled={loading || email.trim().length === 0}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                {loading ? "Analyzing..." : "Analyze Email"}
              </Button>
            </TabsContent>
            <TabsContent value="url">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="Enter URL to scan"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleUrlScan}
                    disabled={loading || url.trim().length === 0}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    {loading ? "Scanning..." : "Scan URL"}
                  </Button>
                </div>

                <Accordion type="single" collapsible defaultValue="url-options">
                  <AccordionItem value="url-options">
                    <AccordionTrigger>Scan Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="url-sensitivity" className="mb-1 block">
                            Scan Sensitivity:
                          </Label>
                          <Select
                            value={advancedOptions.sensitivity}
                            onValueChange={(value: SensitivityLevel) =>
                              setAdvancedOptions((prev) => ({ ...prev, sensitivity: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sensitivity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="adaptive">Adaptive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="url-blockchain"
                              checked={advancedOptions.useBlockchain}
                              onCheckedChange={(checked) =>
                                setAdvancedOptions((prev) => ({ ...prev, useBlockchain: checked }))
                              }
                            />
                            <Label htmlFor="url-blockchain">Blockchain verification</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="url-threat-intel"
                              checked={advancedOptions.useRealTimeThreatIntel}
                              onCheckedChange={(checked) =>
                                setAdvancedOptions((prev) => ({ ...prev, useRealTimeThreatIntel: checked }))
                              }
                            />
                            <Label htmlFor="url-threat-intel">Real-time threat intelligence</Label>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <Card
            className={`${getThreatLevelBg(result.threatLevel)} border-2 ${result.threatLevel === "safe" ? "border-success" : result.threatLevel === "low" || result.threatLevel === "medium" ? "border-warning" : "border-destructive"}`}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className={`text-xl ${getThreatLevelColor(result.threatLevel)}`}>
                  {result.threatLevel === "safe"
                    ? "Safe Content"
                    : result.threatLevel === "low"
                      ? "Low Risk Detected"
                      : result.threatLevel === "medium"
                        ? "Medium Risk Detected"
                        : result.threatLevel === "high"
                          ? "High Risk Detected"
                          : "Critical Threat Detected"}
                </CardTitle>
                <Badge
                  variant={
                    result.threatLevel === "safe"
                      ? "success"
                      : result.threatLevel === "low" || result.threatLevel === "medium"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {result.threatLevel.charAt(0).toUpperCase() + result.threatLevel.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                {result.threatLevel === "safe"
                  ? "This content appears to be legitimate and safe"
                  : "This content contains suspicious elements that may indicate a phishing attempt"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Phishing Score</span>
                    <span className="text-sm font-medium">{(result.score * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={result.score * 100}
                    className="h-2"
                    color={result.score > 0.7 ? "bg-destructive" : result.score > 0.3 ? "bg-warning" : "bg-success"}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Analysis Accuracy</span>
                    <span className="text-sm font-medium">{(result.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={result.accuracy * 100} className="h-2" />
                </div>

                {result.suggestedActions && result.suggestedActions.length > 0 && (
                  <div className="mt-4 p-3 rounded-md bg-muted">
                    <h3 className="text-sm font-medium mb-2">Recommended Actions:</h3>
                    <ul className="space-y-1">
                      {result.suggestedActions.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detection Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detection Details</CardTitle>
                <CardDescription>Indicators found in the analysis</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {result.indicators.length > 0 ? (
                    result.indicators.map((indicator, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${indicator.severity === "high" ? "bg-destructive/10" : indicator.severity === "medium" ? "bg-warning/10" : "bg-muted"}`}
                      >
                        <div className="flex items-start gap-2">
                          {indicator.severity === "high" ? (
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          ) : indicator.severity === "medium" ? (
                            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                          ) : (
                            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium">{indicator.name}</p>
                            <p className="text-sm text-muted-foreground">{indicator.description}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Confidence: {(indicator.confidence * 100).toFixed(0)}%
                              </span>
                              <span className="text-xs text-muted-foreground">Severity: {indicator.severity}</span>
                              <span className="text-xs text-muted-foreground">Category: {indicator.category}</span>
                              <Badge variant="outline" className="text-xs">
                                {indicator.detectionMethod}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>No suspicious indicators detected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Security Profile</CardTitle>
                  <Badge variant="outline">{securityScore.level}</Badge>
                </div>
                <CardDescription>Your security score and personalized tips</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Security Score</span>
                    <span className="text-sm font-medium">{securityScore.score} / 1000</span>
                  </div>
                  <Progress value={securityScore.score / 10} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{securityScore.level}</span>
                    <span>{securityScore.nextLevel}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-sm font-medium mb-2">Security Tips:</h3>
                  <ul className="space-y-2">
                    {securityTips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.aiConfidence && (
              <AIAnalysisCard score={result.score} confidence={result.aiConfidence} indicators={result.indicators} />
            )}

            {blockchainVerification && <BlockchainVerificationCard verification={blockchainVerification} />}

            {result.behavioralInsights && result.behavioralInsights.length > 0 && (
              <BehavioralInsightsCard insights={result.behavioralInsights} />
            )}

            {cloudAnalysis && <CloudAnalysisCard result={cloudAnalysis} />}
          </div>

          {/* Training Modules */}
          <TrainingModulesCard modules={trainingModules} />
        </div>
      )}

      {urlResults.length > 0 && (
        <div className="space-y-4">
          {urlResults.map((result, index) => (
            <Card
              key={index}
              className={`${getThreatLevelBg(result.threatLevel)} border-2 ${result.isSafe ? "border-success" : "border-destructive"}`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    {result.isSafe ? "Safe URL" : "Potentially Unsafe URL"}
                  </CardTitle>
                  <Badge variant={result.isSafe ? "success" : "destructive"}>
                    {result.threatLevel.charAt(0).toUpperCase() + result.threatLevel.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{result.url}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.reason && (
                    <div className="p-3 rounded-md bg-muted">
                      <p className="text-sm">{result.reason}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={result.confidence * 100} className="h-2" />
                  </div>

                  {result.blockchainVerified !== undefined && (
                    <div className="flex items-center gap-2">
                      <Shield
                        className={`h-4 w-4 ${result.blockchainVerified ? "text-success" : "text-destructive"}`}
                      />
                      <span className="text-sm">
                        {result.blockchainVerified ? "Verified on blockchain" : "Not verified on blockchain"}
                      </span>
                    </div>
                  )}

                  {result.detectionMethods && result.detectionMethods.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Detection Methods:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.detectionMethods.map((method, idx) => (
                          <Badge key={idx} variant="outline">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.categories && result.categories.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.categories.map((category, idx) => (
                          <Badge key={idx} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.firstSeen && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">First seen:</span>
                        <p>{new Date(result.firstSeen).toLocaleDateString()}</p>
                      </div>
                      {result.lastSeen && (
                        <div>
                          <span className="text-muted-foreground">Last seen:</span>
                          <p>{new Date(result.lastSeen).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {result.relatedThreats && result.relatedThreats.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Related threats:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.relatedThreats.map((threat, idx) => (
                          <Badge key={idx} variant="destructive">
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

