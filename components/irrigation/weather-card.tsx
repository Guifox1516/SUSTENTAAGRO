"use client"

import { Droplets, Thermometer, CloudRain, Wind, Sun, Cloud, CloudSun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIrrigationStore } from "@/lib/store"

const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-400" />
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-muted-foreground" />
    case 'partly-cloudy':
      return <CloudSun className="h-8 w-8 text-yellow-300" />
    case 'rainy':
      return <CloudRain className="h-8 w-8 text-accent" />
    default:
      return <Sun className="h-8 w-8 text-yellow-400" />
  }
}

export function WeatherCard() {
  const { weather } = useIrrigationStore()

  if (!weather) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Clima</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando dados...</p>
        </CardContent>
      </Card>
    )
  }

  const showRainWarning = weather.rainProbability > 50

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          Condições Meteorológicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.icon)}
            <div>
              <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground">{weather.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <Thermometer className="h-5 w-5 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Temperatura</span>
            <span className="text-sm font-semibold text-foreground">{weather.temperature}°C</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <Droplets className="h-5 w-5 text-accent mb-1" />
            <span className="text-xs text-muted-foreground">Umidade Ar</span>
            <span className="text-sm font-semibold text-foreground">{weather.humidity}%</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <CloudRain className="h-5 w-5 text-accent mb-1" />
            <span className="text-xs text-muted-foreground">Chance Chuva</span>
            <span className="text-sm font-semibold text-foreground">{weather.rainProbability}%</span>
          </div>
        </div>

        {showRainWarning && (
          <div className="mt-4 p-3 bg-accent/20 border border-accent/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-accent" />
              <p className="text-sm text-foreground">
                <strong>Sugestão:</strong> Alta probabilidade de chuva. Considere adiar a irrigação.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
