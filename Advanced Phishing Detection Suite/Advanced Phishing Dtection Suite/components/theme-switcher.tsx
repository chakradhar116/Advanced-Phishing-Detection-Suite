"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Zap, TreesIcon as Tree, Palette, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customColors, setCustomColors] = useState({
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
  })

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "cyberpunk", name: "Cyberpunk", icon: Zap },
    { id: "forest", name: "Forest", icon: Tree },
  ]

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }))
  }

  const applyCustomTheme = () => {
    // In a real implementation, this would update CSS variables
    // For now, we'll just close the dialog
    setIsCustomizing(false)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : theme === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : theme === "cyberpunk" ? (
              <Zap className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Tree className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => setTheme(item.id as any)}
              className="flex items-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
              {theme === item.id && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCustomizing(true)}>
            <Palette className="h-4 w-4 mr-2" />
            Customize Theme
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Theme</DialogTitle>
            <DialogDescription>Personalize your interface with custom colors.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="colors" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            <TabsContent value="colors" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primary" className="text-right">
                    Primary
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customColors.primary }} />
                    <Input
                      id="primary"
                      type="text"
                      value={customColors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secondary" className="text-right">
                    Secondary
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customColors.secondary }} />
                    <Input
                      id="secondary"
                      type="text"
                      value={customColors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accent" className="text-right">
                    Accent
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customColors.accent }} />
                    <Input
                      id="accent"
                      type="text"
                      value={customColors.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="background" className="text-right">
                    Background
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customColors.background }} />
                    <Input
                      id="background"
                      type="text"
                      value={customColors.background}
                      onChange={(e) => handleColorChange("background", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="effects" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="glassmorphism">Glassmorphism</Label>
                  <input type="checkbox" id="glassmorphism" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enhanced Animations</Label>
                  <input type="checkbox" id="animations" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shadows">Deep Shadows</Label>
                  <input type="checkbox" id="shadows" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="rounded">Rounded Corners</Label>
                  <input type="checkbox" id="rounded" className="toggle" checked />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizing(false)}>
              Cancel
            </Button>
            <Button onClick={applyCustomTheme}>Apply Theme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

