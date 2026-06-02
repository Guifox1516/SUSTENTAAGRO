import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SensorData {
  id: string
  name: string
  soilMoisture: number
  timestamp: Date
}

export interface WeatherData {
  temperature: number
  humidity: number
  rainProbability: number
  description: string
  icon: string
}

export interface Irrigator {
  id: string
  name: string
  zone: string
  isActive: boolean
  lastActivation: Date | null
}

export interface Pump {
  id: string
  name: string
  isActive: boolean
  flowRate: number // liters per hour
}

export interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  condition: {
    type: 'moisture_below' | 'moisture_above' | 'schedule' | 'weather'
    value: number
    sensorId?: string
  }
  action: {
    type: 'activate_irrigator' | 'deactivate_irrigator' | 'activate_pump' | 'deactivate_pump'
    targetId: string
    duration?: number // in minutes
  }
  createdAt: Date
}

export interface SustainabilityMetrics {
  waterSaved: number // liters
  traditionalUsage: number // liters (estimated without system)
  co2Reduced: number // kg
  irrigationEvents: number
  hasData: boolean // indica se há dados reais ou simulação ativada
}

export interface HistoryEntry {
  timestamp: Date
  soilMoisture: number
  sensorId: string
}

interface IrrigationStore {
  // Sensors
  sensors: SensorData[]
  sensorHistory: HistoryEntry[]
  
  // Weather
  weather: WeatherData | null
  
  // Irrigators and Pumps
  irrigators: Irrigator[]
  pumps: Pump[]
  
  // Automation
  automationRules: AutomationRule[]
  
  // Sustainability
  sustainability: SustainabilityMetrics
  
  // Notifications
  notifications: { id: string; message: string; type: 'info' | 'warning' | 'success'; timestamp: Date }[]
  
  // Simulation control
  simulationEnabled: boolean
  
  // Actions
  toggleSimulation: () => void
  updateSensorData: (sensorId: string, moisture: number) => void
  toggleIrrigator: (irrigatorId: string) => void
  togglePump: (pumpId: string) => void
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'createdAt'>) => void
  updateAutomationRule: (ruleId: string, updates: Partial<AutomationRule>) => void
  deleteAutomationRule: (ruleId: string) => void
  toggleAutomationRule: (ruleId: string) => void
  setWeather: (weather: WeatherData) => void
  addNotification: (message: string, type: 'info' | 'warning' | 'success') => void
  clearNotification: (id: string) => void
  updateSustainability: (waterUsed: number) => void
}

// Generate simulated sensor data
const generateSensorHistory = (): HistoryEntry[] => {
  const history: HistoryEntry[] = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    // Simulate moisture fluctuation
    const baseMoisture = 45 + Math.sin(i / 4) * 15
    const noise = (Math.random() - 0.5) * 10
    
    history.push({
      timestamp,
      soilMoisture: Math.max(15, Math.min(85, baseMoisture + noise)),
      sensorId: 'sensor-1'
    })
  }
  
  return history
}

export const useIrrigationStore = create<IrrigationStore>()(
  persist(
    (set, get) => ({
      // Initial sensor data (simulated)
      sensors: [
        { id: 'sensor-1', name: 'Zona Norte', soilMoisture: 42, timestamp: new Date() },
        { id: 'sensor-2', name: 'Zona Sul', soilMoisture: 58, timestamp: new Date() },
        { id: 'sensor-3', name: 'Zona Leste', soilMoisture: 35, timestamp: new Date() },
        { id: 'sensor-4', name: 'Zona Oeste', soilMoisture: 67, timestamp: new Date() },
      ],
      
      sensorHistory: generateSensorHistory(),
      
      weather: {
        temperature: 28,
        humidity: 65,
        rainProbability: 20,
        description: 'Parcialmente nublado',
        icon: 'partly-cloudy'
      },
      
      irrigators: [
        { id: 'irrigator-1', name: 'Irrigador A', zone: 'Zona Norte', isActive: false, lastActivation: null },
        { id: 'irrigator-2', name: 'Irrigador B', zone: 'Zona Sul', isActive: false, lastActivation: null },
        { id: 'irrigator-3', name: 'Irrigador C', zone: 'Zona Leste', isActive: false, lastActivation: null },
        { id: 'irrigator-4', name: 'Irrigador D', zone: 'Zona Oeste', isActive: false, lastActivation: null },
      ],
      
      pumps: [
        { id: 'pump-1', name: 'Bomba Principal', isActive: false, flowRate: 500 },
        { id: 'pump-2', name: 'Bomba Secundária', isActive: false, flowRate: 300 },
      ],
      
      automationRules: [],
      
      sustainability: {
        waterSaved: 0,
        traditionalUsage: 0,
        co2Reduced: 0,
        irrigationEvents: 0,
        hasData: false
      },
      
      simulationEnabled: false,
      
      notifications: [],
      
      toggleSimulation: () => {
        set((state) => {
          const newEnabled = !state.simulationEnabled
          if (newEnabled && !state.sustainability.hasData) {
            // Quando ativa simulação, inicializa dados de sustentabilidade
            return {
              simulationEnabled: newEnabled,
              sustainability: {
                waterSaved: 0,
                traditionalUsage: 0,
                co2Reduced: 0,
                irrigationEvents: 0,
                hasData: true
              }
            }
          }
          return { simulationEnabled: newEnabled }
        })
        get().addNotification(
          get().simulationEnabled ? 'Simulação desativada' : 'Simulação ativada',
          'info'
        )
      },
      
      updateSensorData: (sensorId, moisture) => {
        set((state) => ({
          sensors: state.sensors.map((s) =>
            s.id === sensorId ? { ...s, soilMoisture: moisture, timestamp: new Date() } : s
          ),
          sensorHistory: [
            ...state.sensorHistory.slice(-47),
            { timestamp: new Date(), soilMoisture: moisture, sensorId }
          ]
        }))
      },
      
      toggleIrrigator: (irrigatorId) => {
        const irrigator = get().irrigators.find((i) => i.id === irrigatorId)
        if (!irrigator) return
        
        set((state) => ({
          irrigators: state.irrigators.map((i) =>
            i.id === irrigatorId
              ? { ...i, isActive: !i.isActive, lastActivation: !i.isActive ? new Date() : i.lastActivation }
              : i
          )
        }))
        
        // Add notification
        get().addNotification(
          `${irrigator.name} ${!irrigator.isActive ? 'ativado' : 'desativado'}`,
          !irrigator.isActive ? 'success' : 'info'
        )
        
        // Update sustainability if turning on
        if (!irrigator.isActive) {
          get().updateSustainability(5) // 5 liters per activation
        }
      },
      
      togglePump: (pumpId) => {
        const pump = get().pumps.find((p) => p.id === pumpId)
        if (!pump) return
        
        set((state) => ({
          pumps: state.pumps.map((p) =>
            p.id === pumpId ? { ...p, isActive: !p.isActive } : p
          )
        }))
        
        get().addNotification(
          `${pump.name} ${!pump.isActive ? 'ativada' : 'desativada'}`,
          !pump.isActive ? 'success' : 'info'
        )
      },
      
      addAutomationRule: (rule) => {
        const newRule: AutomationRule = {
          ...rule,
          id: `rule-${Date.now()}`,
          createdAt: new Date()
        }
        
        set((state) => ({
          automationRules: [...state.automationRules, newRule]
        }))
        
        get().addNotification(`Regra "${rule.name}" criada com sucesso`, 'success')
      },
      
      updateAutomationRule: (ruleId, updates) => {
        set((state) => ({
          automationRules: state.automationRules.map((r) =>
            r.id === ruleId ? { ...r, ...updates } : r
          )
        }))
      },
      
      deleteAutomationRule: (ruleId) => {
        const rule = get().automationRules.find((r) => r.id === ruleId)
        set((state) => ({
          automationRules: state.automationRules.filter((r) => r.id !== ruleId)
        }))
        if (rule) {
          get().addNotification(`Regra "${rule.name}" removida`, 'info')
        }
      },
      
      toggleAutomationRule: (ruleId) => {
        const rule = get().automationRules.find((r) => r.id === ruleId)
        if (!rule) return
        
        set((state) => ({
          automationRules: state.automationRules.map((r) =>
            r.id === ruleId ? { ...r, enabled: !r.enabled } : r
          )
        }))
        
        get().addNotification(
          `Regra "${rule.name}" ${!rule.enabled ? 'ativada' : 'desativada'}`,
          !rule.enabled ? 'success' : 'info'
        )
      },
      
      setWeather: (weather) => {
        set({ weather })
      },
      
      addNotification: (message, type) => {
        const notification = {
          id: `notif-${Date.now()}`,
          message,
          type,
          timestamp: new Date()
        }
        
        set((state) => ({
          notifications: [notification, ...state.notifications.slice(0, 9)]
        }))
      },
      
      clearNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }))
      },
      
      updateSustainability: (waterUsed) => {
        set((state) => {
          if (!state.sustainability.hasData) return state
          return {
            sustainability: {
              ...state.sustainability,
              waterSaved: state.sustainability.waterSaved + (waterUsed * 0.3), // 30% savings estimate
              traditionalUsage: state.sustainability.traditionalUsage + waterUsed,
              irrigationEvents: state.sustainability.irrigationEvents + 1,
              co2Reduced: state.sustainability.co2Reduced + (waterUsed * 0.002) // CO2 estimate
            }
          }
        })
      }
    }),
    {
      name: 'irrigation-storage',
      partialize: (state) => ({
        automationRules: state.automationRules,
        sustainability: state.sustainability,
        simulationEnabled: state.simulationEnabled
      })
    }
  )
)

// Simulation hook for demo purposes
export const useSimulation = () => {
  const { sensors, updateSensorData, weather, automationRules, toggleIrrigator } = useIrrigationStore()
  
  const simulateSensorUpdate = () => {
    sensors.forEach((sensor) => {
      const change = (Math.random() - 0.5) * 5
      const newMoisture = Math.max(10, Math.min(90, sensor.soilMoisture + change))
      updateSensorData(sensor.id, Math.round(newMoisture * 10) / 10)
    })
  }
  
  const checkAutomationRules = () => {
    automationRules.forEach((rule) => {
      if (!rule.enabled) return
      
      if (rule.condition.type === 'moisture_below' && rule.condition.sensorId) {
        const sensor = sensors.find((s) => s.id === rule.condition.sensorId)
        if (sensor && sensor.soilMoisture < rule.condition.value) {
          // Rule triggered - but only notify, don't auto-activate
          console.log(`[Automação] Regra "${rule.name}" acionada - umidade abaixo de ${rule.condition.value}%`)
        }
      }
      
      if (rule.condition.type === 'weather' && weather) {
        if (weather.rainProbability > rule.condition.value) {
          console.log(`[Automação] Regra "${rule.name}" sugere não irrigar - previsão de chuva`)
        }
      }
    })
  }
  
  return { simulateSensorUpdate, checkAutomationRules }
}
