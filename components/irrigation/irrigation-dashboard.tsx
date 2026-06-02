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
import { useSimulation } from "@/lib/store"
import { Droplets, Power, Leaf, Gauge } from "lucide-react"
import { useIrrigationStore } from "@/lib/store"

const sectionConfig = {
  dashboard: {
    title: "Dashboard",
    description: "Visão geral do sistema de irrigação"
  },
  monitoring: {
    title: "Monitoramento do Solo",
    description: "Acompanhe a umidade em tempo real"
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
  const { sensors, irrigators, sustainability } = useIrrigationStore()
  
  const avgMoisture = Math.round(
    sensors.reduce((acc, s) => acc + s.soilMoisture, 0) / sensors.length
  )
  const activeIrrigators = irrigators.filter(i => i.isActive).length
  const savingsPercentage = Math.round(
    (sustainability.waterSaved / sustainability.traditionalUsage) * 100
  )

  const stats = [
    {
      label: "Umidade Média",
      value: `${avgMoisture}%`,
      icon: Droplets,
      color: "text-accent"
    },
    {
      label: "Irrigadores Ativos",
      value: `${activeIrrigators}/${irrigators.length}`,
      icon: Power,
      color: "text-primary"
    },
    {
      label: "Água Economizada",
      value: `${(sustainability.waterSaved / 1000).toFixed(1)}k L`,
      icon: Gauge,
      color: "text-yellow-400"
    },
    {
      label: "Economia vs Tradicional",
      value: `${savingsPercentage}%`,
      icon: Leaf,
      color: "text-primary"
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

  // Simulate sensor updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      simulateSensorUpdate()
    }, 30000)

    return () => clearInterval(interval)
  }, [simulateSensorUpdate])

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
            <div className="lg:col-span-2">
              <WeatherCard />
            </div>
          </div>
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
