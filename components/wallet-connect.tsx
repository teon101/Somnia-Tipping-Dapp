"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
  isLoading: boolean
  currencySymbol: string
}

export default function WalletConnect({ onConnect, isLoading, currencySymbol }: WalletConnectProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <p className="text-center text-muted-foreground mb-2">
          To use this DApp, you need to connect your Ethereum wallet.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Make sure you have MetaMask or another compatible wallet installed.
        </p>
      </div>

      <Button size="lg" onClick={onConnect} disabled={isLoading} className="w-full mb-8">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </>
        )}
      </Button>

      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Manual Network Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          If automatic connection fails, add these details to your wallet manually:
        </p>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Network Name:</span>
            <span className="text-sm font-medium">Somnia Testnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">RPC URL:</span>
            <span className="text-sm font-medium font-mono">https://dream-rpc.somnia.network/</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Chain ID:</span>
            <span className="text-sm font-medium">50312 (0xC498 in hex)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Currency Symbol:</span>
            <span className="text-sm font-medium">{currencySymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Block Explorer:</span>
            <span className="text-sm font-medium">https://shannon-explorer.somnia.network</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm">
            Add Somnia Testnet automatically ↗
          </Button>
        </div>
      </div>
    </div>
  )
}
