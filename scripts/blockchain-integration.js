// GreenScore Blockchain Integration
// Handles GreenToken minting and wallet interactions

const Web3 = require("web3")
const { ethers } = require("ethers")

// GreenToken Smart Contract ABI (simplified)
const GREEN_TOKEN_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

class BlockchainManager {
  constructor() {
    // Polygon Mumbai Testnet configuration
    this.networkConfig = {
      chainId: 80001,
      name: "Polygon Mumbai",
      rpcUrl: "https://rpc-mumbai.maticvigil.com/",
      blockExplorer: "https://mumbai.polygonscan.com/",
    }

    // Contract addresses (deploy your own contracts)
    this.contracts = {
      greenToken: "0x742d35Cc6634C0532925a3b8D404d3aABe09e444", // Example address
    }

    this.web3 = new Web3(this.networkConfig.rpcUrl)
    this.provider = new ethers.JsonRpcProvider(this.networkConfig.rpcUrl)
  }

  async connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Switch to Polygon Mumbai if needed
        await this.switchToPolygonMumbai()

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()

        return {
          success: true,
          address,
          network: this.networkConfig.name,
        }
      } catch (error) {
        console.error("Wallet connection failed:", error)
        return {
          success: false,
          error: error.message,
        }
      }
    } else {
      return {
        success: false,
        error: "MetaMask not installed",
      }
    }
  }

  async switchToPolygonMumbai() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }], // 80001 in hex
      })
    } catch (switchError) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Polygon Mumbai Testnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: [this.networkConfig.rpcUrl],
              blockExplorerUrls: [this.networkConfig.blockExplorer],
            },
          ],
        })
      }
    }
  }

  async getTokenBalance(walletAddress) {
    try {
      const contract = new ethers.Contract(this.contracts.greenToken, GREEN_TOKEN_ABI, this.provider)

      const balance = await contract.balanceOf(walletAddress)
      return {
        success: true,
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
      }
    } catch (error) {
      console.error("Error fetching token balance:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async mintTokens(recipientAddress, amount, reason) {
    try {
      // In production, this would be called from a secure backend
      // with proper authorization and validation

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(this.contracts.greenToken, GREEN_TOKEN_ABI, signer)

      const amountWei = ethers.parseEther(amount.toString())
      const tx = await contract.mint(recipientAddress, amountWei)

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        amount,
        recipient: recipientAddress,
        reason,
      }
    } catch (error) {
      console.error("Token minting failed:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async getTransactionHistory(walletAddress) {
    try {
      // Get recent transactions for the wallet
      // This is a simplified version - in production you'd use The Graph or similar
      const latestBlock = await this.provider.getBlockNumber()
      const fromBlock = Math.max(0, latestBlock - 10000) // Last ~10k blocks

      const contract = new ethers.Contract(this.contracts.greenToken, GREEN_TOKEN_ABI, this.provider)

      // Get Transfer events
      const filter = contract.filters.Transfer(null, walletAddress)
      const events = await contract.queryFilter(filter, fromBlock, latestBlock)

      const transactions = await Promise.all(
        events.map(async (event) => {
          const block = await this.provider.getBlock(event.blockNumber)
          return {
            hash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: new Date(block.timestamp * 1000).toISOString(),
            amount: ethers.formatEther(event.args.value),
            from: event.args.from,
            to: event.args.to,
            type: "received",
          }
        }),
      )

      return {
        success: true,
        transactions: transactions.slice(-20), // Last 20 transactions
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async validateEcoAction(actionType, actionData) {
    // Validate that an eco-action was actually completed
    // This would integrate with IoT devices, smart meters, etc.

    const validActions = {
      tip_completed: { tokens: 5, validation: "user_confirmation" },
      bill_uploaded: { tokens: 5, validation: "file_processed" },
      appliance_optimized: { tokens: 10, validation: "usage_reduced" },
      challenge_completed: { tokens: 25, validation: "goal_achieved" },
      referral_successful: { tokens: 15, validation: "new_user_verified" },
    }

    if (!validActions[actionType]) {
      return {
        success: false,
        error: "Invalid action type",
      }
    }

    const action = validActions[actionType]

    // Simulate validation logic
    const isValid = await this.performActionValidation(actionType, actionData)

    if (isValid) {
      return {
        success: true,
        tokensToAward: action.tokens,
        validationType: action.validation,
      }
    } else {
      return {
        success: false,
        error: "Action validation failed",
      }
    }
  }

  async performActionValidation(actionType, actionData) {
    // Simulate different validation methods
    switch (actionType) {
      case "tip_completed":
        // Validate user marked tip as complete
        return actionData.tipId && actionData.userConfirmation

      case "bill_uploaded":
        // Validate bill was successfully processed
        return actionData.fileProcessed && actionData.dataExtracted

      case "appliance_optimized":
        // Validate actual usage reduction
        return actionData.usageReduction > 0

      case "challenge_completed":
        // Validate challenge goals were met
        return actionData.goalAchieved && actionData.verificationData

      default:
        return false
    }
  }

  // Utility functions
  formatTokenAmount(amount) {
    return Number.parseFloat(amount).toFixed(2)
  }

  getExplorerUrl(txHash) {
    return `${this.networkConfig.blockExplorer}/tx/${txHash}`
  }

  async getNetworkStatus() {
    try {
      const blockNumber = await this.provider.getBlockNumber()
      const gasPrice = await this.provider.getFeeData()

      return {
        success: true,
        blockNumber,
        gasPrice: ethers.formatUnits(gasPrice.gasPrice, "gwei"),
        network: this.networkConfig.name,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

// Export for use in frontend
if (typeof module !== "undefined" && module.exports) {
  module.exports = BlockchainManager
} else if (typeof window !== "undefined") {
  window.BlockchainManager = BlockchainManager
}

// Example usage
async function demonstrateBlockchainIntegration() {
  const blockchain = new BlockchainManager()

  console.log("=== GreenScore Blockchain Integration Demo ===")

  // Connect wallet
  const connection = await blockchain.connectWallet()
  if (connection.success) {
    console.log(`✅ Wallet connected: ${connection.address}`)

    // Get token balance
    const balance = await blockchain.getTokenBalance(connection.address)
    if (balance.success) {
      console.log(`💰 GreenToken Balance: ${balance.balance} GRN`)
    }

    // Validate and award tokens for eco action
    const actionValidation = await blockchain.validateEcoAction("tip_completed", {
      tipId: "tip-123",
      userConfirmation: true,
    })

    if (actionValidation.success) {
      console.log(`✅ Action validated! Awarding ${actionValidation.tokensToAward} tokens`)

      // Mint tokens (in production, this would be done server-side)
      const mintResult = await blockchain.mintTokens(
        connection.address,
        actionValidation.tokensToAward,
        "Eco tip completed",
      )

      if (mintResult.success) {
        console.log(`🎉 Tokens minted! TX: ${mintResult.transactionHash}`)
      }
    }
  }
}

// Run demo if in Node.js environment
if (typeof require !== "undefined" && require.main === module) {
  demonstrateBlockchainIntegration()
}
