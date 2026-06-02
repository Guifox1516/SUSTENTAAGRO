"use client"

import { useState } from "react"
import { Bot, Plus, Trash2, Power, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useIrrigationStore, type AutomationRule } from "@/lib/store"

export function AutomationCard() {
  const { automationRules, sensors, irrigators, pumps, addAutomationRule, deleteAutomationRule, toggleAutomationRule } = useIrrigationStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    conditionType: "moisture_below" as AutomationRule["condition"]["type"],
    conditionValue: 30,
    conditionSensorId: sensors[0]?.id || "",
    actionType: "activate_irrigator" as AutomationRule["action"]["type"],
    actionTargetId: irrigators[0]?.id || "",
    actionDuration: 15
  })

  const handleCreateRule = () => {
    if (!newRule.name.trim()) return

    addAutomationRule({
      name: newRule.name,
      enabled: false, // Always start disabled - user must enable manually
      condition: {
        type: newRule.conditionType,
        value: newRule.conditionValue,
        sensorId: newRule.conditionSensorId || undefined
      },
      action: {
        type: newRule.actionType,
        targetId: newRule.actionTargetId,
        duration: newRule.actionDuration
      }
    })

    setNewRule({
      name: "",
      conditionType: "moisture_below",
      conditionValue: 30,
      conditionSensorId: sensors[0]?.id || "",
      actionType: "activate_irrigator",
      actionTargetId: irrigators[0]?.id || "",
      actionDuration: 15
    })
    setIsDialogOpen(false)
  }

  const getConditionLabel = (rule: AutomationRule) => {
    const sensor = sensors.find(s => s.id === rule.condition.sensorId)
    switch (rule.condition.type) {
      case "moisture_below":
        return `Umidade < ${rule.condition.value}%${sensor ? ` (${sensor.name})` : ""}`
      case "moisture_above":
        return `Umidade > ${rule.condition.value}%${sensor ? ` (${sensor.name})` : ""}`
      case "weather":
        return `Chuva > ${rule.condition.value}%`
      case "schedule":
        return `Horário programado`
      default:
        return "Condição"
    }
  }

  const getActionLabel = (rule: AutomationRule) => {
    const irrigator = irrigators.find(i => i.id === rule.action.targetId)
    const pump = pumps.find(p => p.id === rule.action.targetId)
    const target = irrigator?.name || pump?.name || "Dispositivo"
    
    switch (rule.action.type) {
      case "activate_irrigator":
        return `Ativar ${target}${rule.action.duration ? ` por ${rule.action.duration}min` : ""}`
      case "deactivate_irrigator":
        return `Desativar ${target}`
      case "activate_pump":
        return `Ligar ${target}`
      case "deactivate_pump":
        return `Desligar ${target}`
      default:
        return "Ação"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automação
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Nova Regra
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Criar Nova Regra</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Configure uma regra de automação. A regra será criada desativada - você deve ativá-la manualmente.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Nome da Regra</Label>
                  <Input
                    id="rule-name"
                    placeholder="Ex: Irrigar quando seco"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Condição (SE)
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Tipo</Label>
                      <Select
                        value={newRule.conditionType}
                        onValueChange={(value: AutomationRule["condition"]["type"]) => 
                          setNewRule({ ...newRule, conditionType: value })
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moisture_below">Umidade abaixo de</SelectItem>
                          <SelectItem value="moisture_above">Umidade acima de</SelectItem>
                          <SelectItem value="weather">Probabilidade de chuva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Valor (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={newRule.conditionValue}
                        onChange={(e) => setNewRule({ ...newRule, conditionValue: Number(e.target.value) })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  {(newRule.conditionType === "moisture_below" || newRule.conditionType === "moisture_above") && (
                    <div className="space-y-2">
                      <Label className="text-xs">Sensor</Label>
                      <Select
                        value={newRule.conditionSensorId}
                        onValueChange={(value) => setNewRule({ ...newRule, conditionSensorId: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sensors.map((sensor) => (
                            <SelectItem key={sensor.id} value={sensor.id}>
                              {sensor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Power className="h-4 w-4" />
                    Ação (ENTÃO)
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Ação</Label>
                      <Select
                        value={newRule.actionType}
                        onValueChange={(value: AutomationRule["action"]["type"]) => 
                          setNewRule({ ...newRule, actionType: value })
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activate_irrigator">Ativar Irrigador</SelectItem>
                          <SelectItem value="deactivate_irrigator">Desativar Irrigador</SelectItem>
                          <SelectItem value="activate_pump">Ligar Bomba</SelectItem>
                          <SelectItem value="deactivate_pump">Desligar Bomba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Dispositivo</Label>
                      <Select
                        value={newRule.actionTargetId}
                        onValueChange={(value) => setNewRule({ ...newRule, actionTargetId: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(newRule.actionType.includes("irrigator") ? irrigators : pumps).map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newRule.actionType === "activate_irrigator" && (
                    <div className="space-y-2">
                      <Label className="text-xs">Duração (minutos)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        value={newRule.actionDuration}
                        onChange={(e) => setNewRule({ ...newRule, actionDuration: Number(e.target.value) })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateRule} disabled={!newRule.name.trim()}>
                  Criar Regra
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {automationRules.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">
              Nenhuma regra de automação configurada
            </p>
            <p className="text-xs text-muted-foreground">
              Crie regras para automatizar a irrigação baseada em condições do solo ou clima.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div 
                key={rule.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  rule.enabled 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-secondary/30 border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      rule.enabled ? "bg-primary animate-pulse" : "bg-muted-foreground"
                    )} />
                    <span className="font-medium text-foreground text-sm">{rule.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={rule.enabled}
                      onCheckedChange={() => toggleAutomationRule(rule.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => deleteAutomationRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 pl-4">
                  <p><strong>SE:</strong> {getConditionLabel(rule)}</p>
                  <p><strong>ENTÃO:</strong> {getActionLabel(rule)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-400">
            <strong>Nota:</strong> As automações só funcionam quando ativadas manualmente. 
            O sistema nunca executa ações sem sua autorização prévia.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
