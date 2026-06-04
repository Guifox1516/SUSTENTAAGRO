"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Leaf,
  Sprout,
  Droplets,
  Cpu,
  Workflow,
  BarChart3,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  MapPin,
  Bell,
  Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSustentraStore } from "@/lib/sustentra-store"
import { cn } from "@/lib/utils"

const onboardingSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao Sustentra Agro",
    description: "A plataforma inteligente para irrigacao agricola sustentavel. Vamos configurar seu sistema em poucos minutos.",
    icon: Leaf,
    color: "from-primary to-accent",
    features: [
      "Economia de ate 40% de agua",
      "Monitoramento em tempo real",
      "Automacao inteligente",
      "Analise de dados avancada"
    ]
  },
  {
    id: "plantation",
    title: "Cadastre sua Plantacao",
    description: "Adicione informacoes sobre suas areas de cultivo para personalizarmos as recomendacoes.",
    icon: Sprout,
    color: "from-green-500 to-emerald-600",
    tips: [
      "Defina setores para organizar sua fazenda",
      "Cadastre os tipos de cultura em cada area",
      "Informe a fase de crescimento das plantas"
    ]
  },
  {
    id: "sensors",
    title: "Conecte seus Sensores",
    description: "Adicione sensores de umidade, temperatura e outros parametros para monitoramento preciso.",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
    tips: [
      "Sensores de umidade do solo sao essenciais",
      "Posicione-os em pontos estrategicos",
      "Calibre os sensores apos instalacao"
    ]
  },
  {
    id: "devices",
    title: "Configure Dispositivos",
    description: "Conecte Arduino, ESP32, Raspberry Pi e outros controladores ao sistema.",
    icon: Cpu,
    color: "from-purple-500 to-violet-600",
    devices: [
      { name: "Arduino", desc: "Ideal para iniciantes" },
      { name: "ESP32", desc: "Wi-Fi e Bluetooth integrados" },
      { name: "Raspberry Pi", desc: "Poder computacional avancado" },
      { name: "LoRa", desc: "Longo alcance para grandes areas" }
    ]
  },
  {
    id: "automation",
    title: "Crie Automacoes",
    description: "Configure regras personalizadas para automatizar a irrigacao de forma inteligente.",
    icon: Workflow,
    color: "from-orange-500 to-amber-500",
    examples: [
      "SE umidade < 30% ENTAO ligar irrigador",
      "SE previsao de chuva > 70% ENTAO cancelar",
      "AGENDAR irrigacao as 6h e 18h"
    ]
  },
  {
    id: "monitoring",
    title: "Monitore e Economize",
    description: "Acompanhe dados em tempo real e veja quanto esta economizando em agua e energia.",
    icon: BarChart3,
    color: "from-teal-500 to-emerald-500",
    metrics: [
      { label: "Agua Economizada", value: "40%" },
      { label: "Reducao CO2", value: "25%" },
      { label: "Eficiencia", value: "95%" }
    ]
  },
  {
    id: "intelligence",
    title: "Inteligencia Agricola",
    description: "Receba recomendacoes personalizadas baseadas em analises avancadas.",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    tips: [
      "Analise do tipo de planta e fase",
      "Consideracao do clima e previsoes",
      "Sugestoes de otimizacao continuas"
    ]
  },
  {
    id: "complete",
    title: "Tudo Pronto!",
    description: "Seu sistema esta configurado. Comece a monitorar e economizar agua agora mesmo.",
    icon: Check,
    color: "from-primary to-accent"
  }
]

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, completeOnboarding, onboardingCompleted } = useSustentraStore()
  const [direction, setDirection] = useState(0)

  const currentStep = onboardingSteps[onboardingStep]
  const progress = ((onboardingStep + 1) / onboardingSteps.length) * 100

  const nextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setDirection(1)
      setOnboardingStep(onboardingStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (onboardingStep > 0) {
      setDirection(-1)
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  if (onboardingCompleted) return null

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  const IconComponent = currentStep.icon

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Passo {onboardingStep + 1} de {onboardingSteps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={skipOnboarding}>
              Pular tutorial
            </Button>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Content Card */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-8 shadow-2xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className={cn(
                    "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center",
                    currentStep.color
                  )}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <IconComponent className="h-10 w-10 text-white" />
                </motion.div>
              </div>

              {/* Title & Description */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {currentStep.description}
                </p>
              </div>

              {/* Step-specific content */}
              {currentStep.features && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {currentStep.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
                    >
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep.tips && (
                <div className="space-y-3 mb-8">
                  {currentStep.tips.map((tip, i) => (
                    <motion.div
                      key={tip}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep.devices && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {currentStep.devices.map((device, i) => (
                    <motion.div
                      key={device.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="font-medium text-foreground">{device.name}</div>
                      <div className="text-xs text-muted-foreground">{device.desc}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep.examples && (
                <div className="space-y-2 mb-8">
                  {currentStep.examples.map((example, i) => (
                    <motion.div
                      key={example}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="p-3 bg-secondary/50 rounded-lg font-mono text-sm text-primary"
                    >
                      {example}
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {currentStep.metrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl"
                    >
                      <div className="text-3xl font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep.id === "complete" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center mb-8"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                    <Check className="h-12 w-12 text-primary-foreground" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={onboardingStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex gap-1">
              {onboardingSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > onboardingStep ? 1 : -1)
                    setOnboardingStep(i)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === onboardingStep
                      ? "w-6 bg-primary"
                      : i < onboardingStep
                      ? "bg-primary/50"
                      : "bg-border"
                  )}
                />
              ))}
            </div>

            <Button onClick={nextStep} className="gap-2">
              {onboardingStep === onboardingSteps.length - 1 ? (
                <>
                  Comecar
                  <Zap className="h-4 w-4" />
                </>
              ) : (
                <>
                  Proximo
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Step indicators below */}
        <div className="flex justify-center mt-6 gap-2">
          {onboardingSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                i === onboardingStep
                  ? "bg-primary/20 text-primary"
                  : i < onboardingStep
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              )}
            >
              {i < onboardingStep && <Check className="h-3 w-3" />}
              <span className="hidden sm:inline">{step.title.split(" ")[0]}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
