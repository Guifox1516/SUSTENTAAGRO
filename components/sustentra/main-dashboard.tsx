"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Droplets,
  Thermometer,
  Wind,
  Cloud,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Leaf,
  BarChart3,
  Cpu,
  Workflow,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"
import { useSustentraStore } from "@/lib/sustentra-store"
import { cn } from "@/lib/utils"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function MainDashboard() {
  const [mounted, setMounted] = useState(false)
  const { sensors, actuators, devices, weather, sustainability, automations, alerts, recommendations } = useSustentraStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const moistureSensors = sensors.filter(s => s.type === "moisture")
  const avgMoisture = moistureSensors.length > 0
    ? Math.round(moistureSensors.reduce((acc, s) => acc + s.value, 0) / moistureSensors.length)
    : 0

  const activeActuators = actuators.filter(a => a.isActive).length
  const onlineDevices = devices.filter(d => d.status === "online").length
  const enabledAutomations = automations.filter(a => a.enabled).length
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length

  // Mock chart data
  const moistureHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    value: 40 + Math.sin(i / 4) * 20 + Math.random() * 10
  }))

  const waterUsageData = [
    { day: "Seg", atual: 120, tradicional: 200 },
    { day: "Ter", atual: 150, tradicional: 210 },
    { day: "Qua", atual: 100, tradicional: 180 },
    { day: "Qui", atual: 130, tradicional: 195 },
    { day: "Sex", atual: 110, tradicional: 190 },
    { day: "Sab", atual: 80, tradicional: 150 },
    { day: "Dom", atual: 60, tradicional: 120 },
  ]

  const getMoistureStatus = (value: number) => {
    if (value < 30) return { label: "Seco", color: "text-orange-400", bg: "bg-orange-400/20" }
    if (value < 60) return { label: "Ideal", color: "text-primary", bg: "bg-primary/20" }
    return { label: "Umido", color: "text-blue-400", bg: "bg-blue-400/20" }
  }

  if (!mounted) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-secondary rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Moisture */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", getMoistureStatus(avgMoisture).bg)}>
                  <Droplets className={cn("h-5 w-5", getMoistureStatus(avgMoisture).color)} />
                </div>
                <Badge variant="outline" className={getMoistureStatus(avgMoisture).color}>
                  {getMoistureStatus(avgMoisture).label}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Umidade Media</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{avgMoisture}</span>
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <Progress value={avgMoisture} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Temperature */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-orange-400/20">
                  <Thermometer className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex items-center gap-1 text-primary text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+2°</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temperatura</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{weather?.temperature || 28}</span>
                  <span className="text-muted-foreground">°C</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Sensacao termica: {(weather?.temperature || 28) + 2}°C
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Devices Online */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-accent/20">
                  <Cpu className="h-5 w-5 text-accent" />
                </div>
                <Badge variant={onlineDevices > 0 ? "default" : "destructive"}>
                  {onlineDevices > 0 ? "Online" : "Offline"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dispositivos</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{onlineDevices}</span>
                  <span className="text-muted-foreground">/ {devices.length}</span>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {devices.map(d => (
                  <div
                    key={d.id}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      d.status === "online" ? "bg-primary" : "bg-destructive"
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Water Saved */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-primary/20">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-primary text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Agua Economizada</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {sustainability.hasData ? Math.round(sustainability.waterSaved) : "-"}
                  </span>
                  <span className="text-muted-foreground">L</span>
                </div>
              </div>
              <p className="text-xs text-primary mt-3">
                {sustainability.hasData ? `${Math.round(sustainability.efficiency)}% eficiencia` : "Ative a simulacao"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Moisture History Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Historico de Umidade (24h)</CardTitle>
              <Badge variant="outline">Tempo Real</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moistureHistory}>
                    <defs>
                      <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="url(#moistureGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Water Comparison Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Consumo de Agua (Semanal)</CardTitle>
              <div className="flex gap-2">
                <Badge variant="default" className="gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Sustentra
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Tradicional
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="tradicional" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="atual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sensors Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Sensores Ativos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sensors.slice(0, 4).map(sensor => {
                const status = getMoistureStatus(sensor.value)
                return (
                  <div key={sensor.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", status.bg.replace("/20", ""))} />
                      <span className="text-sm">{sensor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium", status.color)}>
                        {Math.round(sensor.value)}{sensor.unit}
                      </span>
                    </div>
                  </div>
                )
              })}
              <Link href="/devices">
                <Button variant="ghost" className="w-full mt-2" size="sm">
                  Ver todos os sensores
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actuators Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                Atuadores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actuators.map(actuator => (
                <div key={actuator.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      actuator.isActive ? "bg-primary animate-pulse" : "bg-muted-foreground"
                    )} />
                    <span className="text-sm">{actuator.name}</span>
                  </div>
                  <Badge variant={actuator.isActive ? "default" : "secondary"}>
                    {actuator.isActive ? "Ligado" : "Desligado"}
                  </Badge>
                </div>
              ))}
              <Link href="/devices">
                <Button variant="ghost" className="w-full mt-2" size="sm">
                  Gerenciar atuadores
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Automations & Alerts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Workflow className="h-4 w-4 text-orange-400" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <div className="text-2xl font-bold text-primary">{enabledAutomations}</div>
                  <div className="text-xs text-muted-foreground">Automacoes Ativas</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <div className={cn(
                    "text-2xl font-bold",
                    criticalAlerts > 0 ? "text-destructive" : "text-primary"
                  )}>
                    {criticalAlerts}
                  </div>
                  <div className="text-xs text-muted-foreground">Alertas Criticos</div>
                </div>
              </div>
              
              {criticalAlerts > 0 ? (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Atencao necessaria</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ha {criticalAlerts} alerta(s) critico(s) pendente(s)
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Sistema operando normalmente</span>
                  </div>
                </div>
              )}

              <Link href="/automation">
                <Button variant="ghost" className="w-full" size="sm">
                  Gerenciar automacoes
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weather Forecast */}
      {weather && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-400" />
                Previsao do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {weather.forecast.map((day, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 p-4 rounded-xl bg-secondary/30 text-center min-w-[100px]"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(day.date).toLocaleDateString("pt-BR", { weekday: "short" })}
                    </p>
                    <div className="text-2xl mb-2">
                      {day.icon === "sunny" && "☀️"}
                      {day.icon === "cloudy" && "☁️"}
                      {day.icon === "rainy" && "🌧️"}
                      {day.icon === "storm" && "⛈️"}
                      {day.icon === "partly-cloudy" && "⛅"}
                    </div>
                    <p className="text-sm font-medium">{day.tempMax}°</p>
                    <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-400">
                      <Droplets className="h-3 w-3" />
                      {day.rainProbability}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
