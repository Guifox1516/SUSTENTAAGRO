"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { SoilMonitorCard } from "./soil-monitor-card"
import { WeatherCard } from "./weather-card"
import { IrrigationControlCard } from "./irrigation-control-card"
import { AutomationCard } from "./automation-card"
import { SustainabilityCard } from "./sustainability-card"
import { MoistureHistoryChart } from "./moisture-history-chart"
import { MeteorologyCard } from "./meteorology-card"
import { useSimulation, useIrrigationStore } from "@/lib/store"
import { Droplets, Power, AlertCircle } from "lucide-react"

const sectionConfig = {
  dashboard: {
    title: "Dashboard",
    description: "Visão geral do sistema de irrigação"
  },
  monitoring: {
    title: "Monitoramento do Solo",
    description: "Acompanhe a umidade em tempo real"
  },
  meteorology: {
    title: "Meteorologia",
    description: "Dados climáticos e previsão do tempo"
  },
  control: {
    title: "Controle de Irrigação",
    description: "Gerencie irrigadores e bombas"
  },
  automation: {
    title: "Automação",
    description: "Configure regras de irrigação automática"
  },
  sustainability: {
    title: "Sustentabilidade",
    description: "Métricas de impacto ambiental"
  }
}

function QuickStats() {
  const { sensors, irrigators, simulationEnabled } = useIrrigationStore()
  
  const avgMoisture = Math.round(
    sensors.reduce((acc, s) => acc + s.soilMoisture, 0) / sensors.length
  )
  const activeIrrigators = irrigators.filter(i => i.isActive).length
  
  // Verifica se há sensores com umidade baixa
  const lowMoistureSensors = sensors.filter(s => s.soilMoisture < 30).length

  const stats = [
    {
      label: "Umidade Média",
      value: `${avgMoisture}%`,
      icon: Droplets,
      color: avgMoisture < 30 ? "text-destructive" : avgMoisture < 50 ? "text-yellow-400" : "text-accent"
    },
    {
      label: "Irrigadores Ativos",
      value: `${activeIrrigators}/${irrigators.length}`,
      icon: Power,
      color: activeIrrigators > 0 ? "text-primary" : "text-muted-foreground"
    },
    {
      label: "Alertas de Solo Seco",
      value: lowMoistureSensors,
      icon: AlertCircle,
      color: lowMoistureSensors > 0 ? "text-destructive" : "text-primary"
    },
    {
      label: "Status do Sistema",
      value: simulationEnabled ? "Simulação" : "Real",
      icon: Droplets,
      color: simulationEnabled ? "text-yellow-400" : "text-primary"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export function IrrigationDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { simulateSensorUpdate } = useSimulation()
  const { simulationEnabled } = useIrrigationStore()

  // Simulate sensor updates every 30 seconds only if simulation is enabled
  useEffect(() => {
    if (!simulationEnabled) return
    
    const interval = setInterval(() => {
      simulateSensorUpdate()
    }, 30000)

    return () => clearInterval(interval)
  }, [simulateSensorUpdate, simulationEnabled])

  const currentSection = sectionConfig[activeSection as keyof typeof sectionConfig]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="md:ml-64 p-4 md:p-8">
        <Header 
          title={currentSection.title} 
          description={currentSection.description}
        />

        {/* Dashboard View */}
        {activeSection === "dashboard" && (
          <>
            <QuickStats />
            <div className="grid gap-6 lg:grid-cols-2">
              <SoilMonitorCard />
              <WeatherCard />
              <MoistureHistoryChart />
              <IrrigationControlCard />
            </div>
          </>
        )}

        {/* Monitoring View */}
        {activeSection === "monitoring" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SoilMonitorCard />
            <MoistureHistoryChart />
          </div>
        )}

        {/* Meteorology View */}
        {activeSection === "meteorology" && (
          <MeteorologyCard />
        )}

        {/* Control View */}
        {activeSection === "control" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <IrrigationControlCard />
            <SoilMonitorCard />
            <div className="lg:col-span-2">
              <WeatherCard />
            </div>
          </div>
        )}

        {/* Automation View */}
        {activeSection === "automation" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <AutomationCard />
            <div className="space-y-6">
              <SoilMonitorCard />
              <WeatherCard />
            </div>
          </div>
        )}

        {/* Sustainability View */}
        {activeSection === "sustainability" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SustainabilityCard />
            <MoistureHistoryChart />
          </div>
        )}
      </main>
    </div>
  )
}
