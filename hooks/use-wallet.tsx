"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { ethers } from "ethers"
import {
  TIP_JAR_ABI,
  TIP_JAR_ADDRESS,
  checkCorrectNetwork,
  switchToCorrectNetwork,
  type Transaction,
  createTransactionFromEvent,
} from "@/lib/contract"
import { formatAddress } from "@/lib/utils"

interface WalletContextType {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  contract: ethers.Contract | null
  address: string | null
  balance: string | null
  isConnecting: boolean
  isConnected: boolean
  isCorrectNetwork: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: () => Promise<void>
  sendTip: (to: string, amount: string, message: string) => Promise<string>
  estimateGas: (to: string, amount: string, message: string) => Promise<string>
  transactions: Transaction[]
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Function to check if we're on the correct network and update state
  const updateNetworkStatus = async (provider: ethers.providers.Web3Provider) => {
    const onCorrectNetwork = await checkCorrectNetwork(provider)
    setIsCorrectNetwork(onCorrectNetwork)
    return onCorrectNetwork
  }

  // Function to switch to the correct network
  const switchNetwork = async () => {
    if (!window.ethereum) return false

    try {
      const success = await switchToCorrectNetwork(window.ethereum)
      if (success && provider) {
        // Update network status after switching
        await updateNetworkStatus(provider)
      }
      return success
    } catch (error) {
      console.error("Error switching network:", error)
      return false
    }
  }

  // Function to connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create ethers provider
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(ethersProvider)

      // Check if we're on the correct network
      const onCorrectNetwork = await updateNetworkStatus(ethersProvider)

      // Get signer
      const ethersSigner = ethersProvider.getSigner()
      setSigner(ethersSigner)

      // Get address
      const address = await ethersSigner.getAddress()
      setAddress(address)

      // Create contract instance
      const tipJarContract = new ethers.Contract(TIP_JAR_ADDRESS, TIP_JAR_ABI, ethersSigner)
      setContract(tipJarContract)

      // Get balance
      const balance = await ethersProvider.getBalance(address)
      setBalance(ethers.utils.formatEther(balance))

      setIsConnected(true)

      // Start listening for events
      setupEventListeners(tipJarContract, ethersProvider, address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAddress(null)
    setBalance(null)
    setIsConnected(false)
    setIsCorrectNetwork(false)
    setTransactions([])
  }

  // Function to send a tip
  const sendTip = async (to: string, amount: string, message: string): Promise<string> => {
    if (!contract || !signer || !provider) {
      throw new Error("Wallet not connected")
    }

    try {
      // Check if we're on the correct network
      const onCorrectNetwork = await updateNetworkStatus(provider)
      if (!onCorrectNetwork) {
        throw new Error("You are not connected to Somnia Testnet. Please switch networks in your wallet and try again.")
      }

      const tx = await contract.sendTip(to, message, {
        value: ethers.utils.parseEther(amount),
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Update balance after sending tip
      if (provider && address) {
        const newBalance = await provider.getBalance(address)
        setBalance(ethers.utils.formatEther(newBalance))
      }

      // Manually add the transaction to our state
      if (address) {
        const timestamp = Math.floor(Date.now() / 1000)
        const newTransaction: Transaction = {
          id: `${tx.hash}-0`,
          type: "sent",
          amount: amount,
          timestamp: timestamp,
          from: formatAddress(address),
          to: formatAddress(to),
          message: message,
          hash: tx.hash,
        }

        // Add to transactions state
        setTransactions((prev) => [newTransaction, ...prev])
      }

      return tx.hash
    } catch (error) {
      console.error("Error sending tip:", error)
      throw error
    }
  }

  // Function to estimate gas for sending a tip
  const estimateGas = async (to: string, amount: string, message: string): Promise<string> => {
    if (!contract || !signer || !provider) {
      throw new Error("Wallet not connected")
    }

    try {
      // Check if we're on the correct network
      const onCorrectNetwork = await updateNetworkStatus(provider)
      if (!onCorrectNetwork) {
        return "0.0001" // Fallback estimate if not on correct network
      }

      // Estimate gas for the transaction
      const gasEstimate = await contract.estimateGas.sendTip(to, message, {
        value: ethers.utils.parseEther(amount),
      })

      // Get current gas price
      const gasPrice = await provider.getGasPrice()

      // Calculate total gas cost
      const gasCost = gasEstimate.mul(gasPrice)

      // Return gas cost in STT
      return ethers.utils.formatEther(gasCost)
    } catch (error) {
      console.error("Error estimating gas:", error)
      return "0.0001" // Fallback estimate
    }
  }

  // Setup event listeners for the contract
  const setupEventListeners = (
    contract: ethers.Contract,
    provider: ethers.providers.Web3Provider,
    userAddress: string,
  ) => {
    // Listen for Tipped events
    const filter = contract.filters.Tipped()

    // Listen for new events
    contract.on(filter, (from, to, amount, message, timestamp, event) => {
      // Only add transactions that involve the current user
      if (from.toLowerCase() === userAddress.toLowerCase() || to.toLowerCase() === userAddress.toLowerCase()) {
        const newTx = createTransactionFromEvent(event, userAddress)

        // Check if this transaction is already in our state to avoid duplicates
        setTransactions((prev) => {
          const exists = prev.some((tx) => tx.hash === newTx.hash)
          if (exists) return prev
          return [newTx, ...prev]
        })
      }
    })

    // Query past events (last 100 blocks)
    const queryPastEvents = async () => {
      try {
        const currentBlock = await provider.getBlockNumber()
        const startBlock = Math.max(0, currentBlock - 100) // Last 100 blocks

        const events = await contract.queryFilter(filter, startBlock)

        // Filter events involving the current user
        const userEvents = events.filter((event) => {
          const from = event.args?.from
          const to = event.args?.to
          return from.toLowerCase() === userAddress.toLowerCase() || to.toLowerCase() === userAddress.toLowerCase()
        })

        // Convert events to transactions
        const userTransactions = userEvents.map((event) => createTransactionFromEvent(event, userAddress))

        // Sort by timestamp (newest first)
        userTransactions.sort((a, b) => b.timestamp - a.timestamp)

        setTransactions(userTransactions)
      } catch (error) {
        console.error("Error querying past events:", error)
      }
    }

    queryPastEvents()

    // Clean up event listener on unmount
    return () => {
      contract.removeAllListeners(filter)
    }
  }

  // Update balance periodically
  useEffect(() => {
    if (!provider || !address) return

    const updateBalance = async () => {
      try {
        const balance = await provider.getBalance(address)
        setBalance(ethers.utils.formatEther(balance))
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }

    // Update balance every 15 seconds
    const interval = setInterval(updateBalance, 15000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [provider, address])

  // Update network status periodically
  useEffect(() => {
    if (!provider) return

    const checkNetwork = async () => {
      await updateNetworkStatus(provider)
    }

    // Check network status every 30 seconds
    const interval = setInterval(checkNetwork, 30000)

    // Initial check
    checkNetwork()

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [provider])

  // Handle account changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet()
      } else if (isConnected) {
        // User switched accounts, reconnect
        connectWallet()
      }
    }

    const handleChainChanged = () => {
      // Chain changed, reload the page
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Clean up event listeners on unmount
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [isConnected])

  const value = {
    provider,
    signer,
    contract,
    address,
    balance,
    isConnecting,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    sendTip,
    estimateGas,
    transactions,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
