"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"

interface QrCodeGeneratorProps {
  account: string
}

export default function QrCodeGenerator({ account }: QrCodeGeneratorProps) {
  const { toast } = useToast()

  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [qrSize, setQrSize] = useState(200)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Generate base QR code value
    const baseUrl = `${window.location.origin}/tip/${account}`

    // Add parameters if they exist
    const params = new URLSearchParams()
    if (amount) params.append("amount", amount)
    if (message) params.append("message", message)

    const paramsString = params.toString()
    const finalUrl = paramsString ? `${baseUrl}?${paramsString}` : baseUrl

    setQrValue(finalUrl)
  }, [account, amount, message])

  const copyLink = () => {
    navigator.clipboard.writeText(qrValue)

    toast({
      title: "Link Copied",
      description: "Your tipping link has been copied to clipboard",
    })
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    canvas.width = qrSize
    canvas.height = qrSize

    // Draw SVG on canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      // Download the canvas as PNG
      const pngUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = pngUrl
      link.download = "somnia-tipping-qr.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    img.src = url
  }

  const shareQR = async () => {
    if (!navigator.share) {
      toast({
        title: "Sharing not supported",
        description: "Web Share API is not supported in your browser",
      })
      return
    }

    try {
      await navigator.share({
        title: "Somnia Tipping QR Code",
        text: "Send me a tip on Somnia Network",
        url: qrValue,
      })
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create a custom tipping QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">Generate a simple QR code for your tipping address</p>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Suggested Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Pre-fill an amount for the sender</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Suggested Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="Thank you for your support!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Pre-fill a message for the sender</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="qrSize">QR Code Size</Label>
            <Input
              id="qrSize"
              type="range"
              min="100"
              max="300"
              step="10"
              value={qrSize}
              onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          <div className="pt-2">
            <Label htmlFor="tipLink">Tipping Link</Label>
            <div className="flex items-center mt-1.5">
              <Input id="tipLink" value={qrValue} readOnly className="font-mono text-xs" />
              <Button variant="ghost" size="icon" onClick={copyLink} className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>Scan to send a tip</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG id="qr-code" value={qrValue} size={qrSize} level="H" includeMargin={true} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={shareQR}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
