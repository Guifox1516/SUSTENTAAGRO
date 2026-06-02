"use client"

import { useState, useEffect } from "react"
import { 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Sun, 
  Cloud, 
  CloudSun,
  CloudSnow,
  CloudLightning,
  AlertCircle,
  RefreshCw,
  Calendar,
  Clock,
  Umbrella,
  Sprout
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIrrigationStore } from "@/lib/store"

const getWeatherIcon = (icon: string, size: "sm" | "lg" = "lg") => {
  const sizeClass = size === "lg" ? "h-12 w-12" : "h-6 w-6"
  
  switch (icon) {
    case 'sunny':
      return <Sun className={`${sizeClass} text-yellow-400`} />
    case 'cloudy':
      return <Cloud className={`${sizeClass} text-muted-foreground`} />
    case 'partly-cloudy':
      return <CloudSun className={`${sizeClass} text-yellow-300`} />
    case 'rainy':
      return <CloudRain className={`${sizeClass} text-accent`} />
    case 'storm':
      return <CloudLightning className={`${sizeClass} text-purple-400`} />
    case 'snow':
      return <CloudSnow className={`${sizeClass} text-blue-200`} />
    default:
      return <Sun className={`${sizeClass} text-yellow-400`} />
  }
}

// Previsão simulada para os próximos dias
const generateForecast = () => {
  const conditions = [
    { icon: 'sunny', description: 'Ensolarado', minTemp: 22, maxTemp: 32 },
    { icon: 'partly-cloudy', description: 'Parcialmente nublado', minTemp: 20, maxTemp: 28 },
    { icon: 'cloudy', description: 'Nublado', minTemp: 18, maxTemp: 25 },
    { icon: 'rainy', description: 'Chuvoso', minTemp: 16, maxTemp: 22 },
  ]
  
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const today = new Date().getDay()
  
  return Array.from({ length: 5 }, (_, i) => {
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    const dayIndex = (today + i + 1) % 7
    return {
      day: i === 0 ? 'Amanhã' : days[dayIndex],
      ...condition,
      rainProbability: Math.floor(Math.random() * 100)
    }
  })
}

export function MeteorologyCard() {
  const { weather, simulationEnabled } = useIrrigationStore()
  const [forecast, setForecast] = useState(generateForecast())
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (simulationEnabled) {
      const interval = setInterval(() => {
        setForecast(generateForecast())
        setLastUpdate(new Date())
      }, 60000) // Atualiza a cada minuto
      return () => clearInterval(interval)
    }
  }, [simulationEnabled])

  const handleRefresh = () => {
    setForecast(generateForecast())
    setLastUpdate(new Date())
  }

  // Se não há dados meteorológicos disponíveis
  if (!weather && !simulationEnabled) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Meteorologia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Dados meteorológicos não disponíveis
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Conecte uma API meteorológica ou ative a simulação para visualizar dados climáticos.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const showRainWarning = weather && weather.rainProbability > 50
  const showDryWarning = weather && weather.rainProbability < 20 && weather.humidity < 40
  const showHeatWarning = weather && weather.temperature > 35

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Condições Atuais
            </CardTitle>
            <div className="flex items-center gap-2">
              {simulationEnabled && (
                <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                  Simulado
                </span>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weather && (
            <>
              {/* Current Weather Display */}
              <div className="flex items-center justify-between mb-6 p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weather.icon)}
                  <div>
                    <p className="text-4xl font-bold text-foreground">{weather.temperature}°C</p>
                    <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <Thermometer className="h-6 w-6 text-orange-400 mb-2" />
                  <span className="text-xs text-muted-foreground">Temperatura</span>
                  <span className="text-lg font-bold text-foreground">{weather.temperature}°C</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <Droplets className="h-6 w-6 text-accent mb-2" />
                  <span className="text-xs text-muted-foreground">Umidade do Ar</span>
                  <span className="text-lg font-bold text-foreground">{weather.humidity}%</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <Umbrella className="h-6 w-6 text-accent mb-2" />
                  <span className="text-xs text-muted-foreground">Chance de Chuva</span>
                  <span className="text-lg font-bold text-foreground">{weather.rainProbability}%</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <Wind className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Vento</span>
                  <span className="text-lg font-bold text-foreground">12 km/h</span>
                </div>
              </div>

              {/* Smart Suggestions */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  Sugestões Inteligentes
                </h4>
                
                {showRainWarning && (
                  <div className="p-3 bg-accent/20 border border-accent/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Chuva prevista - Evitar irrigação</p>
                        <p className="text-xs text-muted-foreground">
                          Alta probabilidade de precipitação ({weather.rainProbability}%). Recomendado aguardar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {showDryWarning && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Tempo seco - Considerar irrigação</p>
                        <p className="text-xs text-muted-foreground">
                          Umidade do ar baixa ({weather.humidity}%) e sem previsão de chuva. Monitorar umidade do solo.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {showHeatWarning && (
                  <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Temperatura elevada</p>
                        <p className="text-xs text-muted-foreground">
                          Evitar irrigação nas horas mais quentes. Prefira início da manhã ou final da tarde.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!showRainWarning && !showDryWarning && !showHeatWarning && (
                  <div className="p-3 bg-primary/20 border border-primary/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Condições favoráveis</p>
                        <p className="text-xs text-muted-foreground">
                          Clima adequado para irrigação. Verifique a umidade do solo antes de irrigar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Forecast Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Previsão para os Próximos Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <span className="text-xs font-medium text-foreground mb-2">{day.day}</span>
                {getWeatherIcon(day.icon, "sm")}
                <div className="mt-2 text-center">
                  <span className="text-sm font-bold text-foreground">{day.maxTemp}°</span>
                  <span className="text-xs text-muted-foreground"> / {day.minTemp}°</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Droplets className="h-3 w-3 text-accent" />
                  <span className="text-[10px] text-muted-foreground">{day.rainProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
