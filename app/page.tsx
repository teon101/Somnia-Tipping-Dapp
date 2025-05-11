import DashboardTabs from "@/components/dashboard-tabs"
import VantaBackground from "@/components/vanta-background"
import VantaSettingsPanel from "@/components/vanta-settings-panel"
import Image from "next/image"

export default function Home() {
  return (
    <VantaBackground>
      <main className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Image src="/images/somnia-logo.png" alt="Somnia Logo" width={40} height={40} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Somnia Tipping dApp</h1>
                <p className="text-muted-foreground">Send and receive STT tokens on the Somnia Testnet</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-purple-500/20 bg-card px-3 text-sm text-card-foreground shadow-sm shadow-purple-500/10">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Somnia Testnet</span>
              </div>
            </div>
          </div>
          <DashboardTabs />
        </div>
      </main>
      <VantaSettingsPanel />
    </VantaBackground>
  )
}
