"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, LogOut, ExternalLink, Copy, AlertTriangle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { formatAddress, NETWORK_CONFIG } from "@/lib/contract"

export default function WalletConnect() {
  const {
    address,
    balance,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWallet()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`${NETWORK_CONFIG.blockExplorerUrls[0]}/address/${address}`, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <Button
        className="bg-purple-600 text-white hover:bg-purple-700 relative overflow-hidden group"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        <span className="relative z-10 flex items-center">
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 translate-x-[-100%] group-hover:animate-shimmer"></div>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {!isCorrectNetwork && (
        <Button
          variant="outline"
          size="sm"
          className="border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          onClick={switchNetwork}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Switch to Somnia
        </Button>
      )}

      <div className="hidden items-center gap-2 rounded-lg border border-purple-500/20 bg-card px-3 py-1.5 text-sm text-card-foreground shadow-sm shadow-purple-500/10 md:flex">
        <span className="text-muted-foreground">Balance:</span>
        <span className="font-medium">{balance ? Number(balance).toFixed(4) : "0.0000"} STT</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-purple-500/20 bg-card shadow-sm shadow-purple-500/10">
            <div className={`mr-2 h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-amber-500"}`}></div>
            <span>{address ? formatAddress(address) : "0x0000...0000"}</span>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View on Explorer</span>
          </DropdownMenuItem>
          {!isCorrectNetwork && (
            <DropdownMenuItem onClick={switchNetwork}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Switch to Somnia</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
