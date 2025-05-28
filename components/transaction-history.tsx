"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Search } from "lucide-react"
import { formatAddress } from "@/lib/utils"

interface TransactionHistoryProps {
  transactions: any[]
  account: string
  currencySymbol: string
  explorerUrl: string
}

export default function TransactionHistory({
  transactions,
  account,
  currencySymbol,
  explorerUrl,
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const sentTips = transactions.filter((tx) => tx.type === "sent")
  const receivedTips = transactions.filter((tx) => tx.type === "received")

  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = searchTerm.toLowerCase()
    const recipientOrSender = tx.type === "sent" ? tx.recipient : tx.sender

    return (
      recipientOrSender.toLowerCase().includes(searchLower) ||
      tx.amount.toString().includes(searchTerm) ||
      (tx.message && tx.message.toLowerCase().includes(searchLower))
    )
  })

  const openExplorer = (txHash: string) => {
    window.open(`${explorerUrl}/tx/${txHash}`, "_blank")
  }

  const renderTransactionList = (txList: any[]) => {
    if (txList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {txList.map((tx, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
            onClick={() => tx.txHash && openExplorer(tx.txHash)}
          >
            <div className="flex items-center space-x-3">
              {tx.type === "sent" ? (
                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                </div>
              ) : (
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
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
              {tx.message && <p className="text-xs text-muted-foreground max-w-[200px] truncate">"{tx.message}"</p>}
              {tx.txHash && (
                <p className="text-xs text-primary flex items-center justify-end mt-1">
                  View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View your tipping history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search transactions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentTips.length})</TabsTrigger>
            <TabsTrigger value="received">Received ({receivedTips.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderTransactionList(filteredTransactions)}</TabsContent>

          <TabsContent value="sent">
            {renderTransactionList(
              sentTips.filter((tx) => {
                if (!searchTerm) return true

                const searchLower = searchTerm.toLowerCase()
                return (
                  tx.recipient.toLowerCase().includes(searchLower) ||
                  tx.amount.toString().includes(searchTerm) ||
                  (tx.message && tx.message.toLowerCase().includes(searchLower))
                )
              }),
            )}
          </TabsContent>

          <TabsContent value="received">
            {renderTransactionList(
              receivedTips.filter((tx) => {
                if (!searchTerm) return true

                const searchLower = searchTerm.toLowerCase()
                return (
                  tx.sender.toLowerCase().includes(searchLower) ||
                  tx.amount.toString().includes(searchTerm) ||
                  (tx.message && tx.message.toLowerCase().includes(searchLower))
                )
              }),
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
