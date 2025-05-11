import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import type { Transaction } from "@/lib/contract"
import { formatAddress, NETWORK_CONFIG } from "@/lib/contract"

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  // Format time to show "Just now", "X mins ago", etc.
  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000)
    const diffInSeconds = now - timestamp

    if (diffInSeconds < 5) {
      return "Just now"
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    }
  }

  const formattedTime = formatTimeAgo(transaction.timestamp)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-purple-500/20 bg-card p-4 shadow-sm shadow-purple-500/5 transition-all hover:shadow-purple-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              transaction.type === "sent" ? "bg-destructive/10" : "bg-green-500/10"
            }`}
          >
            {transaction.type === "sent" ? (
              <ArrowUp className="h-4 w-4 text-destructive" />
            ) : (
              <ArrowDown className="h-4 w-4 text-green-500" />
            )}
          </div>
          <div>
            <div className="font-medium">
              {transaction.type === "sent" ? "Sent" : "Received"} {transaction.amount} STT
            </div>
            <div className="text-xs text-muted-foreground">{formattedTime}</div>
          </div>
        </div>
        <a
          href={`${NETWORK_CONFIG.blockExplorerUrls[0]}/tx/${transaction.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">View on Explorer</span>
        </a>
      </div>

      <div className="grid gap-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">From:</span>
          <span>{formatAddress(transaction.from)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">To:</span>
          <span>{formatAddress(transaction.to)}</span>
        </div>
      </div>

      {transaction.message && (
        <div className="mt-2 rounded-md bg-muted p-2 text-sm">
          <p className="line-clamp-2">{transaction.message}</p>
        </div>
      )}
    </div>
  )
}
