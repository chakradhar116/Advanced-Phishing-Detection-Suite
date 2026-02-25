"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  timestamp: Date
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showToast, setShowToast] = useState(false)
  const [currentToast, setCurrentToast] = useState<Notification | null>(null)

  // Simulate receiving notifications
  useEffect(() => {
    const notificationTypes = ["info", "warning", "error", "success"]
    const notificationTitles = [
      "Security Scan Complete",
      "Suspicious Login Detected",
      "Phishing Attempt Blocked",
      "System Update Available",
      "New Threat Intelligence",
    ]
    const notificationMessages = [
      "Weekly security scan completed successfully with no issues found.",
      "Unusual login attempt detected from an unknown location.",
      "A phishing email was automatically blocked from reaching your inbox.",
      "A new security update is available for your system.",
      "New threat intelligence has been added to the database.",
    ]

    // Add initial notifications
    const initialNotifications: Notification[] = [
      {
        id: "1",
        title: "Welcome to Advanced Security",
        message: "Your security dashboard is now active and monitoring for threats.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: "2",
        title: "Security Scan Scheduled",
        message: "Your first automated security scan is scheduled for tomorrow.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ]

    setNotifications(initialNotifications)

    // Simulate new notifications periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new notification
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as
          | "info"
          | "warning"
          | "error"
          | "success"
        const titleIndex = Math.floor(Math.random() * notificationTitles.length)

        const newNotification: Notification = {
          id: Date.now().toString(),
          title: notificationTitles[titleIndex],
          message: notificationMessages[titleIndex],
          type,
          read: false,
          timestamp: new Date(),
        }

        setNotifications((prev) => [newNotification, ...prev])
        setCurrentToast(newNotification)
        setShowToast(true)

        // Hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false)
        }, 5000)
      }
    }, 20000) // Check every 20 seconds

    return () => clearInterval(interval)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
                Clear all
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0">
                    <div className={`w-full p-3 ${notification.read ? "" : "bg-muted/50"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {notification.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && currentToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-4 left-1/2 z-50 w-80 bg-background border border-border shadow-lg rounded-lg overflow-hidden"
          >
            <div
              className={`h-1 ${
                currentToast.type === "error"
                  ? "bg-destructive"
                  : currentToast.type === "warning"
                    ? "bg-warning"
                    : currentToast.type === "success"
                      ? "bg-success"
                      : "bg-primary"
              }`}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(currentToast.type)}
                  <div>
                    <div className="font-medium">{currentToast.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{currentToast.message}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={() => setShowToast(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

