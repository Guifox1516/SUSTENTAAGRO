"use client"

import { Power, Droplets, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useIrrigationStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function IrrigationControlCard() {
  const { irrigators, pumps, toggleIrrigator, togglePump } = useIrrigationStore()

  const activeIrrigators = irrigators.filter(i => i.isActive).length
  const activePumps = pumps.filter(p => p.isActive).length

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Power className="h-4 w-4" />
          Controle de Irrigação
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">{activeIrrigators}/{irrigators.length}</p>
            <p className="text-xs text-muted-foreground">Irrigadores Ativos</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">{activePumps}/{pumps.length}</p>
            <p className="text-xs text-muted-foreground">Bombas Ativas</p>
          </div>
        </div>

        {/* Pumps */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Bombas de Água
          </h4>
          <div className="space-y-2">
            {pumps.map((pump) => (
              <div 
                key={pump.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  pump.isActive 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-secondary/30 border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    pump.isActive ? "bg-primary animate-pulse" : "bg-muted-foreground"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{pump.name}</p>
                    <p className="text-xs text-muted-foreground">{pump.flowRate} L/h</p>
                  </div>
                </div>
                <Switch 
                  checked={pump.isActive} 
                  onCheckedChange={() => togglePump(pump.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Irrigators */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Irrigadores
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {irrigators.map((irrigator) => (
              <Button
                key={irrigator.id}
                variant={irrigator.isActive ? "default" : "outline"}
                className={cn(
                  "h-auto py-3 flex flex-col items-start gap-1",
                  irrigator.isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => toggleIrrigator(irrigator.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Droplets className={cn(
                    "h-4 w-4",
                    irrigator.isActive && "animate-pulse"
                  )} />
                  <span className="text-sm font-medium">{irrigator.name}</span>
                </div>
                <span className="text-xs opacity-70">{irrigator.zone}</span>
                {irrigator.lastActivation && (
                  <span className="text-xs opacity-60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(irrigator.lastActivation), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
