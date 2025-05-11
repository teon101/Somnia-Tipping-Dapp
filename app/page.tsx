import DashboardTabs from "@/components/dashboard-tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Somnia Tipping dApp</h1>
            <p className="text-muted-foreground">Send and receive STT tokens on the Somnia Testnet</p>
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
  )
}
