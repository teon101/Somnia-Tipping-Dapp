"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatAddress } from "@/lib/utils"

interface HeaderProps {
  account: string
  balance: string
  isCorrectNetwork: boolean
  networkName: string
  onSwitchNetwork: () => void
  onRefreshBalance: () => void
  currencySymbol: string
}

export default function Header({
  account,
  balance,
  isCorrectNetwork,
  networkName,
  onSwitchNetwork,
  onRefreshBalance,
  currencySymbol,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2">Somnia Tipping</h1>
          <Badge variant="secondary" className="text-xs">
            Testnet
          </Badge>
          {!isCorrectNetwork && account && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1 ml-2"
                    onClick={onSwitchNetwork}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Wrong Network</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to switch to {networkName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {account && (
            <>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <div className="flex items-center">
                  <span className="font-medium">{Number.parseFloat(balance).toFixed(4)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{currencySymbol}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={onRefreshBalance}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {formatAddress(account)}
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
