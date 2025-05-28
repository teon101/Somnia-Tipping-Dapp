"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Header from "@/components/header"
import WalletConnect from "@/components/wallet-connect"
import Dashboard from "@/components/dashboard"
import SendTip from "@/components/send-tip"
import ProfileSection from "@/components/profile-section"
import TransactionHistory from "@/components/transaction-history"
import QrCodeGenerator from "@/components/qr-code-generator"
import { TippingContractABI } from "@/lib/contract-abi"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function TippingDapp() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [balance, setBalance] = useState("0")
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Contract address - replace with your deployed contract address
  const contractAddress = "0x0316C472909AB8b1cdcc07993e5EBa6D1d6f658f"

  // Somnia Testnet network configuration (updated to match the reference)
  const somniaNetworkId = 50312
  const somniaNetworkName = "Somnia Testnet"
  const somniaRpcUrl = "https://dream-rpc.somnia.network/"
  const somniaExplorerUrl = "https://shannon-explorer.somnia.network"
  const somniaCurrencySymbol = "STT"

  useEffect(() => {
    // Check if the user changes accounts
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount("")
          setSigner(null)
          setContract(null)
          setBalance("0")
        } else {
          // User switched accounts
          connectWallet()
        }
      }

      const handleChainChanged = () => {
        // When the network changes, refresh the page
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      setLoading(true)
      setError("")

      if (typeof window === "undefined" || !window.ethereum) {
        setError("No Ethereum wallet found. Please install MetaMask.")
        return
      }

      // Request account access
      await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // Get the provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      // Check if we're on the correct network
      setNetworkId(Number(network.chainId))
      setIsCorrectNetwork(Number(network.chainId) === somniaNetworkId)

      // Get the user's balance
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)

      // Initialize the contract
      const tippingContract = new ethers.Contract(contractAddress, TippingContractABI, signer)

      // Set all the state
      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setContract(tippingContract)
      setBalance(ethers.formatEther(balance))

      // Load transaction history
      if (contractAddress !== "0x0316C472909AB8b1cdcc07993e5EBa6D1d6f658f") {
        await loadTransactionHistory(tippingContract, address)
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const loadTransactionHistory = async (contract: ethers.Contract, address: string) => {
    try {
      // Get tips sent by the user
      const sentTips = await contract.getTipsSentByUser(address)

      // Get tips received by the user
      const receivedTips = await contract.getTipsReceivedByUser(address)

      // Format and combine the transactions
      const formattedSent = sentTips.map((tip: any) => ({
        sender: tip.sender,
        recipient: tip.recipient,
        amount: ethers.formatEther(tip.amount),
        message: tip.message,
        timestamp: new Date(Number(tip.timestamp) * 1000),
        type: "sent",
      }))

      const formattedReceived = receivedTips.map((tip: any) => ({
        sender: tip.sender,
        recipient: tip.recipient,
        amount: ethers.formatEther(tip.amount),
        message: tip.message,
        timestamp: new Date(Number(tip.timestamp) * 1000),
        type: "received",
      }))

      // Combine and sort by timestamp (newest first)
      const allTransactions = [...formattedSent, ...formattedReceived].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      )

      setTransactions(allTransactions)
    } catch (err) {
      console.error("Error loading transaction history:", err)
    }
  }

  const switchNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${somniaNetworkId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${somniaNetworkId.toString(16)}`,
                chainName: somniaNetworkName,
                nativeCurrency: {
                  name: "Somnia Testnet Token",
                  symbol: somniaCurrencySymbol,
                  decimals: 18,
                },
                rpcUrls: [somniaRpcUrl],
                blockExplorerUrls: [somniaExplorerUrl],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
        }
      }
    }
  }

  const refreshBalance = async () => {
    if (provider && account) {
      const balance = await provider.getBalance(account)
      setBalance(ethers.formatEther(balance))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        account={account}
        balance={balance}
        isCorrectNetwork={isCorrectNetwork}
        networkName={somniaNetworkName}
        onSwitchNetwork={switchNetwork}
        onRefreshBalance={refreshBalance}
        currencySymbol={somniaCurrencySymbol}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!account ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome to Somnia Tipping</h2>
                <p className="text-center text-muted-foreground mb-6">
                  Connect your wallet to start sending and receiving tips on the Somnia Testnet
                </p>
                <WalletConnect onConnect={connectWallet} isLoading={loading} currencySymbol={somniaCurrencySymbol} />

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="send">Send Tip</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard
                account={account}
                balance={balance}
                transactions={transactions}
                onRefreshBalance={refreshBalance}
                currencySymbol={somniaCurrencySymbol}
              />
            </TabsContent>

            <TabsContent value="send">
              <SendTip
                contract={contract}
                account={account}
                provider={provider}
                signer={signer}
                onSuccess={() => {
                  refreshBalance()
                  if (contract) loadTransactionHistory(contract, account)
                }}
                currencySymbol={somniaCurrencySymbol}
              />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileSection contract={contract} account={account} />
            </TabsContent>

            <TabsContent value="history">
              <TransactionHistory
                transactions={transactions}
                account={account}
                currencySymbol={somniaCurrencySymbol}
                explorerUrl={somniaExplorerUrl}
              />
            </TabsContent>

            <TabsContent value="qrcode">
              <QrCodeGenerator account={account} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
