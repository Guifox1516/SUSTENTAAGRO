"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Wifi,
  WifiOff,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Settings,
  Trash2,
  RefreshCw,
  Signal,
  Battery,
  Thermometer,
  Droplets,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSustentraStore, Device, DeviceType, ConnectionType } from "@/lib/sustentra-store"
import { cn } from "@/lib/utils"

const deviceTypeInfo: Record<DeviceType, { label: string; color: string; icon: string }> = {
  arduino: { label: "Arduino", color: "bg-teal-500", icon: "A" },
  esp32: { label: "ESP32", color: "bg-blue-500", icon: "E" },
  esp8266: { label: "ESP8266", color: "bg-cyan-500", icon: "8" },
  raspberry: { label: "Raspberry Pi", color: "bg-pink-500", icon: "R" },
  lora: { label: "LoRa", color: "bg-purple-500", icon: "L" },
  custom: { label: "Personalizado", color: "bg-gray-500", icon: "C" }
}

const connectionTypeInfo: Record<ConnectionType, { label: string; icon: typeof Wifi }> = {
  wifi: { label: "Wi-Fi", icon: Wifi },
  bluetooth: { label: "Bluetooth", icon: Signal },
  mqtt: { label: "MQTT", icon: Activity },
  lora: { label: "LoRa", icon: Signal },
  satellite: { label: "Satelite", icon: Signal }
}

export function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  
  const { devices, sensors, actuators, addDevice, removeDevice, toggleActuator } = useSustentraStore()

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || device.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusInfo = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return { label: "Online", color: "bg-primary", icon: CheckCircle2 }
      case "offline":
        return { label: "Offline", color: "bg-muted-foreground", icon: XCircle }
      case "error":
        return { label: "Erro", color: "bg-destructive", icon: AlertTriangle }
      case "pairing":
        return { label: "Pareando", color: "bg-yellow-500", icon: RefreshCw }
    }
  }

  const DeviceCard = ({ device }: { device: Device }) => {
    const statusInfo = getStatusInfo(device.status)
    const typeInfo = deviceTypeInfo[device.type]
    const deviceSensors = sensors.filter(s => s.deviceId === device.id)
    const deviceActuators = actuators.filter(a => a.deviceId === device.id)
    const StatusIcon = statusInfo.icon

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
          device.status === "online" && "border-primary/30"
        )}
        onClick={() => setSelectedDevice(device)}
        >
          {/* Status indicator line */}
          <div className={cn("absolute top-0 left-0 right-0 h-1", statusInfo.color)} />
          
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold",
                  typeInfo.color
                )}>
                  {typeInfo.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{device.name}</h3>
                  <p className="text-xs text-muted-foreground">{typeInfo.label}</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeDevice(device.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <StatusIcon className={cn("h-4 w-4", 
                device.status === "online" && "text-primary",
                device.status === "offline" && "text-muted-foreground",
                device.status === "error" && "text-destructive",
                device.status === "pairing" && "text-yellow-500 animate-spin"
              )} />
              <span className="text-sm">{statusInfo.label}</span>
              {device.ipAddress && (
                <span className="text-xs text-muted-foreground ml-auto">{device.ipAddress}</span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {device.batteryLevel !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Battery className={cn("h-4 w-4",
                    device.batteryLevel > 50 ? "text-primary" : 
                    device.batteryLevel > 20 ? "text-yellow-500" : "text-destructive"
                  )} />
                  <span>{device.batteryLevel}%</span>
                </div>
              )}
              {device.signalStrength !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Signal className={cn("h-4 w-4",
                    device.signalStrength > -50 ? "text-primary" :
                    device.signalStrength > -70 ? "text-yellow-500" : "text-destructive"
                  )} />
                  <span>{device.signalStrength}dBm</span>
                </div>
              )}
            </div>

            {/* Connected items */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <Badge variant="outline" className="gap-1">
                <Droplets className="h-3 w-3" />
                {deviceSensors.length} sensores
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {deviceActuators.length} atuadores
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const AddDeviceDialog = () => {
    const [newDevice, setNewDevice] = useState({
      name: "",
      type: "esp32" as DeviceType,
      connectionType: "wifi" as ConnectionType
    })

    const handleAdd = () => {
      addDevice({
        name: newDevice.name || "Novo Dispositivo",
        type: newDevice.type,
        connectionType: newDevice.connectionType,
        status: "pairing",
        lastSeen: new Date(),
        sensors: [],
        actuators: []
      })
      setShowAddDialog(false)
      setNewDevice({ name: "", type: "esp32", connectionType: "wifi" })
    }

    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Dispositivo</DialogTitle>
            <DialogDescription>
              Conecte um novo dispositivo IoT ao sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Dispositivo</Label>
              <Input
                placeholder="Ex: Sensor Campo Norte"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Dispositivo</Label>
              <Select
                value={newDevice.type}
                onValueChange={(v) => setNewDevice({ ...newDevice, type: v as DeviceType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(deviceTypeInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded text-[10px] flex items-center justify-center text-white", info.color)}>
                          {info.icon}
                        </div>
                        {info.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Conexao</Label>
              <Select
                value={newDevice.connectionType}
                onValueChange={(v) => setNewDevice({ ...newDevice, connectionType: v as ConnectionType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(connectionTypeInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Instrucoes de Conexao</h4>
              <ol className="text-xs text-muted-foreground space-y-1">
                <li>1. Ligue o dispositivo e aguarde inicializacao</li>
                <li>2. Conecte-se a rede Wi-Fi &quot;Sustentra-Setup&quot;</li>
                <li>3. Acesse 192.168.4.1 no navegador</li>
                <li>4. Configure as credenciais da sua rede</li>
              </ol>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>
              Adicionar Dispositivo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const DeviceDetailSheet = () => {
    if (!selectedDevice) return null
    
    const deviceSensors = sensors.filter(s => s.deviceId === selectedDevice.id)
    const deviceActuators = actuators.filter(a => a.deviceId === selectedDevice.id)
    const typeInfo = deviceTypeInfo[selectedDevice.type]
    const statusInfo = getStatusInfo(selectedDevice.status)

    return (
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg",
                typeInfo.color
              )}>
                {typeInfo.icon}
              </div>
              <div>
                <DialogTitle>{selectedDevice.name}</DialogTitle>
                <DialogDescription>{typeInfo.label} - {selectedDevice.connectionType.toUpperCase()}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="sensors">Sensores</TabsTrigger>
              <TabsTrigger value="actuators">Atuadores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", statusInfo.color)} />
                    {statusInfo.label}
                  </p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Firmware</p>
                  <p className="font-medium">{selectedDevice.firmware || "N/A"}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">IP</p>
                  <p className="font-medium font-mono text-sm">{selectedDevice.ipAddress || "N/A"}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">MAC</p>
                  <p className="font-medium font-mono text-sm">{selectedDevice.macAddress || "N/A"}</p>
                </div>
              </div>
              
              {selectedDevice.batteryLevel !== undefined && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Bateria</p>
                    <p className="font-medium">{selectedDevice.batteryLevel}%</p>
                  </div>
                  <Progress value={selectedDevice.batteryLevel} className="h-2" />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sensors" className="mt-4">
              {deviceSensors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Droplets className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum sensor conectado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deviceSensors.map(sensor => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{sensor.name}</p>
                          <p className="text-xs text-muted-foreground">{sensor.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">{sensor.value}{sensor.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actuators" className="mt-4">
              {deviceActuators.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum atuador conectado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deviceActuators.map(actuator => (
                    <div key={actuator.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className={cn("h-4 w-4", actuator.isActive && "text-primary")} />
                        <div>
                          <p className="text-sm font-medium">{actuator.name}</p>
                          <p className="text-xs text-muted-foreground">{actuator.type}</p>
                        </div>
                      </div>
                      <Switch
                        checked={actuator.isActive}
                        onCheckedChange={() => toggleActuator(actuator.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centro de Dispositivos</h1>
          <p className="text-muted-foreground">Gerencie seus dispositivos IoT conectados</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Dispositivo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{devices.length}</p>
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
                <p className="text-2xl font-bold">{devices.filter(d => d.status === "online").length}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sensors.length}</p>
                <p className="text-xs text-muted-foreground">Sensores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Zap className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{actuators.length}</p>
                <p className="text-xs text-muted-foreground">Atuadores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dispositivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="error">Com erro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Devices Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </AnimatePresence>
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum dispositivo encontrado</h3>
          <p className="text-muted-foreground mb-4">Adicione seu primeiro dispositivo IoT</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dispositivo
          </Button>
        </div>
      )}

      <AddDeviceDialog />
      <DeviceDetailSheet />
    </div>
  )
}
