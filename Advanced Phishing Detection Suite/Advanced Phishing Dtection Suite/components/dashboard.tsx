"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Mail,
  Link,
  Users,
  Globe,
  Activity,
  Info,
} from "lucide-react"
import { motion } from "framer-motion"
import { getUserSecurityScore } from "@/utils/training-utils"

// Sample data for charts
const threatData = [
  { name: "Jan", phishing: 65, malware: 40, safe: 240 },
  { name: "Feb", phishing: 59, malware: 45, safe: 230 },
  { name: "Mar", phishing: 80, malware: 50, safe: 210 },
  { name: "Apr", phishing: 81, malware: 55, safe: 190 },
  { name: "May", phishing: 56, malware: 60, safe: 220 },
  { name: "Jun", phishing: 55, malware: 45, safe: 250 },
  { name: "Jul", phishing: 40, malware: 30, safe: 270 },
]

const detectionMethodData = [
  { name: "AI", value: 45 },
  { name: "Blockchain", value: 20 },
  { name: "Pattern", value: 25 },
  { name: "Threat Intel", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const securityMetrics = [
  {
    title: "Threats Blocked",
    value: 1243,
    change: 12.5,
    increasing: true,
    icon: Shield,
    color: "text-primary",
  },
  {
    title: "Phishing Attempts",
    value: 87,
    change: -3.2,
    increasing: false,
    icon: Mail,
    color: "text-destructive",
  },
  {
    title: "Malicious URLs",
    value: 156,
    change: 8.7,
    increasing: true,
    icon: Link,
    color: "text-warning",
  },
  {
    title: "User Training",
    value: 78,
    change: 15.3,
    increasing: true,
    icon: Users,
    color: "text-success",
  },
]

const recentAlerts = [
  {
    id: 1,
    title: "Phishing Attempt Detected",
    description: "A suspicious email was blocked from user@example.com",
    time: "10 minutes ago",
    severity: "high",
  },
  {
    id: 2,
    title: "Malicious URL Blocked",
    description: "Attempted access to malicious-site.com was prevented",
    time: "25 minutes ago",
    severity: "high",
  },
  {
    id: 3,
    title: "Unusual Login Activity",
    description: "Multiple login attempts from unknown location",
    time: "1 hour ago",
    severity: "medium",
  },
  {
    id: 4,
    title: "Security Scan Completed",
    description: "Weekly security scan completed with 2 warnings",
    time: "3 hours ago",
    severity: "low",
  },
]

const globalThreatMap = [
  { country: "US", threats: 1245, lat: 37.0902, lng: -95.7129 },
  { country: "CN", threats: 2341, lat: 35.8617, lng: 104.1954 },
  { country: "RU", threats: 1876, lat: 61.524, lng: 105.3188 },
  { country: "BR", threats: 945, lat: -14.235, lng: -51.9253 },
  { country: "IN", threats: 1532, lat: 20.5937, lng: 78.9629 },
  { country: "GB", threats: 687, lat: 55.3781, lng: -3.436 },
  { country: "DE", threats: 892, lat: 51.1657, lng: 10.4515 },
]

export function Dashboard() {
  const [securityScore, setSecurityScore] = useState(getUserSecurityScore())
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time security monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </Button>
          <Button variant="default" size="sm">
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="global">Global Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Score Card with Glassmorphism */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden border border-primary/20 bg-background/60 backdrop-blur-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Score
                </CardTitle>
                <CardDescription>Your current security posture and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">{securityScore.score}</div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * securityScore.score) / 1000}
                        className="text-primary/20"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        className="text-primary"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * securityScore.score) / 1000}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Current Level: {securityScore.level}</span>
                        <span className="text-sm font-medium">Next: {securityScore.nextLevel}</span>
                      </div>
                      <Progress value={securityScore.progress * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <div>
                          <div className="text-sm font-medium">Strengths</div>
                          <div className="text-xs text-muted-foreground">Email security, 2FA enabled</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <div>
                          <div className="text-sm font-medium">Weaknesses</div>
                          <div className="text-xs text-muted-foreground">Password strength, training</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold mt-1">{metric.value}</p>
                      </div>
                      <div
                        className={`p-2 rounded-full ${metric.color}/10 group-hover:${metric.color}/20 transition-colors duration-300`}
                      >
                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      {metric.increasing ? (
                        <TrendingUp className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      )}
                      <span className={`text-xs ${metric.increasing ? "text-success" : "text-destructive"}`}>
                        {metric.change}% {metric.increasing ? "increase" : "decrease"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Threat Trends</CardTitle>
                  <CardDescription>Monthly detection statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={threatData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="phishing" fill="hsl(var(--destructive))" name="Phishing" />
                        <Bar dataKey="malware" fill="hsl(var(--warning))" name="Malware" />
                        <Bar dataKey="safe" fill="hsl(var(--success))" name="Safe" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Detection Methods</CardTitle>
                  <CardDescription>Breakdown by technology</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={detectionMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {detectionMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest security notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
                    >
                      {alert.severity === "high" ? (
                        <div className="p-2 rounded-full bg-destructive/10">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                      ) : alert.severity === "medium" ? (
                        <div className="p-2 rounded-full bg-warning/10">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-muted">
                          <Info className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge
                            variant={
                              alert.severity === "high"
                                ? "destructive"
                                : alert.severity === "medium"
                                  ? "warning"
                                  : "outline"
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* Threat Analysis Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Threat Distribution</CardTitle>
                <CardDescription>Analysis by category and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={threatData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="phishing"
                        stroke="hsl(var(--destructive))"
                        activeDot={{ r: 8 }}
                        name="Phishing"
                      />
                      <Line type="monotone" dataKey="malware" stroke="hsl(var(--warning))" name="Malware" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Threat Vectors</CardTitle>
                <CardDescription>Most common attack methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Phishing Emails</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Malicious URLs</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Social Engineering</span>
                      <span className="text-sm font-medium">37%</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Credential Theft</span>
                      <span className="text-sm font-medium">29%</span>
                    </div>
                    <Progress value={29} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Malware Distribution</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threat Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Heatmap</CardTitle>
              <CardDescription>Intensity of attacks by time and category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full overflow-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-24 gap-1">
                    {/* Time labels */}
                    <div className="col-span-1"></div>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="text-xs text-center text-muted-foreground">
                        {i}:00
                      </div>
                    ))}

                    {/* Heatmap rows */}
                    {["Phishing", "Malware", "Ransomware", "Data Theft", "DDoS"].map((category, rowIndex) => (
                      <React.Fragment key={category}>
                        <div className="text-xs text-muted-foreground">{category}</div>
                        {Array.from({ length: 24 }).map((_, colIndex) => {
                          // Generate random intensity for demo
                          const intensity = Math.random()
                          let bgColor = "bg-success/10"

                          if (intensity > 0.7) bgColor = "bg-destructive/80"
                          else if (intensity > 0.5) bgColor = "bg-destructive/50"
                          else if (intensity > 0.3) bgColor = "bg-warning/50"
                          else if (intensity > 0.1) bgColor = "bg-warning/30"

                          return (
                            <div
                              key={colIndex}
                              className={`h-8 rounded ${bgColor} hover:opacity-80 transition-opacity duration-200 cursor-pointer`}
                              title={`${category}: ${Math.round(intensity * 100)} incidents at ${colIndex}:00`}
                            ></div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-success/10"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-warning/30"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-destructive/50"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-destructive/80"></div>
                  <span className="text-xs">Critical</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          {/* Global Threat Map */}
          <Card>
            <CardHeader>
              <CardTitle>Global Threat Intelligence</CardTitle>
              <CardDescription>Worldwide security incident distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] relative overflow-hidden rounded-lg border border-border">
                <div className="absolute inset-0 bg-muted/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-3xl">
                    {/* World map visualization */}
                    <svg
                      viewBox="0 0 1000 500"
                      className="w-full h-full"
                      style={{ filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))" }}
                    >
                      {/* Simplified world map background */}
                      <path
                        d="M150,100 Q400,50 600,100 T900,150 Q700,300 500,350 T150,300 Q250,200 150,100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                      />

                      {/* Threat hotspots */}
                      {globalThreatMap.map((location, index) => {
                        // Convert lat/lng to x,y coordinates (simplified)
                        const x = ((location.lng + 180) / 360) * 1000
                        const y = ((90 - location.lat) / 180) * 500

                        // Size based on threat count
                        const size = Math.max(10, Math.min(40, location.threats / 100))

                        return (
                          <g key={index}>
                            <circle
                              cx={x}
                              cy={y}
                              r={size}
                              fill="hsl(var(--destructive))"
                              opacity="0.2"
                              className="animate-pulse"
                            />
                            <circle cx={x} cy={y} r={size / 2} fill="hsl(var(--destructive))" opacity="0.6" />
                            <text
                              x={x}
                              y={y + size + 15}
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="12"
                              className="text-foreground"
                            >
                              {location.country}
                            </text>
                            <text
                              x={x}
                              y={y + size + 30}
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="10"
                              className="text-muted-foreground"
                            >
                              {location.threats}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border">
                  <div className="text-xs font-medium mb-2">Threat Intensity</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive opacity-60"></div>
                    <span className="text-xs">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning opacity-60"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success opacity-60"></div>
                    <span className="text-xs">Low</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Attack Origins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Russia</span>
                    </div>
                    <Badge>28.4%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>China</span>
                    </div>
                    <Badge>23.7%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>North Korea</span>
                    </div>
                    <Badge>15.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Iran</span>
                    </div>
                    <Badge>12.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Brazil</span>
                    </div>
                    <Badge>8.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Most Targeted Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Financial Services</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Healthcare</span>
                      <span className="text-sm font-medium">64%</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Government</span>
                      <span className="text-sm font-medium">58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Education</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Emerging Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 rounded-md bg-destructive/10 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">AI-Generated Phishing</p>
                      <p className="text-xs text-muted-foreground">Increasing 43% month-over-month</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-warning/10 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Supply Chain Attacks</p>
                      <p className="text-xs text-muted-foreground">Targeting software dependencies</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-muted flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Deepfake Social Engineering</p>
                      <p className="text-xs text-muted-foreground">Voice and video impersonation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

