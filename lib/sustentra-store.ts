import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============== TYPES ==============

export type DeviceType = 'arduino' | 'esp32' | 'esp8266' | 'raspberry' | 'lora' | 'custom'
export type ConnectionType = 'wifi' | 'bluetooth' | 'mqtt' | 'lora' | 'satellite'
export type SensorType = 'moisture' | 'temperature' | 'humidity' | 'ph' | 'light' | 'flow' | 'pressure' | 'weather'
export type ActuatorType = 'valve' | 'pump' | 'relay' | 'sprinkler'
export type PlantPhase = 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AutomationOperator = 'less_than' | 'greater_than' | 'equals' | 'between' | 'not_equals'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'operator' | 'viewer'
  preferences: {
    language: string
    units: 'metric' | 'imperial'
    notifications: boolean
    theme: 'dark' | 'light' | 'system'
  }
  onboardingCompleted: boolean
  createdAt: Date
}

export interface Farm {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  area: number // hectares
  crops: Crop[]
  sectors: Sector[]
  createdAt: Date
}

export interface Sector {
  id: string
  name: string
  farmId: string
  area: number
  cropId?: string
  sensors: string[] // sensor IDs
  actuators: string[] // actuator IDs
  color: string
  boundaries?: { lat: number; lng: number }[]
}

export interface Crop {
  id: string
  name: string
  type: string
  plantingDate: Date
  expectedHarvest: Date
  phase: PlantPhase
  optimalMoisture: { min: number; max: number }
  optimalTemperature: { min: number; max: number }
  waterNeeds: number // liters per day per hectare
  notes: string
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  connectionType: ConnectionType
  status: 'online' | 'offline' | 'error' | 'pairing'
  lastSeen: Date
  firmware?: string
  ipAddress?: string
  macAddress?: string
  sensors: Sensor[]
  actuators: Actuator[]
  sectorId?: string
  batteryLevel?: number
  signalStrength?: number
}

export interface Sensor {
  id: string
  deviceId: string
  name: string
  type: SensorType
  value: number
  unit: string
  minValue: number
  maxValue: number
  calibration?: { offset: number; multiplier: number }
  lastReading: Date
  history: { timestamp: Date; value: number }[]
}

export interface Actuator {
  id: string
  deviceId: string
  name: string
  type: ActuatorType
  isActive: boolean
  lastActivation?: Date
  totalRuntime: number // minutes
  flowRate?: number // liters per minute
  powerConsumption?: number // watts
}

export interface AutomationBlock {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'loop'
  config: Record<string, unknown>
  position: { x: number; y: number }
  connections: string[] // IDs of connected blocks
}

export interface Automation {
  id: string
  name: string
  description: string
  enabled: boolean
  blocks: AutomationBlock[]
  triggers: {
    type: 'sensor' | 'schedule' | 'weather' | 'manual'
    config: Record<string, unknown>
  }[]
  conditions: {
    sensorId?: string
    operator: AutomationOperator
    value: number | [number, number]
    logicOperator?: 'AND' | 'OR'
  }[]
  actions: {
    actuatorId: string
    action: 'activate' | 'deactivate' | 'toggle'
    duration?: number
    delay?: number
  }[]
  schedule?: {
    enabled: boolean
    cron?: string
    times?: string[]
    days?: number[]
  }
  lastTriggered?: Date
  triggerCount: number
  createdAt: Date
}

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  source: string
  sourceId: string
  acknowledged: boolean
  timestamp: Date
  resolvedAt?: Date
}

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  rainProbability: number
  uvIndex: number
  description: string
  icon: string
  forecast: {
    date: Date
    tempMin: number
    tempMax: number
    rainProbability: number
    description: string
    icon: string
  }[]
}

export interface SustainabilityMetrics {
  waterSaved: number
  waterUsed: number
  traditionalUsage: number
  co2Reduced: number
  energySaved: number
  irrigationEvents: number
  efficiency: number
  hasData: boolean
}

export interface IrrigationEvent {
  id: string
  actuatorId: string
  sectorId: string
  startTime: Date
  endTime?: Date
  waterUsed: number
  triggeredBy: 'manual' | 'automation' | 'schedule'
  automationId?: string
}

export interface AIRecommendation {
  id: string
  type: 'irrigation' | 'maintenance' | 'optimization' | 'alert'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dismissed: boolean
  appliedAt?: Date
  createdAt: Date
  relatedSensorIds?: string[]
  suggestedActions?: string[]
}

// ============== STORE STATE ==============

interface SustentraStore {
  // User
  user: User | null
  isAuthenticated: boolean
  
  // Onboarding
  onboardingStep: number
  onboardingCompleted: boolean
  
  // Farm
  farms: Farm[]
  activeFarmId: string | null
  sectors: Sector[]
  crops: Crop[]
  
  // Devices
  devices: Device[]
  sensors: Sensor[]
  actuators: Actuator[]
  
  // Automations
  automations: Automation[]
  
  // Weather
  weather: WeatherData | null
  
  // Alerts & Notifications
  alerts: Alert[]
  
  // Sustainability
  sustainability: SustainabilityMetrics
  irrigationHistory: IrrigationEvent[]
  
  // AI
  recommendations: AIRecommendation[]
  
  // Simulation
  simulationEnabled: boolean
  
  // UI State
  sidebarOpen: boolean
  activeView: string
  
  // Actions
  setUser: (user: User | null) => void
  updateUserPreferences: (prefs: Partial<User['preferences']>) => void
  completeOnboarding: () => void
  setOnboardingStep: (step: number) => void
  
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt'>) => void
  updateFarm: (id: string, updates: Partial<Farm>) => void
  setActiveFarm: (id: string) => void
  
  addSector: (sector: Omit<Sector, 'id'>) => void
  updateSector: (id: string, updates: Partial<Sector>) => void
  deleteSector: (id: string) => void
  
  addCrop: (crop: Omit<Crop, 'id'>) => void
  updateCrop: (id: string, updates: Partial<Crop>) => void
  deleteCrop: (id: string) => void
  
  addDevice: (device: Omit<Device, 'id'>) => void
  updateDevice: (id: string, updates: Partial<Device>) => void
  removeDevice: (id: string) => void
  updateSensorValue: (sensorId: string, value: number) => void
  toggleActuator: (actuatorId: string) => void
  
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'triggerCount'>) => void
  updateAutomation: (id: string, updates: Partial<Automation>) => void
  deleteAutomation: (id: string) => void
  toggleAutomation: (id: string) => void
  
  setWeather: (weather: WeatherData) => void
  
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void
  acknowledgeAlert: (id: string) => void
  resolveAlert: (id: string) => void
  clearAlerts: () => void
  
  updateSustainability: (waterUsed: number) => void
  addIrrigationEvent: (event: Omit<IrrigationEvent, 'id'>) => void
  
  addRecommendation: (rec: Omit<AIRecommendation, 'id' | 'createdAt' | 'dismissed'>) => void
  dismissRecommendation: (id: string) => void
  applyRecommendation: (id: string) => void
  
  toggleSimulation: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveView: (view: string) => void
}

// ============== INITIAL DATA ==============

const initialUser: User = {
  id: 'user-1',
  name: 'Agricultor',
  email: 'agricultor@sustentra.com',
  role: 'admin',
  preferences: {
    language: 'pt-BR',
    units: 'metric',
    notifications: true,
    theme: 'dark'
  },
  onboardingCompleted: false,
  createdAt: new Date()
}

const initialWeather: WeatherData = {
  temperature: 28,
  humidity: 65,
  pressure: 1013,
  windSpeed: 12,
  windDirection: 180,
  rainProbability: 20,
  uvIndex: 7,
  description: 'Parcialmente nublado',
  icon: 'partly-cloudy',
  forecast: [
    { date: new Date(Date.now() + 86400000), tempMin: 22, tempMax: 30, rainProbability: 15, description: 'Ensolarado', icon: 'sunny' },
    { date: new Date(Date.now() + 172800000), tempMin: 21, tempMax: 28, rainProbability: 40, description: 'Nublado', icon: 'cloudy' },
    { date: new Date(Date.now() + 259200000), tempMin: 20, tempMax: 26, rainProbability: 70, description: 'Chuva', icon: 'rainy' },
    { date: new Date(Date.now() + 345600000), tempMin: 19, tempMax: 25, rainProbability: 80, description: 'Tempestade', icon: 'storm' },
    { date: new Date(Date.now() + 432000000), tempMin: 22, tempMax: 29, rainProbability: 10, description: 'Ensolarado', icon: 'sunny' },
  ]
}

const initialDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Estacao Central',
    type: 'esp32',
    connectionType: 'wifi',
    status: 'online',
    lastSeen: new Date(),
    firmware: '2.1.0',
    ipAddress: '192.168.1.100',
    sensors: [],
    actuators: [],
    sectorId: 'sector-1',
    batteryLevel: 100,
    signalStrength: -45
  },
  {
    id: 'device-2',
    name: 'Sensor Campo Norte',
    type: 'esp8266',
    connectionType: 'wifi',
    status: 'online',
    lastSeen: new Date(),
    firmware: '1.8.2',
    sensors: [],
    actuators: [],
    sectorId: 'sector-1',
    batteryLevel: 78,
    signalStrength: -62
  }
]

const initialSensors: Sensor[] = [
  {
    id: 'sensor-moisture-1',
    deviceId: 'device-1',
    name: 'Umidade Solo - Norte',
    type: 'moisture',
    value: 42,
    unit: '%',
    minValue: 0,
    maxValue: 100,
    lastReading: new Date(),
    history: []
  },
  {
    id: 'sensor-moisture-2',
    deviceId: 'device-2',
    name: 'Umidade Solo - Sul',
    type: 'moisture',
    value: 58,
    unit: '%',
    minValue: 0,
    maxValue: 100,
    lastReading: new Date(),
    history: []
  },
  {
    id: 'sensor-temp-1',
    deviceId: 'device-1',
    name: 'Temperatura Ambiente',
    type: 'temperature',
    value: 28,
    unit: '°C',
    minValue: -10,
    maxValue: 60,
    lastReading: new Date(),
    history: []
  },
  {
    id: 'sensor-humidity-1',
    deviceId: 'device-1',
    name: 'Umidade do Ar',
    type: 'humidity',
    value: 65,
    unit: '%',
    minValue: 0,
    maxValue: 100,
    lastReading: new Date(),
    history: []
  }
]

const initialActuators: Actuator[] = [
  {
    id: 'actuator-valve-1',
    deviceId: 'device-1',
    name: 'Valvula Principal',
    type: 'valve',
    isActive: false,
    totalRuntime: 0,
    flowRate: 50
  },
  {
    id: 'actuator-pump-1',
    deviceId: 'device-1',
    name: 'Bomba de Agua',
    type: 'pump',
    isActive: false,
    totalRuntime: 0,
    flowRate: 120,
    powerConsumption: 750
  },
  {
    id: 'actuator-sprinkler-1',
    deviceId: 'device-2',
    name: 'Irrigador Norte',
    type: 'sprinkler',
    isActive: false,
    totalRuntime: 0,
    flowRate: 30
  }
]

const initialSectors: Sector[] = [
  {
    id: 'sector-1',
    name: 'Campo Norte',
    farmId: 'farm-1',
    area: 5,
    sensors: ['sensor-moisture-1', 'sensor-temp-1'],
    actuators: ['actuator-valve-1', 'actuator-sprinkler-1'],
    color: '#22c55e'
  },
  {
    id: 'sector-2',
    name: 'Campo Sul',
    farmId: 'farm-1',
    area: 3,
    sensors: ['sensor-moisture-2'],
    actuators: ['actuator-pump-1'],
    color: '#3b82f6'
  }
]

// ============== STORE ==============

export const useSustentraStore = create<SustentraStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: initialUser,
      isAuthenticated: true,
      onboardingStep: 0,
      onboardingCompleted: false,
      farms: [{
        id: 'farm-1',
        name: 'Fazenda Modelo',
        location: { latitude: -23.5505, longitude: -46.6333, address: 'Sao Paulo, SP' },
        area: 50,
        crops: [],
        sectors: [],
        createdAt: new Date()
      }],
      activeFarmId: 'farm-1',
      sectors: initialSectors,
      crops: [{
        id: 'crop-1',
        name: 'Milho',
        type: 'grain',
        plantingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expectedHarvest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        phase: 'vegetative',
        optimalMoisture: { min: 40, max: 70 },
        optimalTemperature: { min: 20, max: 35 },
        waterNeeds: 5000,
        notes: 'Variedade resistente a seca'
      }],
      devices: initialDevices,
      sensors: initialSensors,
      actuators: initialActuators,
      automations: [],
      weather: initialWeather,
      alerts: [],
      sustainability: {
        waterSaved: 0,
        waterUsed: 0,
        traditionalUsage: 0,
        co2Reduced: 0,
        energySaved: 0,
        irrigationEvents: 0,
        efficiency: 0,
        hasData: false
      },
      irrigationHistory: [],
      recommendations: [],
      simulationEnabled: false,
      sidebarOpen: true,
      activeView: 'dashboard',

      // User Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      updateUserPreferences: (prefs) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...prefs }
        } : null
      })),
      
      completeOnboarding: () => set((state) => ({
        onboardingCompleted: true,
        user: state.user ? { ...state.user, onboardingCompleted: true } : null
      })),
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      // Farm Actions
      addFarm: (farm) => {
        const newFarm: Farm = { ...farm, id: `farm-${Date.now()}`, createdAt: new Date() }
        set((state) => ({ farms: [...state.farms, newFarm] }))
      },
      
      updateFarm: (id, updates) => set((state) => ({
        farms: state.farms.map((f) => f.id === id ? { ...f, ...updates } : f)
      })),
      
      setActiveFarm: (id) => set({ activeFarmId: id }),

      // Sector Actions
      addSector: (sector) => {
        const newSector: Sector = { ...sector, id: `sector-${Date.now()}` }
        set((state) => ({ sectors: [...state.sectors, newSector] }))
      },
      
      updateSector: (id, updates) => set((state) => ({
        sectors: state.sectors.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      
      deleteSector: (id) => set((state) => ({
        sectors: state.sectors.filter((s) => s.id !== id)
      })),

      // Crop Actions
      addCrop: (crop) => {
        const newCrop: Crop = { ...crop, id: `crop-${Date.now()}` }
        set((state) => ({ crops: [...state.crops, newCrop] }))
      },
      
      updateCrop: (id, updates) => set((state) => ({
        crops: state.crops.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),
      
      deleteCrop: (id) => set((state) => ({
        crops: state.crops.filter((c) => c.id !== id)
      })),

      // Device Actions
      addDevice: (device) => {
        const newDevice: Device = { ...device, id: `device-${Date.now()}` }
        set((state) => ({ devices: [...state.devices, newDevice] }))
        get().addAlert({
          severity: 'info',
          title: 'Novo dispositivo conectado',
          message: `${device.name} foi adicionado ao sistema`,
          source: 'devices',
          sourceId: newDevice.id
        })
      },
      
      updateDevice: (id, updates) => set((state) => ({
        devices: state.devices.map((d) => d.id === id ? { ...d, ...updates } : d)
      })),
      
      removeDevice: (id) => {
        const device = get().devices.find((d) => d.id === id)
        set((state) => ({
          devices: state.devices.filter((d) => d.id !== id),
          sensors: state.sensors.filter((s) => s.deviceId !== id),
          actuators: state.actuators.filter((a) => a.deviceId !== id)
        }))
        if (device) {
          get().addAlert({
            severity: 'info',
            title: 'Dispositivo removido',
            message: `${device.name} foi removido do sistema`,
            source: 'devices',
            sourceId: id
          })
        }
      },
      
      updateSensorValue: (sensorId, value) => set((state) => ({
        sensors: state.sensors.map((s) => {
          if (s.id === sensorId) {
            const newHistory = [...s.history.slice(-47), { timestamp: new Date(), value }]
            return { ...s, value, lastReading: new Date(), history: newHistory }
          }
          return s
        })
      })),
      
      toggleActuator: (actuatorId) => {
        const actuator = get().actuators.find((a) => a.id === actuatorId)
        if (!actuator) return
        
        const newState = !actuator.isActive
        set((state) => ({
          actuators: state.actuators.map((a) =>
            a.id === actuatorId ? {
              ...a,
              isActive: newState,
              lastActivation: newState ? new Date() : a.lastActivation
            } : a
          )
        }))
        
        get().addAlert({
          severity: 'info',
          title: newState ? 'Atuador ativado' : 'Atuador desativado',
          message: `${actuator.name} foi ${newState ? 'ligado' : 'desligado'}`,
          source: 'actuators',
          sourceId: actuatorId
        })
        
        if (newState && actuator.flowRate) {
          get().updateSustainability(actuator.flowRate * 0.5)
        }
      },

      // Automation Actions
      addAutomation: (automation) => {
        const newAutomation: Automation = {
          ...automation,
          id: `automation-${Date.now()}`,
          createdAt: new Date(),
          triggerCount: 0
        }
        set((state) => ({ automations: [...state.automations, newAutomation] }))
        get().addAlert({
          severity: 'info',
          title: 'Automacao criada',
          message: `"${automation.name}" foi criada com sucesso`,
          source: 'automations',
          sourceId: newAutomation.id
        })
      },
      
      updateAutomation: (id, updates) => set((state) => ({
        automations: state.automations.map((a) => a.id === id ? { ...a, ...updates } : a)
      })),
      
      deleteAutomation: (id) => {
        const automation = get().automations.find((a) => a.id === id)
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id)
        }))
        if (automation) {
          get().addAlert({
            severity: 'info',
            title: 'Automacao removida',
            message: `"${automation.name}" foi removida`,
            source: 'automations',
            sourceId: id
          })
        }
      },
      
      toggleAutomation: (id) => {
        const automation = get().automations.find((a) => a.id === id)
        if (!automation) return
        
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          )
        }))
        
        get().addAlert({
          severity: 'info',
          title: !automation.enabled ? 'Automacao ativada' : 'Automacao desativada',
          message: `"${automation.name}" foi ${!automation.enabled ? 'ativada' : 'desativada'}`,
          source: 'automations',
          sourceId: id
        })
      },

      // Weather Actions
      setWeather: (weather) => set({ weather }),

      // Alert Actions
      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: `alert-${Date.now()}`,
          timestamp: new Date(),
          acknowledged: false
        }
        set((state) => ({ alerts: [newAlert, ...state.alerts.slice(0, 49)] }))
      },
      
      acknowledgeAlert: (id) => set((state) => ({
        alerts: state.alerts.map((a) => a.id === id ? { ...a, acknowledged: true } : a)
      })),
      
      resolveAlert: (id) => set((state) => ({
        alerts: state.alerts.map((a) => a.id === id ? { ...a, resolvedAt: new Date() } : a)
      })),
      
      clearAlerts: () => set({ alerts: [] }),

      // Sustainability Actions
      updateSustainability: (waterUsed) => set((state) => {
        const traditionalEstimate = waterUsed * 1.4
        const saved = traditionalEstimate - waterUsed
        return {
          sustainability: {
            ...state.sustainability,
            waterUsed: state.sustainability.waterUsed + waterUsed,
            waterSaved: state.sustainability.waterSaved + saved,
            traditionalUsage: state.sustainability.traditionalUsage + traditionalEstimate,
            co2Reduced: state.sustainability.co2Reduced + (saved * 0.002),
            energySaved: state.sustainability.energySaved + (saved * 0.001),
            irrigationEvents: state.sustainability.irrigationEvents + 1,
            efficiency: ((state.sustainability.waterSaved + saved) / (state.sustainability.traditionalUsage + traditionalEstimate)) * 100,
            hasData: true
          }
        }
      }),
      
      addIrrigationEvent: (event) => {
        const newEvent: IrrigationEvent = { ...event, id: `event-${Date.now()}` }
        set((state) => ({
          irrigationHistory: [newEvent, ...state.irrigationHistory.slice(0, 99)]
        }))
      },

      // AI Recommendation Actions
      addRecommendation: (rec) => {
        const newRec: AIRecommendation = {
          ...rec,
          id: `rec-${Date.now()}`,
          createdAt: new Date(),
          dismissed: false
        }
        set((state) => ({ recommendations: [newRec, ...state.recommendations.slice(0, 19)] }))
      },
      
      dismissRecommendation: (id) => set((state) => ({
        recommendations: state.recommendations.map((r) =>
          r.id === id ? { ...r, dismissed: true } : r
        )
      })),
      
      applyRecommendation: (id) => set((state) => ({
        recommendations: state.recommendations.map((r) =>
          r.id === id ? { ...r, appliedAt: new Date() } : r
        )
      })),

      // Simulation Actions
      toggleSimulation: () => {
        const newState = !get().simulationEnabled
        set({ simulationEnabled: newState })
        get().addAlert({
          severity: 'info',
          title: newState ? 'Simulacao ativada' : 'Simulacao desativada',
          message: newState
            ? 'Os dados serao simulados para demonstracao'
            : 'Simulacao foi desativada',
          source: 'system',
          sourceId: 'simulation'
        })
      },

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view })
    }),
    {
      name: 'sustentra-storage',
      partialize: (state) => ({
        user: state.user,
        onboardingCompleted: state.onboardingCompleted,
        farms: state.farms,
        activeFarmId: state.activeFarmId,
        sectors: state.sectors,
        crops: state.crops,
        automations: state.automations,
        sustainability: state.sustainability,
        simulationEnabled: state.simulationEnabled
      })
    }
  )
)

// Legacy export for compatibility
export const useIrrigationStore = useSustentraStore
