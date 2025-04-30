"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function NetworkStatus() {
  const [network, setNetwork] = useState<string | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          setLoading(true)
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const network = await provider.getNetwork()

          // Set network name
          setNetwork(network.name)

          // Check if on Somnia network
          // Note: You would need to replace this with the actual chainId for Somnia
          // This is just a placeholder - assuming Somnia might have a specific chainId
          const somniaChainId = 1234 // Replace with actual Somnia chainId
          setIsCorrectNetwork(network.chainId === somniaChainId)
        } catch (error) {
          console.error("Error checking network:", error)
          setNetwork("Unknown")
          setIsCorrectNetwork(false)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setNetwork("Not connected")
        setIsCorrectNetwork(false)
      }
    }

    checkNetwork()

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        checkNetwork()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", checkNetwork)
      }
    }
  }, [])

  const switchToSomnia = async () => {
    if (!window.ethereum) return

    try {
      // Request switch to Somnia network
      // Replace these values with the actual Somnia network parameters
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x4D2", // Replace with actual Somnia chainId in hex
            chainName: "Somnia Network",
            nativeCurrency: {
              name: "SOMNIA",
              symbol: "SOM",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.somnia.network"], // Replace with actual RPC URL
            blockExplorerUrls: ["https://explorer.somnia.network"], // Replace with actual explorer URL
          },
        ],
      })
    } catch (error) {
      console.error("Error switching network:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm">Checking network...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Current Network:</span>
        <Badge variant={isCorrectNetwork ? "default" : "destructive"}>{network || "Unknown"}</Badge>
      </div>

      {!isCorrectNetwork && (
        <button onClick={switchToSomnia} className="text-xs text-primary hover:underline w-full text-center mt-2">
          Switch to Somnia Network
        </button>
      )}
    </div>
  )
}
