"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Search,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Cloud,
  Droplets,
  Thermometer,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSustentraStore } from "@/lib/sustentra-store"
import { cn } from "@/lib/utils"

export function AppHeader() {
  const [mounted, setMounted] = useState(false)
  const { weather, alerts, devices, acknowledgeAlert } = useSustentraStore()
  
  const unreadAlerts = alerts.filter(a => !a.acknowledged)
  const onlineDevices = devices.filter(d => d.status === "online").length
  const totalDevices = devices.length

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative hidden md:flex flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sensores, dispositivos, automacoes..."
              className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Weather Quick View */}
          {mounted && weather && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium" suppressHydrationWarning>{weather.temperature}°C</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium" suppressHydrationWarning>{weather.humidity}%</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium" suppressHydrationWarning>{weather.rainProbability}%</span>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <div className={cn(
            "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg",
            onlineDevices > 0 ? "bg-primary/10" : "bg-destructive/10"
          )}>
            {onlineDevices > 0 ? (
              <Wifi className="h-4 w-4 text-primary" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium" suppressHydrationWarning>
              {onlineDevices}/{totalDevices}
            </span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center"
                  >
                    {unreadAlerts.length}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificacoes</span>
                {unreadAlerts.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadAlerts.length} novas
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadAlerts.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Nenhuma notificacao</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {unreadAlerts.slice(0, 5).map((alert) => (
                    <DropdownMenuItem
                      key={alert.id}
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          alert.severity === "critical" && "bg-destructive",
                          alert.severity === "warning" && "bg-yellow-500",
                          alert.severity === "info" && "bg-primary"
                        )} />
                        <span className="font-medium text-sm">{alert.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground pl-4">{alert.message}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}
