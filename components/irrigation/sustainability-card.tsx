"use client"

import { Leaf, Droplets, Gauge, Zap, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIrrigationStore } from "@/lib/store"

export function SustainabilityCard() {
  const { sustainability, simulationEnabled, toggleSimulation } = useIrrigationStore()

  // Se não há dados disponíveis
  if (!sustainability.hasData) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Sustentabilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum dado disponível ainda
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Configure sensores reais ou ative a simulação para visualizar métricas de sustentabilidade.
            </p>
            <Button onClick={toggleSimulation} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Ativar Simulação
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const savingsPercentage = sustainability.traditionalUsage > 0 
    ? Math.round((sustainability.waterSaved / sustainability.traditionalUsage) * 100)
    : 0

  const metrics = [
    {
      icon: Droplets,
      label: "Água Economizada",
      value: sustainability.waterSaved >= 1000 
        ? `${(sustainability.waterSaved / 1000).toFixed(1)}k` 
        : sustainability.waterSaved.toFixed(0),
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Sustentabilidade
          </CardTitle>
          {simulationEnabled && (
            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
              Modo Simulação
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Impact Summary */}
        {savingsPercentage > 0 && (
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
        )}

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

        {/* Comparison Chart */}
        {sustainability.traditionalUsage > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Consumo de Água
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Irrigação Inteligente</span>
                  <span className="text-primary font-medium">
                    {(sustainability.traditionalUsage - sustainability.waterSaved).toLocaleString()} L
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.max(5, 100 - savingsPercentage)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Irrigação Tradicional</span>
                  <span className="text-orange-400 font-medium">
                    {sustainability.traditionalUsage.toLocaleString()} L
                  </span>
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
        )}

        {/* Disable Simulation Button */}
        {simulationEnabled && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button 
              onClick={toggleSimulation} 
              variant="ghost" 
              size="sm" 
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Desativar Simulação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
