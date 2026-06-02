"use client"

import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  Droplets, 
  Power, 
  Bot, 
  Leaf, 
  Settings,
  Menu,
  X,
  Sprout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "monitoring", label: "Monitoramento", icon: Droplets },
  { id: "control", label: "Controle", icon: Power },
  { id: "automation", label: "Automação", icon: Bot },
  { id: "sustainability", label: "Sustentabilidade", icon: Leaf },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleNavClick = (section: string) => {
    onSectionChange(section)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
        isMobile && !isOpen && "-translate-x-full",
        !isMobile && "translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">AgroIrriga</h1>
            <p className="text-xs text-muted-foreground">Irrigação Inteligente</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Fazenda Demo</p>
              <p className="text-xs text-muted-foreground">Modo Simulação</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            v1.0.0 Beta • Pronto para testes
          </p>
        </div>
      </aside>
    </>
  )
}
