import { ethers } from "ethers"

// Contract ABI - only the functions and events we need
export const TIP_JAR_ABI = [
  "function sendTip(address payable to, string calldata message) external payable",
  "event Tipped(address indexed from, address indexed to, uint256 amount, string message, uint256 timestamp)",
]

// Contract address
export const TIP_JAR_ADDRESS = "0xE43727723D53085a249c74a9B15bEc50920bBFfF"

// Network configuration
export const NETWORK_CONFIG = {
  chainId: "0xC488", // 50312 in hex
  chainName: "Somnia Testnet",
  nativeCurrency: {
    name: "Somnia Test Token",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: ["https://dream-rpc.somnia.network"],
  blockExplorerUrls: ["https://shannon-explorer.somnia.network"],
}

// Helper function to format addresses
export function formatAddress(address: string | null): string {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper function to format amounts from wei to STT
export function formatAmount(amount: ethers.BigNumberish): string {
  return ethers.utils.formatEther(amount)
}

// Helper function to parse STT to wei
export function parseAmount(amount: string): ethers.BigNumber {
  return ethers.utils.parseEther(amount)
}

// Interface for transaction data
export interface Transaction {
  id: string
  type: "sent" | "received"
  amount: string
  timestamp: number
  from: string
  to: string
  message: string
  hash: string
}

// Helper to create a Transaction object from event data
export function createTransactionFromEvent(event: ethers.Event, currentAddress: string): Transaction {
  const from = event.args?.from
  const to = event.args?.to
  const amount = formatAmount(event.args?.amount)
  const message = event.args?.message || ""
  const timestamp = Number(event.args?.timestamp)

  return {
    id: `${event.transactionHash}-${event.logIndex}`,
    type: from.toLowerCase() === currentAddress.toLowerCase() ? "sent" : "received",
    amount,
    timestamp,
    from, // Store the full address
    to, // Store the full address
    message,
    hash: event.transactionHash,
  }
}

// Function to check if the wallet is connected to the correct network
export async function checkCorrectNetwork(provider: ethers.providers.Web3Provider): Promise<boolean> {
  try {
    const network = await provider.getNetwork()
    return network.chainId === Number.parseInt(NETWORK_CONFIG.chainId, 16)
  } catch (error) {
    console.error("Error checking network:", error)
    return false
  }
}

// Function to switch to the correct network (only if needed)
export async function switchToCorrectNetwork(provider: any): Promise<boolean> {
  try {
    // First check if we're already on the correct network
    const ethersProvider = new ethers.providers.Web3Provider(provider)
    const isCorrectNetwork = await checkCorrectNetwork(ethersProvider)

    // If already on the correct network, return true without trying to switch
    if (isCorrectNetwork) {
      return true
    }

    // If not on the correct network, try to switch
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    })
    return true
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_CONFIG],
        })
        return true
      } catch (addError) {
        console.error("Failed to add network", addError)
        return false
      }
    }

    console.error("Failed to switch network", switchError)
    return false
  }
}
