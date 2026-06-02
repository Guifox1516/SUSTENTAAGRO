"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "./notifications-dropdown"
import { useSimulation } from "@/lib/store"
import { useState } from "react"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { simulateSensorUpdate } = useSimulation()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    simulateSensorUpdate()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Atualizar dados</span>
        </Button>
        <NotificationsDropdown />
      </div>
    </header>
  )
}
