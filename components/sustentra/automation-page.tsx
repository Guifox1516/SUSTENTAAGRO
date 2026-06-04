"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Trash2,
  Settings,
  MoreVertical,
  Zap,
  Clock,
  Cloud,
  Droplets,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Copy,
  Edit2,
  Power,
  Timer,
  CalendarDays,
  ArrowRight,
  GitBranch
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useSustentraStore, Automation, AutomationOperator } from "@/lib/sustentra-store"
import { cn } from "@/lib/utils"

const operatorLabels: Record<AutomationOperator, string> = {
  less_than: "Menor que",
  greater_than: "Maior que",
  equals: "Igual a",
  between: "Entre",
  not_equals: "Diferente de"
}

const triggerTypes = [
  { id: "sensor", label: "Sensor", icon: Droplets, color: "bg-blue-500" },
  { id: "schedule", label: "Agendamento", icon: Clock, color: "bg-purple-500" },
  { id: "weather", label: "Clima", icon: Cloud, color: "bg-cyan-500" },
  { id: "manual", label: "Manual", icon: Power, color: "bg-orange-500" }
]

const actionTypes = [
  { id: "activate", label: "Ativar", icon: Power, color: "text-primary" },
  { id: "deactivate", label: "Desativar", icon: Power, color: "text-muted-foreground" },
  { id: "toggle", label: "Alternar", icon: GitBranch, color: "text-accent" }
]

export function AutomationPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  
  const { 
    automations, 
    sensors, 
    actuators, 
    addAutomation, 
    updateAutomation, 
    deleteAutomation, 
    toggleAutomation 
  } = useSustentraStore()

  const enabledCount = automations.filter(a => a.enabled).length

  const AutomationCard = ({ automation }: { automation: Automation }) => {
    const conditionSensor = sensors.find(s => s.id === automation.conditions[0]?.sensorId)
    const actionActuator = actuators.find(a => a.id === automation.actions[0]?.actuatorId)

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all",
          automation.enabled ? "border-primary/30" : "opacity-70"
        )}>
          {automation.enabled && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
          )}
          
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  automation.enabled ? "bg-primary/20" : "bg-muted"
                )}>
                  <Workflow className={cn(
                    "h-5 w-5",
                    automation.enabled ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{automation.name}</h3>
                  {automation.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{automation.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={automation.enabled}
                  onCheckedChange={() => toggleAutomation(automation.id)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingAutomation(automation)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Visual Flow */}
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg mb-4">
              {/* Trigger */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  {automation.triggers[0]?.type === "sensor" && <Droplets className="h-3 w-3" />}
                  {automation.triggers[0]?.type === "schedule" && <Clock className="h-3 w-3" />}
                  {automation.triggers[0]?.type === "weather" && <Cloud className="h-3 w-3" />}
                  SE
                </Badge>
              </div>
              
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              
              {/* Condition */}
              <div className="flex-1 text-sm">
                {conditionSensor ? (
                  <span>
                    <span className="font-medium">{conditionSensor.name}</span>
                    {" "}
                    <span className="text-muted-foreground">
                      {operatorLabels[automation.conditions[0]?.operator || "less_than"]}
                    </span>
                    {" "}
                    <span className="font-mono text-primary">
                      {Array.isArray(automation.conditions[0]?.value) 
                        ? `${automation.conditions[0].value[0]}-${automation.conditions[0].value[1]}`
                        : automation.conditions[0]?.value}%
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Condicao nao definida</span>
                )}
              </div>
              
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              
              {/* Action */}
              <Badge className="gap-1 bg-primary/20 text-primary border-primary/30">
                <Zap className="h-3 w-3" />
                {actionActuator?.name || "Acao"}
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {automation.triggerCount} execucoes
                </span>
                {automation.lastTriggered && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Ultima: {new Date(automation.lastTriggered).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
              <Badge variant={automation.enabled ? "default" : "secondary"} className="text-[10px]">
                {automation.enabled ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const CreateAutomationDialog = () => {
    const [step, setStep] = useState(1)
    const [newAutomation, setNewAutomation] = useState({
      name: "",
      description: "",
      triggerType: "sensor",
      sensorId: "",
      operator: "less_than" as AutomationOperator,
      value: 30,
      actuatorId: "",
      action: "activate" as "activate" | "deactivate" | "toggle",
      duration: 5
    })

    const handleCreate = () => {
      if (!newAutomation.name || !newAutomation.sensorId || !newAutomation.actuatorId) return

      addAutomation({
        name: newAutomation.name,
        description: newAutomation.description,
        enabled: false, // Always starts disabled
        blocks: [],
        triggers: [{
          type: newAutomation.triggerType as "sensor" | "schedule" | "weather" | "manual",
          config: {}
        }],
        conditions: [{
          sensorId: newAutomation.sensorId,
          operator: newAutomation.operator,
          value: newAutomation.value
        }],
        actions: [{
          actuatorId: newAutomation.actuatorId,
          action: newAutomation.action,
          duration: newAutomation.duration
        }]
      })

      setShowCreateDialog(false)
      setStep(1)
      setNewAutomation({
        name: "",
        description: "",
        triggerType: "sensor",
        sensorId: "",
        operator: "less_than",
        value: 30,
        actuatorId: "",
        action: "activate",
        duration: 5
      })
    }

    return (
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Automacao</DialogTitle>
            <DialogDescription>
              Configure uma regra de automacao personalizada
            </DialogDescription>
          </DialogHeader>

          {/* Progress */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Automacao</Label>
                <Input
                  placeholder="Ex: Irrigar quando solo seco"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descricao (opcional)</Label>
                <Textarea
                  placeholder="Descreva o que esta automacao faz..."
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Gatilho</Label>
                <div className="grid grid-cols-2 gap-2">
                  {triggerTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewAutomation({ ...newAutomation, triggerType: type.id })}
                      className={cn(
                        "p-3 rounded-lg border flex items-center gap-2 transition-all",
                        newAutomation.triggerType === type.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", type.color)}>
                        <type.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">SE</span>
                  Condicao
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Sensor</Label>
                    <Select
                      value={newAutomation.sensorId}
                      onValueChange={(v) => setNewAutomation({ ...newAutomation, sensorId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um sensor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensors.map(sensor => (
                          <SelectItem key={sensor.id} value={sensor.id}>
                            {sensor.name} ({sensor.value}{sensor.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Operador</Label>
                      <Select
                        value={newAutomation.operator}
                        onValueChange={(v) => setNewAutomation({ ...newAutomation, operator: v as AutomationOperator })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(operatorLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={newAutomation.value}
                        onChange={(e) => setNewAutomation({ ...newAutomation, value: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <span className="text-muted-foreground">Preview: </span>
                <span className="font-medium">
                  SE {sensors.find(s => s.id === newAutomation.sensorId)?.name || "[sensor]"}{" "}
                  {operatorLabels[newAutomation.operator]} {newAutomation.value}%
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">ENTAO</span>
                  Acao
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Atuador</Label>
                    <Select
                      value={newAutomation.actuatorId}
                      onValueChange={(v) => setNewAutomation({ ...newAutomation, actuatorId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um atuador" />
                      </SelectTrigger>
                      <SelectContent>
                        {actuators.map(actuator => (
                          <SelectItem key={actuator.id} value={actuator.id}>
                            {actuator.name} ({actuator.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Acao</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {actionTypes.map(action => (
                        <button
                          key={action.id}
                          onClick={() => setNewAutomation({ ...newAutomation, action: action.id as "activate" | "deactivate" | "toggle" })}
                          className={cn(
                            "p-2 rounded-lg border text-center transition-all",
                            newAutomation.action === action.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          <action.icon className={cn("h-4 w-4 mx-auto mb-1", action.color)} />
                          <span className="text-xs">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Duracao (minutos)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[newAutomation.duration]}
                        onValueChange={([v]) => setNewAutomation({ ...newAutomation, duration: v })}
                        min={1}
                        max={60}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-mono">{newAutomation.duration}min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Preview */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <h4 className="font-medium mb-2">Resumo da Automacao</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">SE</Badge>
                  <span>{sensors.find(s => s.id === newAutomation.sensorId)?.name}</span>
                  <span className="text-muted-foreground">{operatorLabels[newAutomation.operator]}</span>
                  <span className="font-mono text-primary">{newAutomation.value}%</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge>ENTAO</Badge>
                  <span>{newAutomation.action === "activate" ? "Ativar" : newAutomation.action === "deactivate" ? "Desativar" : "Alternar"}</span>
                  <span className="font-medium">{actuators.find(a => a.id === newAutomation.actuatorId)?.name}</span>
                  <span className="text-muted-foreground">por {newAutomation.duration}min</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-yellow-500">Importante</p>
                    <p className="text-muted-foreground">
                      A automacao sera criada DESATIVADA. Voce precisara ativa-la manualmente apos revisar as configuracoes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : setShowCreateDialog(false)}
            >
              {step > 1 ? "Voltar" : "Cancelar"}
            </Button>
            <Button
              onClick={() => step < 3 ? setStep(step + 1) : handleCreate()}
              disabled={
                (step === 1 && !newAutomation.name) ||
                (step === 2 && !newAutomation.sensorId) ||
                (step === 3 && !newAutomation.actuatorId)
              }
            >
              {step < 3 ? "Proximo" : "Criar Automacao"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Programacao e Automacao</h1>
          <p className="text-muted-foreground">Crie regras personalizadas para automatizar a irrigacao</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Automacao
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Workflow className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{automations.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enabledCount}</p>
                <p className="text-xs text-muted-foreground">Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Play className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {automations.reduce((acc, a) => acc + a.triggerCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Execucoes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Timer className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {automations.filter(a => a.schedule?.enabled).length}
                </p>
                <p className="text-xs text-muted-foreground">Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Como funcionam as automacoes</h4>
              <p className="text-sm text-muted-foreground mt-1">
                As automacoes sao regras que voce cria para controlar a irrigacao automaticamente.
                O sistema <strong>nunca</strong> cria ou ativa automacoes sozinho - voce tem controle total.
                Todas as automacoes iniciam desativadas e precisam ser habilitadas manualmente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automations List */}
      {automations.length === 0 ? (
        <div className="text-center py-12">
          <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma automacao criada</h3>
          <p className="text-muted-foreground mb-4">Crie sua primeira regra de automacao</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Automacao
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {automations.map(automation => (
              <AutomationCard key={automation.id} automation={automation} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateAutomationDialog />
    </div>
  )
}
