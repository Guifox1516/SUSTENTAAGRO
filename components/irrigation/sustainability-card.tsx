"use client"

import { Leaf, Droplets, Gauge, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIrrigationStore } from "@/lib/store"

export function SustainabilityCard() {
  const { sustainability } = useIrrigationStore()

  const savingsPercentage = Math.round(
    (sustainability.waterSaved / sustainability.traditionalUsage) * 100
  )

  const metrics = [
    {
      icon: Droplets,
      label: "Água Economizada",
      value: `${(sustainability.waterSaved / 1000).toFixed(1)}k`,
      unit: "litros",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Leaf,
      label: "CO₂ Reduzido",
      value: sustainability.co2Reduced.toFixed(1),
      unit: "kg",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Gauge,
      label: "Economia vs Tradicional",
      value: savingsPercentage,
      unit: "%",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      icon: Zap,
      label: "Eventos de Irrigação",
      value: sustainability.irrigationEvents,
      unit: "total",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Sustentabilidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Impact Summary */}
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Impacto Ambiental Positivo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Seu sistema de irrigação inteligente está fazendo a diferença! 
            Você economizou <strong className="text-primary">{savingsPercentage}%</strong> de água 
            comparado com métodos tradicionais.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div 
              key={metric.label} 
              className={`p-3 rounded-lg ${metric.bgColor} border border-border/50`}
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${metric.color}`}>{metric.value}</span>
                <span className="text-xs text-muted-foreground">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Chart (simplified) */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Consumo de Água
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Irrigação Inteligente</span>
                <span className="text-primary font-medium">{(sustainability.traditionalUsage - sustainability.waterSaved).toLocaleString()} L</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${100 - savingsPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Irrigação Tradicional</span>
                <span className="text-orange-400 font-medium">{sustainability.traditionalUsage.toLocaleString()} L</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
