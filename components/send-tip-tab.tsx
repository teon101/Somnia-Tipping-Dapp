"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SendTipTab() {
  const { sendTip, estimateGas, isCorrectNetwork, switchNetwork } = useWallet()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [gasEstimate, setGasEstimate] = useState("0.0001")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Calculate total including gas
  const total = (Number.parseFloat(amount || "0") + Number.parseFloat(gasEstimate)).toFixed(4)

  // Update gas estimate when inputs change
  useEffect(() => {
    const updateGasEstimate = async () => {
      if (recipient && amount && Number.parseFloat(amount) > 0) {
        try {
          const estimate = await estimateGas(recipient, amount, message)
          setGasEstimate(estimate)
        } catch (error) {
          console.error("Error estimating gas:", error)
          setGasEstimate("0.0001") // Fallback
        }
      }
    }

    updateGasEstimate()
  }, [recipient, amount, message, estimateGas])

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Check if we're on the correct network
      if (!isCorrectNetwork) {
        throw new Error("You are not connected to Somnia Testnet. Please switch networks in your wallet and try again.")
      }

      // Validate inputs
      if (!recipient.startsWith("0x") || recipient.length !== 42) {
        throw new Error("Invalid recipient address")
      }

      if (Number.parseFloat(amount) <= 0) {
        throw new Error("Amount must be greater than 0")
      }

      // Send the tip
      const txHash = await sendTip(recipient, amount, message)

      // Show success message
      setSuccess(
        `Tip sent successfully! Transaction hash: ${txHash.slice(0, 10)}... Check the History tab to see your transaction.`,
      )

      // Reset form
      setRecipient("")
      setAmount("")
      setMessage("")
    } catch (error: any) {
      console.error("Error sending tip:", error)
      setError(error.message || "Failed to send tip. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-purple-500/20 shadow-sm shadow-purple-500/10">
        <CardHeader>
          <CardTitle>Send Tip</CardTitle>
          <CardDescription>Send STT tokens to another wallet on the Somnia Testnet</CardDescription>
        </CardHeader>
        <form onSubmit={handleSendTip}>
          <CardContent className="space-y-6">
            {!isCorrectNetwork && (
              <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Wrong Network</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>
                    You are not connected to Somnia Testnet (Chain ID: 50312). Please switch networks to send tips.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    onClick={switchNetwork}
                  >
                    Switch to Somnia Testnet
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="border-purple-500/20 bg-card shadow-sm shadow-purple-500/5 focus-visible:ring-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (STT)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                min="0.0001"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border-purple-500/20 bg-card shadow-sm shadow-purple-500/5 focus-visible:ring-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message to your tip..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] resize-none border-purple-500/20 bg-card shadow-sm shadow-purple-500/5 focus-visible:ring-purple-500/50"
              />
            </div>

            <div className="rounded-lg border border-purple-500/20 bg-muted/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Gas Fee:</span>
                <span>{gasEstimate} STT</span>
              </div>
              <div className="mt-2 flex items-center justify-between font-medium">
                <span>Total:</span>
                <span>{total} STT</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700 relative overflow-hidden group"
              disabled={loading || !recipient || !amount || !isCorrectNetwork}
            >
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Tip"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 translate-x-[-100%] group-hover:animate-shimmer"></div>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
