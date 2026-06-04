"use client"

import { useMemo, useState, useEffect } from "react"
import { TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useIrrigationStore } from "@/lib/store"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function MoistureHistoryChart() {
  const [mounted, setMounted] = useState(false)
  const { sensorHistory } = useIrrigationStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = useMemo(() => {
    if (!mounted) return []
    return sensorHistory.map((entry) => ({
      time: format(new Date(entry.timestamp), "HH:mm", { locale: ptBR }),
      moisture: Math.round(entry.soilMoisture),
      fullTime: format(new Date(entry.timestamp), "dd/MM HH:mm", { locale: ptBR })
    }))
  }, [sensorHistory, mounted])

  // Calculate stats only on client
  const stats = useMemo(() => {
    if (!mounted || sensorHistory.length === 0) {
      return { avgMoisture: 0, maxMoisture: 0, minMoisture: 0 }
    }
    return {
      avgMoisture: Math.round(
        sensorHistory.reduce((acc, e) => acc + e.soilMoisture, 0) / sensorHistory.length
      ),
      maxMoisture: Math.round(Math.max(...sensorHistory.map(e => e.soilMoisture))),
      minMoisture: Math.round(Math.min(...sensorHistory.map(e => e.soilMoisture)))
    }
  }, [sensorHistory, mounted])

  const { avgMoisture, maxMoisture, minMoisture } = stats

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Histórico de Umidade (24h)
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Últimas 24 horas
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Média</p>
            <p className="text-lg font-bold text-foreground">{mounted ? `${avgMoisture}%` : "-"}</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Máxima</p>
            <p className="text-lg font-bold text-accent">{mounted ? `${maxMoisture}%` : "-"}</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Mínima</p>
            <p className="text-lg font-bold text-orange-400">{mounted ? `${minMoisture}%` : "-"}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="oklch(0.25 0.02 150)" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.65 0.02 150)', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.65 0.02 150)', fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">{payload[0].payload.fullTime}</p>
                        <p className="text-sm font-semibold text-primary">
                          Umidade: {payload[0].value}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="oklch(0.65 0.18 145)"
                strokeWidth={2}
                fill="url(#moistureGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Reference Lines Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-orange-500" />
            <span className="text-muted-foreground">{"<"}30% Seco</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">30-60% Ideal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-accent" />
            <span className="text-muted-foreground">{">"}60% Úmido</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
