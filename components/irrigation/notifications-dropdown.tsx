"use client"

import { Bell, X, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useIrrigationStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const getNotificationIcon = (type: "info" | "warning" | "success") => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-primary" />
    default:
      return <Info className="h-4 w-4 text-accent" />
  }
}

export function NotificationsDropdown() {
  const { notifications, clearNotification } = useIrrigationStore()

  const unreadCount = notifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover border-border">
        <DropdownMenuLabel className="text-foreground">Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-default focus:bg-secondary"
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    clearNotification(notification.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
