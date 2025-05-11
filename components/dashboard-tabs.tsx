"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Send, History, User } from "lucide-react"

import DashboardTab from "@/components/dashboard-tab"
import SendTipTab from "@/components/send-tip-tab"
import HistoryTab from "@/components/history-tab"
import ProfileTab from "@/components/profile-tab"
import WalletConnect from "@/components/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

export default function DashboardTabs() {
  const { isConnected, connectWallet } = useWallet()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>

      {isConnected ? (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send Tip</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="send">
            <SendTipTab />
          </TabsContent>
          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-6 relative">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 p-3 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-purple-500/30 animate-ping"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 animate-spin-slow"></div>
            </div>
            <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to access the Somnia Tipping dApp and start sending and receiving STT tokens.
            </p>
            <Button
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 relative overflow-hidden group"
              onClick={() => connectWallet()}
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 translate-x-[-100%] group-hover:animate-shimmer"></div>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
