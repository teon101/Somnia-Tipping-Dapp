"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface TransactionConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  transactionDetails: {
    recipient: string
    amount: string
    message?: string
    estimatedGas?: string
  }
  currencySymbol: string
}

export default function TransactionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transactionDetails,
  currencySymbol,
}: TransactionConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"confirm" | "processing" | "waiting" | "success">("confirm")

  const handleConfirm = async () => {
    try {
      setIsProcessing(true)
      setError("")
      setStep("processing")

      // Show user that we're preparing the transaction
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep("waiting")

      await onConfirm()
      setStep("success")

      // Auto close after success
      setTimeout(() => {
        onClose()
        setStep("confirm")
        setIsProcessing(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
      setStep("confirm")
      setIsProcessing(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "confirm" && "Confirm Transaction"}
            {step === "processing" && "Preparing Transaction"}
            {step === "waiting" && "Waiting for Confirmation"}
            {step === "success" && "Transaction Successful"}
          </DialogTitle>
          <DialogDescription>
            {step === "confirm" && "Please review the transaction details below"}
            {step === "processing" && "Preparing your transaction..."}
            {step === "waiting" && "Please confirm the transaction in MetaMask"}
            {step === "success" && "Your tip has been sent successfully!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "confirm" && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="text-sm font-mono">{formatAddress(transactionDetails.recipient)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium">
                    {transactionDetails.amount} {currencySymbol}
                  </span>
                </div>
                {transactionDetails.message && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Message:</span>
                    <span className="text-sm max-w-[200px] truncate">"{transactionDetails.message}"</span>
                  </div>
                )}
                {transactionDetails.estimatedGas && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. Gas:</span>
                    <span className="text-sm">
                      {transactionDetails.estimatedGas} {currencySymbol}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Preparing transaction...</p>
            </div>
          )}

          {step === "waiting" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                MetaMask should open automatically. If it doesn't, please open MetaMask manually to confirm the
                transaction.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-center text-muted-foreground">Your tip has been sent successfully!</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "confirm" && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isProcessing}>
                Confirm & Send
              </Button>
            </>
          )}
          {(step === "processing" || step === "waiting") && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
