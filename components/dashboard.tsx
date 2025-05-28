"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, Users, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatAddress } from "@/lib/utils"

interface DashboardProps {
  account: string
  balance: string
  transactions: any[]
  onRefreshBalance: () => void
  currencySymbol: string
}

export default function Dashboard({
  account,
  balance,
  transactions,
  onRefreshBalance,
  currencySymbol,
}: DashboardProps) {
  // Calculate statistics
  const sentTips = transactions.filter((tx) => tx.type === "sent")
  const receivedTips = transactions.filter((tx) => tx.type === "received")

  const totalSent = sentTips.reduce((acc, tx) => acc + Number.parseFloat(tx.amount), 0)
  const totalReceived = receivedTips.reduce((acc, tx) => acc + Number.parseFloat(tx.amount), 0)

  const uniqueRecipients = new Set(sentTips.map((tx) => tx.recipient)).size
  const uniqueSenders = new Set(receivedTips.map((tx) => tx.sender)).size

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CardDescription>Your current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{Number.parseFloat(balance).toFixed(4)}</div>
              <Button variant="outline" size="icon" onClick={onRefreshBalance}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{currencySymbol} Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <CardDescription>Tips you've sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toFixed(4)}</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                {sentTips.length} transactions to {uniqueRecipients} recipients
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <CardDescription>Tips you've received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReceived.toFixed(4)}</div>
            <div className="flex items-center mt-1">
              <ArrowDownLeft className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                {receivedTips.length} transactions from {uniqueSenders} senders
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <CardDescription>Received - Sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalReceived - totalSent).toFixed(4)}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                {totalReceived > totalSent ? "Net positive" : "Net negative"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest tips sent and received</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      {tx.type === "sent" ? (
                        <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full mr-3">
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        </div>
                      ) : (
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-3">
                          <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {tx.type === "sent" ? "Sent to" : "Received from"}{" "}
                          {formatAddress(tx.type === "sent" ? tx.recipient : tx.sender)}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${tx.type === "sent" ? "text-red-500" : "text-green-500"}`}>
                        {tx.type === "sent" ? "-" : "+"}
                        {tx.amount} {currencySymbol}
                      </p>
                      {tx.message && (
                        <p className="text-xs text-muted-foreground max-w-[200px] truncate">"{tx.message}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your tipping activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Transaction Count</span>
                </div>
                <span className="font-medium">{transactions.length}</span>
              </div>
              <Progress value={(transactions.length / 100) * 100} max={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Unique Interactions</span>
                </div>
                <span className="font-medium">{uniqueRecipients + uniqueSenders}</span>
              </div>
              <Progress value={((uniqueRecipients + uniqueSenders) / 50) * 100} max={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
