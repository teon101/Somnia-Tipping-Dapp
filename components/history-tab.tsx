"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import TransactionItem from "@/components/transaction-item"
import { useWallet } from "@/hooks/use-wallet"

export default function HistoryTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const { transactions } = useWallet()

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      tx.from.toLowerCase().includes(query) ||
      tx.to.toLowerCase().includes(query) ||
      tx.message.toLowerCase().includes(query)
    )
  })

  return (
    <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Current session activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-purple-500/20 bg-card px-3 py-2 shadow-sm shadow-purple-500/5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="sent" className="mt-4 space-y-4">
            {filteredTransactions.filter((tx) => tx.type === "sent").length > 0 ? (
              filteredTransactions
                .filter((tx) => tx.type === "sent")
                .map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-muted-foreground">No sent transactions found</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="received" className="mt-4 space-y-4">
            {filteredTransactions.filter((tx) => tx.type === "received").length > 0 ? (
              filteredTransactions
                .filter((tx) => tx.type === "received")
                .map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-muted-foreground">No received transactions found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
