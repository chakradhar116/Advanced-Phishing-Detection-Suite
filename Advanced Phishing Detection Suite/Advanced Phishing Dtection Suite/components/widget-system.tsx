"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GripVertical,
  X,
  Maximize2,
  Minimize2,
  Settings,
  Plus,
  BarChart4,
  Shield,
  Globe,
  Users,
  Mail,
  Link,
  FileText,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface Widget {
  id: string
  type: string
  title: string
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  isMinimized: boolean
}

const widgetTypes = [
  { id: "threat-summary", icon: Shield, title: "Threat Summary" },
  { id: "recent-alerts", icon: AlertTriangle, title: "Recent Alerts" },
  { id: "email-stats", icon: Mail, title: "Email Statistics" },
  { id: "url-analysis", icon: Link, title: "URL Analysis" },
  { id: "user-activity", icon: Users, title: "User Activity" },
  { id: "global-threats", icon: Globe, title: "Global Threats" },
  { id: "trend-chart", icon: BarChart4, title: "Trend Chart" },
  { id: "attachment-scan", icon: FileText, title: "Attachment Scan" },
]

export function WidgetSystem() {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "1",
      type: "threat-summary",
      title: "Threat Summary",
      size: "medium",
      position: { x: 0, y: 0 },
      isMinimized: false,
    },
    {
      id: "2",
      type: "recent-alerts",
      title: "Recent Alerts",
      size: "small",
      position: { x: 0, y: 0 },
      isMinimized: false,
    },
  ])

  const [activeWidget, setActiveWidget] = useState<string | null>(null)
  const constraintsRef = useRef(null)

  const handleAddWidget = (type: string, title: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title,
      size: "medium",
      position: { x: 0, y: 0 },
      isMinimized: false,
    }

    setWidgets((prev) => [...prev, newWidget])
  }

  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id))
  }

  const handleToggleMinimize = (id: string) => {
    setWidgets((prev) =>
      prev.map((widget) => (widget.id === id ? { ...widget, isMinimized: !widget.isMinimized } : widget)),
    )
  }

  const handleChangeSize = (id: string, size: "small" | "medium" | "large") => {
    setWidgets((prev) => prev.map((widget) => (widget.id === id ? { ...widget, size } : widget)))
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1"
      case "medium":
        return "col-span-1 md:col-span-2"
      case "large":
        return "col-span-1 md:col-span-3"
      default:
        return "col-span-1"
    }
  }

  const getWidgetIcon = (type: string) => {
    const widgetType = widgetTypes.find((w) => w.id === type)
    if (widgetType) {
      const Icon = widgetType.icon
      return <Icon className="h-5 w-5" />
    }
    return <Shield className="h-5 w-5" />
  }

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "threat-summary":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span>Critical Threats</span>
              </div>
              <span className="font-bold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span>Medium Threats</span>
              </div>
              <span className="font-bold">28</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span>Resolved</span>
              </div>
              <span className="font-bold">45</span>
            </div>
          </div>
        )

      case "recent-alerts":
        return (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-2 rounded-md bg-muted flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Suspicious Login Attempt</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        )

      case "email-stats":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Scanned</span>
              <span className="font-bold">1,245</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phishing Detected</span>
              <span className="font-bold text-destructive">87</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Safe Emails</span>
              <span className="font-bold text-success">1,158</span>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Widget content for {widget.title}
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customizable Dashboard</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Available Widgets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {widgetTypes.map((type) => (
              <DropdownMenuItem key={type.id} onClick={() => handleAddWidget(type.id, type.title)}>
                <type.icon className="mr-2 h-4 w-4" />
                <span>{type.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        ref={constraintsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[400px] p-4 rounded-lg border border-dashed border-border"
      >
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            className={`${getSizeClass(widget.size)}`}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setActiveWidget(widget.id)}
            onDragEnd={() => setActiveWidget(null)}
            whileDrag={{ zIndex: 10 }}
            style={{ zIndex: activeWidget === widget.id ? 10 : 1 }}
          >
            <Card
              className={`h-full border ${activeWidget === widget.id ? "border-primary" : "border-border"} shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <CardHeader className="p-3 flex flex-row items-center justify-between bg-muted/50">
                <div className="flex items-center gap-2 cursor-move" style={{ touchAction: "none" }}>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {getWidgetIcon(widget.type)}
                  <CardTitle className="text-sm">{widget.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Widget Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangeSize(widget.id, "small")}>
                        Small Size
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeSize(widget.id, "medium")}>
                        Medium Size
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeSize(widget.id, "large")}>
                        Large Size
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleToggleMinimize(widget.id)}
                  >
                    {widget.isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveWidget(widget.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {!widget.isMinimized && <CardContent className="p-4">{renderWidgetContent(widget)}</CardContent>}
            </Card>
          </motion.div>
        ))}

        {widgets.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-40 text-muted-foreground">
            <div className="mb-2">No widgets added yet</div>
            <Button variant="outline" onClick={() => handleAddWidget("threat-summary", "Threat Summary")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Widget
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

