"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Cpu,
  Workflow,
  FlaskConical,
  Brain,
  Map,
  Bell,
  Settings,
  Menu,
  X,
  Leaf,
  ChevronRight,
  LogOut,
  User,
  HelpCircle,
  Droplets,
  Sprout
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useSustentraStore } from "@/lib/sustentra-store"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "devices", label: "Dispositivos", icon: Cpu, href: "/devices", badge: "IoT" },
  { id: "automation", label: "Automacao", icon: Workflow, href: "/automation" },
  { id: "lab", label: "Laboratorio", icon: FlaskConical, href: "/lab", badge: "Beta" },
  { id: "intelligence", label: "Inteligencia", icon: Brain, href: "/intelligence" },
  { id: "map", label: "Mapa", icon: Map, href: "/map" },
]

const bottomNavItems = [
  { id: "alerts", label: "Alertas", icon: Bell, href: "/alerts" },
  { id: "settings", label: "Configuracoes", icon: Settings, href: "/settings" },
  { id: "help", label: "Ajuda", icon: HelpCircle, href: "/help" },
]

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, alerts } = useSustentraStore()
  
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  const NavItem = ({ item, isCollapsed }: { item: typeof navItems[0]; isCollapsed: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    
    return (
      <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
        <motion.div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
            isActive
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
            />
          )}
          <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
          {!isCollapsed && (
            <>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {item.badge}
                </Badge>
              )}
              {item.id === "alerts" && unreadAlerts > 0 && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-[18px] flex items-center justify-center">
                  {unreadAlerts}
                </Badge>
              )}
            </>
          )}
        </motion.div>
      </Link>
    )
  }

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", isCollapsed && "justify-center")}>
        <div className="relative">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Sustentra</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Agro</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={cn("mb-4", isCollapsed ? "text-center" : "px-3")}>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {isCollapsed ? "Nav" : "Navegacao"}
          </span>
        </div>
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} isCollapsed={isCollapsed} />
        ))}
        
        <div className={cn("mt-6 mb-4 pt-4 border-t border-border", isCollapsed ? "text-center" : "px-3")}>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {isCollapsed ? "Sys" : "Sistema"}
          </span>
        </div>
        {bottomNavItems.map((item) => (
          <NavItem key={item.id} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* User Menu */}
      <div className={cn("p-3 border-t border-border", isCollapsed && "flex justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-auto py-2.5 px-3",
                isCollapsed && "w-auto px-2"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || "Admin"}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle (Desktop) */}
      {!isMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md hidden md:flex"
        >
          <ChevronRight className={cn("h-3 w-3 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-50 md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4"
              >
                <X className="h-5 w-5" />
              </Button>
              <SidebarContent isCollapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 72 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border z-30 flex-col"
      >
        <SidebarContent isCollapsed={!isOpen} />
      </motion.aside>

      {/* Spacer */}
      <div className={cn("hidden md:block flex-shrink-0 transition-all duration-300", isOpen ? "w-[260px]" : "w-[72px]")} />
    </>
  )
}
