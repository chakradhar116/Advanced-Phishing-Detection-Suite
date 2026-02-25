import { PhishingDetector } from "@/components/phishing-detector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Dashboard } from "@/components/dashboard"
import { ThreatVisualization3D } from "@/components/threat-visualization-3d"
import { SecurityAssistant } from "@/components/security-assistant"
import { WidgetSystem } from "@/components/widget-system"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { NotificationSystem } from "@/components/notification-system"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Shield, BarChart, CuboidIcon as Cube, Settings, Layers, PanelLeft, Palette } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header with glassmorphism effect */}
      <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Advanced Phishing Detection Suite</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationSystem />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="detection" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Detection</span>
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <Cube className="h-4 w-4" />
                <span className="hidden sm:inline">Visualization</span>
              </TabsTrigger>
              <TabsTrigger value="widgets" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Widgets</span>
              </TabsTrigger>
            </TabsList>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <PanelLeft className="h-4 w-4" />
                <span>Sidebar</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Palette className="h-4 w-4" />
                <span>Customize</span>
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="detection" className="space-y-6">
            <div id="email-analysis">
              <PhishingDetector />
            </div>
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <ThreatVisualization3D />
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <WidgetSystem />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="mt-12 py-6 border-t border-border bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Advanced Phishing Detection Suite with AI, Blockchain, and Cloud Integration</p>
          <p className="mt-1">© 2023 Security Technologies. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive components */}
      <SecurityAssistant />
      <InteractiveTutorial />
    </main>
  )
}

