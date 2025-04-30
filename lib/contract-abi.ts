export const TippingContractABI = [
  // Events
  "event TipSent(address indexed sender, address indexed recipient, uint256 amount, string message, uint256 timestamp)",
  "event ProfileUpdated(address indexed user, string username, string bio, string profileImage)",

  // View Functions
  "function getProfile(address user) view returns (string username, string bio, string profileImage)",
  "function getTipsSentByUser(address user) view returns (tuple(address sender, address recipient, uint256 amount, string message, uint256 timestamp)[])",
  "function getTipsReceivedByUser(address user) view returns (tuple(address sender, address recipient, uint256 amount, string message, uint256 timestamp)[])",

  // State Changing Functions
  "function sendTip(address recipient, string memory message) payable",
  "function updateProfile(string memory username, string memory bio, string memory profileImage)",
]
