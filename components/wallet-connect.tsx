"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WalletConnectProps {
  onConnect: () => void
  isLoading: boolean
}

export default function WalletConnect({ onConnect, isLoading }: WalletConnectProps) {
  return (
    <div className="flex flex-col items-center">
      <Button size="lg" onClick={onConnect} disabled={isLoading} className="w-full">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Send Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Send SOMNIA tokens to anyone on the network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Create Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Set up your tipping profile and username</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Track History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">View all your sent and received tips</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
