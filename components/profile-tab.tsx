"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { NETWORK_CONFIG } from "@/lib/contract"

export default function ProfileTab() {
  const { address, balance } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`${NETWORK_CONFIG.blockExplorerUrls[0]}/address/${address}`, "_blank")
    }
  }

  // Generate QR code data (simplified for demo)
  const qrCodeData = address ? `ethereum:${address}` : ""

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View and manage your wallet information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-purple-500/20 bg-card p-4 shadow-sm shadow-purple-500/5">
              <svg
                viewBox="0 0 200 200"
                width="100%"
                height="100%"
                className="h-full w-full"
                style={{
                  shapeRendering: "crispEdges",
                  background: "#1a1a1a",
                  padding: "10px",
                }}
              >
                {/* This is a simplified QR code representation */}
                <rect x="40" y="40" width="120" height="120" fill="none" stroke="#a855f7" strokeWidth="4" />
                <rect x="60" y="60" width="80" height="80" fill="none" stroke="#a855f7" strokeWidth="4" />
                <rect x="80" y="80" width="40" height="40" fill="#a855f7" />
                <rect x="50" y="50" width="10" height="10" fill="#a855f7" />
                <rect x="140" y="50" width="10" height="10" fill="#a855f7" />
                <rect x="50" y="140" width="10" height="10" fill="#a855f7" />
                <rect x="70" y="70" width="10" height="10" fill="#a855f7" />
                <rect x="120" y="70" width="10" height="10" fill="#a855f7" />
                <rect x="70" y="120" width="10" height="10" fill="#a855f7" />
                <rect x="130" y="130" width="10" height="10" fill="#a855f7" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Wallet Address</h3>
                <div className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-card p-3 shadow-sm shadow-purple-500/5">
                  <div className="overflow-hidden text-ellipsis text-sm">{address || "Not connected"}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto shrink-0"
                    onClick={copyAddress}
                    disabled={!address}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy address</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Network Information</h3>
                <div className="space-y-2 rounded-lg border border-purple-500/20 bg-card p-3 shadow-sm shadow-purple-500/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Network:</span>
                    <span>Somnia Testnet</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Chain ID:</span>
                    <span>50312</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span>STT</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Balance:</span>
                    <span>{balance ? Number(balance).toFixed(4) : "0.0000"} STT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                className="border-purple-500/20 bg-card shadow-sm shadow-purple-500/5"
                onClick={copyAddress}
                disabled={!address}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Address
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/20 bg-card shadow-sm shadow-purple-500/5"
                onClick={viewOnExplorer}
                disabled={!address}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
