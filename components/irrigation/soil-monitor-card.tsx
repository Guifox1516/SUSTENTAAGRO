"use client"

import { useState, useEffect } from "react"
import { Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useIrrigationStore } from "@/lib/store"

const getMoistureStatus = (moisture: number) => {
  if (moisture < 30) return { label: "Seco", color: "text-orange-400", bgColor: "bg-orange-500/20", progressColor: "bg-orange-500" }
  if (moisture < 60) return { label: "Ideal", color: "text-primary", bgColor: "bg-primary/20", progressColor: "bg-primary" }
  return { label: "Úmido", color: "text-accent", bgColor: "bg-accent/20", progressColor: "bg-accent" }
}

type TrendType = {
  icon: typeof TrendingUp | typeof TrendingDown | typeof Minus
  label: string
  color: string
}

const getTrend = (current: number, previous: number): TrendType => {
  const diff = current - previous
  if (Math.abs(diff) < 2) return { icon: Minus, label: "Estável", color: "text-muted-foreground" }
  if (diff > 0) return { icon: TrendingUp, label: "Subindo", color: "text-primary" }
  return { icon: TrendingDown, label: "Descendo", color: "text-orange-400" }
}

// Default stable trend for SSR
const defaultTrend: TrendType = { icon: Minus, label: "Estável", color: "text-muted-foreground" }

export function SoilMonitorCard() {
  const { sensors, sensorHistory } = useIrrigationStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate average moisture
  const averageMoisture = Math.round(
    sensors.reduce((acc, s) => acc + s.soilMoisture, 0) / sensors.length
  )
  
  // Calculate trend only on client to avoid hydration mismatch
  const trend = mounted && sensorHistory.length > 1
    ? getTrend(averageMoisture, sensorHistory[sensorHistory.length - 2]?.soilMoisture || averageMoisture)
    : defaultTrend

  const TrendIcon = trend.icon

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          Monitoramento do Solo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Average Overview */}
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Média Geral</span>
            <div className={cn("flex items-center gap-1 text-xs", trend.color)}>
              <TrendIcon className="h-3 w-3" />
              {trend.label}
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-foreground">{averageMoisture}</span>
            <span className="text-lg text-muted-foreground mb-1">%</span>
          </div>
        </div>

        {/* Individual Sensors */}
        <div className="space-y-4">
          {sensors.map((sensor) => {
            const status = getMoistureStatus(sensor.soilMoisture)
            
            return (
              <div key={sensor.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{sensor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", status.bgColor, status.color)}>
                      {status.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{sensor.soilMoisture}%</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={sensor.soilMoisture} 
                    className="h-2 bg-secondary"
                  />
                  <div 
                    className={cn("absolute top-0 left-0 h-full rounded-full transition-all", status.progressColor)}
                    style={{ width: `${sensor.soilMoisture}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Alert for dry sensors */}
        {sensors.some(s => s.soilMoisture < 30) && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-400">
              <strong>Atenção:</strong> Algumas zonas estão com umidade baixa. Considere irrigar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
