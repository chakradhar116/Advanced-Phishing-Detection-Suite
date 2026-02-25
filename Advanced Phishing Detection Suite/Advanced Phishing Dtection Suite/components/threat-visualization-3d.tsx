"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

export function ThreatVisualization3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 3D point data (in a real app, this would be threat data)
    const points = Array.from({ length: 100 }, () => ({
      x: Math.random() * 2 - 1, // -1 to 1
      y: Math.random() * 2 - 1, // -1 to 1
      z: Math.random() * 2 - 1, // -1 to 1
      size: Math.random() * 5 + 2,
      color: Math.random() > 0.7 ? "red" : Math.random() > 0.5 ? "orange" : "green",
      label: Math.random() > 0.7 ? "High Risk" : Math.random() > 0.5 ? "Medium Risk" : "Low Risk",
    }))

    // Camera position and rotation
    let cameraRotationX = 0
    let cameraRotationY = 0
    let cameraDistance = 5

    // Animation
    let animationFrameId: number
    let isDragging = false
    let lastMouseX = 0
    let lastMouseY = 0

    // Mouse events for rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      lastMouseX = e.clientX
      lastMouseY = e.clientY
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - lastMouseX
      const deltaY = e.clientY - lastMouseY

      cameraRotationY += deltaX * 0.01
      cameraRotationX += deltaY * 0.01

      lastMouseX = e.clientX
      lastMouseY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    // Zoom with mouse wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      cameraDistance += e.deltaY * 0.01
      cameraDistance = Math.max(2, Math.min(10, cameraDistance))
    }

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("wheel", handleWheel)

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Sort points by z for proper rendering (painter's algorithm)
      const sortedPoints = [...points].sort((a, b) => {
        // Apply rotation to z for sorting
        const aZ = a.z * Math.cos(cameraRotationY) - a.x * Math.sin(cameraRotationY)
        const bZ = b.z * Math.cos(cameraRotationY) - b.x * Math.sin(cameraRotationY)
        return aZ - bZ
      })

      // Draw axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 1

      // X axis
      ctx.beginPath()
      ctx.moveTo(centerX - 100, centerY)
      ctx.lineTo(centerX + 100, centerY)
      ctx.stroke()

      // Y axis
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - 100)
      ctx.lineTo(centerX, centerY + 100)
      ctx.stroke()

      // Draw points
      sortedPoints.forEach((point) => {
        // Apply rotation around Y axis
        const x = point.x
        const z = point.z

        const cosY = Math.cos(cameraRotationY)
        const sinY = Math.sin(cameraRotationY)
        const rotatedX = x * cosY + z * sinY
        const rotatedZ = z * cosY - x * sinY

        // Apply rotation around X axis
        const y = point.y

        const cosX = Math.cos(cameraRotationX)
        const sinX = Math.sin(cameraRotationX)
        const rotatedY = y * cosX - rotatedZ * sinX
        const finalZ = rotatedZ * cosX + y * sinX

        // Apply perspective
        const scale = cameraDistance / (cameraDistance + finalZ)
        const projectedX = centerX + rotatedX * scale * 200
        const projectedY = centerY + rotatedY * scale * 200

        // Size with perspective
        const size = point.size * scale

        // Color based on distance (for depth effect)
        const alpha = 0.5 + 0.5 * (1 - (finalZ + 1) / 2)

        // Draw point
        ctx.beginPath()
        ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2)

        // Fill with color
        if (point.color === "red") {
          ctx.fillStyle = `rgba(220, 50, 50, ${alpha})`
        } else if (point.color === "orange") {
          ctx.fillStyle = `rgba(255, 150, 50, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(50, 200, 50, ${alpha})`
        }

        ctx.fill()

        // Draw outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw label for larger points
        if (size > 4 && finalZ > -0.5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.font = `${Math.max(10, size * 2)}px sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(point.label, projectedX, projectedY + size + 10)
        }
      })

      // Continue animation
      animationFrameId = requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    // Auto-rotate slightly
    const autoRotateInterval = setInterval(() => {
      if (!isDragging) {
        cameraRotationY += 0.005
      }
    }, 50)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(autoRotateInterval)
      canvas.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("wheel", handleWheel)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const handleReset = () => {
    if (canvasRef.current) {
      // Reset camera position
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleZoomIn = () => {
    // Implement zoom in functionality
  }

  const handleZoomOut = () => {
    // Implement zoom out functionality
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cube className="h-5 w-5 text-primary" />
              3D Threat Visualization
            </CardTitle>
            <CardDescription>Interactive visualization of security threats</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full h-[400px] bg-gradient-to-b from-background to-muted/50 overflow-hidden"
        >
          <canvas ref={canvasRef} className="w-full h-full cursor-move" />
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Risk Threats</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Medium Risk Threats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low Risk Threats</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">Drag to rotate • Scroll to zoom</div>
        </div>
      </CardContent>
    </Card>
  )
}

