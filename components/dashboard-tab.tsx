"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TransactionItem from "@/components/transaction-item"
import { useWallet } from "@/hooks/use-wallet"
import { formatAddress } from "@/lib/contract"

export default function DashboardTab() {
  const { transactions, address, balance, isCorrectNetwork, provider } = useWallet()

  // Calculate summary data based on current session transactions
  const sentAmount = transactions
    .filter((tx) => tx.type === "sent")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)
    .toFixed(4)

  const receivedAmount = transactions
    .filter((tx) => tx.type === "received")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)
    .toFixed(4)

  const netFlow = (Number.parseFloat(receivedAmount) - Number.parseFloat(sentAmount)).toFixed(4)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {!isCorrectNetwork && (
        <div className="md:col-span-2 lg:col-span-2">
          <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are not connected to Somnia Testnet (Chain ID: 50312). Some features may not work correctly. Please
              switch networks in your wallet settings.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 group-hover:animate-glow"></div>
        <CardHeader className="pb-2">
          <CardTitle>Tipping Summary</CardTitle>
          <CardDescription>Current session activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center rounded-lg border border-purple-500/20 bg-card p-3">
              <span className="text-xs text-muted-foreground">Sent</span>
              <span className="text-xl font-bold">{sentAmount}</span>
              <span className="text-xs text-muted-foreground">STT</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-purple-500/20 bg-card p-3">
              <span className="text-xs text-muted-foreground">Received</span>
              <span className="text-xl font-bold">{receivedAmount}</span>
              <span className="text-xs text-muted-foreground">STT</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-purple-500/20 bg-card p-3">
              <span className="text-xs text-muted-foreground">Net Flow</span>
              <span
                className={`text-xl font-bold ${Number.parseFloat(netFlow) >= 0 ? "text-green-500" : "text-destructive"}`}
              >
                {Number.parseFloat(netFlow) >= 0 ? "+" : ""}
                {netFlow}
              </span>
              <span className="text-xs text-muted-foreground">STT</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10 md:col-span-1 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 group-hover:animate-glow"></div>
        <CardHeader className="pb-2">
          <CardTitle>Wallet Info</CardTitle>
          <CardDescription>Your current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <span className="text-sm font-medium">{address ? formatAddress(address) : "Not connected"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm font-medium">{balance ? Number(balance).toFixed(4) : "0.0000"} STT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-amber-500"}`}></div>
                <span className="text-sm font-medium">Somnia Testnet</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chain ID</span>
              <span className="text-sm font-medium">50312</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Current session activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">
                <ArrowUp className="mr-2 h-4 w-4" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="received">
                <ArrowDown className="mr-2 h-4 w-4" />
                Received
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="sent" className="mt-4 space-y-4">
              {transactions.filter((tx) => tx.type === "sent").length > 0 ? (
                transactions
                  .filter((tx) => tx.type === "sent")
                  .map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                  <p className="text-muted-foreground">No sent transactions yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="received" className="mt-4 space-y-4">
              {transactions.filter((tx) => tx.type === "received").length > 0 ? (
                transactions
                  .filter((tx) => tx.type === "received")
                  .map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                  <p className="text-muted-foreground">No received transactions yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
