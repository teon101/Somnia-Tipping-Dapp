"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, CheckCircle2, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SendTipProps {
  contract: ethers.Contract | null
  account: string
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  onSuccess: () => void
  currencySymbol: string
}

export default function SendTip({ contract, account, provider, signer, onSuccess, currencySymbol }: SendTipProps) {
  const { toast } = useToast()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [gasEstimate, setGasEstimate] = useState("")

  const resetForm = () => {
    setRecipient("")
    setAmount("")
    setMessage("")
    setError("")
    setSuccess("")
    setGasEstimate("")
  }

  const validateForm = () => {
    if (!recipient) {
      setError("Please enter a recipient address")
      return false
    }

    if (!ethers.isAddress(recipient)) {
      setError("Please enter a valid Ethereum address")
      return false
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return false
    }

    return true
  }

  const estimateGas = async () => {
    if (!validateForm() || !provider) return

    try {
      setLoading(true)
      setError("")

      // Estimate gas for the transaction
      const amountInWei = ethers.parseEther(amount)

      // For native token transfer
      const feeData = await provider.getFeeData()
      const gasLimit = await provider.estimateGas({
        to: recipient,
        value: amountInWei,
      })

      const gasCost = feeData.gasPrice ? feeData.gasPrice * gasLimit : 0n
      setGasEstimate(ethers.formatEther(gasCost))
    } catch (err) {
      console.error("Error estimating gas:", err)
      setError(err instanceof Error ? err.message : "Failed to estimate gas")
    } finally {
      setLoading(false)
    }
  }

  const sendTip = async () => {
    if (!validateForm() || !provider || !signer) return

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const amountInWei = ethers.parseEther(amount)

      // Check if user has enough balance
      const balance = await provider.getBalance(account)

      if (balance < amountInWei) {
        setError("Insufficient balance")
        return
      }

      let tx

      // If contract is not initialized, send a direct transfer
      if (!contract) {
        tx = await signer.sendTransaction({
          to: recipient,
          value: amountInWei,
        })
      } else {
        // Send the tip using the contract
        tx = await contract.sendTip(recipient, message, {
          value: amountInWei,
        })
      }

      // Wait for the transaction to be mined
      await tx.wait()

      // Show success message
      const shortRecipient = `${recipient.substring(0, 6)}...${recipient.substring(38)}`
      setSuccess(`Successfully sent ${amount} ${currencySymbol} to ${shortRecipient}`)

      // Show toast notification
      toast({
        title: "Tip Sent Successfully",
        description: `You sent ${amount} ${currencySymbol} to ${shortRecipient}`,
      })

      // Call the onSuccess callback to refresh data
      onSuccess()

      // Reset form after successful transaction
      resetForm()
    } catch (err) {
      console.error("Error sending tip:", err)
      setError(err instanceof Error ? err.message : "Failed to send tip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Send a Tip</CardTitle>
        <CardDescription>Send {currencySymbol} tokens to any address on the network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="native">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="native">Native {currencySymbol}</TabsTrigger>
            <TabsTrigger value="token" disabled>
              ERC20 Tokens (Coming Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="native" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({currencySymbol})</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message to your tip..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </div>

            {gasEstimate && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  Estimated Gas Fee: {Number.parseFloat(gasEstimate).toFixed(8)} {currencySymbol}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {(Number.parseFloat(amount) + Number.parseFloat(gasEstimate)).toFixed(8)} {currencySymbol}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={estimateGas}
          disabled={loading || !recipient || !amount}
          className="w-full sm:w-auto"
        >
          Estimate Gas
        </Button>
        <Button onClick={sendTip} disabled={loading || !recipient || !amount} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Tip
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
