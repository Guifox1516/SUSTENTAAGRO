"use client"

import { AppSidebar } from "@/components/sustentra/app-sidebar"
import { AppHeader } from "@/components/sustentra/app-header"
import { AutomationPage } from "@/components/sustentra/automation-page"
import { OnboardingFlow } from "@/components/sustentra/onboarding-flow"
import { useSustentraStore } from "@/lib/sustentra-store"

export default function Automation() {
  const { onboardingCompleted } = useSustentraStore()

  return (
    <>
      <OnboardingFlow />
      
      {onboardingCompleted && (
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <AppHeader />
            
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <AutomationPage />
            </main>
          </div>
        </div>
      )}
    </>
  )
}
