// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Somnia Tipping Contract
 * @dev A contract for sending and receiving tips on the Somnia Testnet
 */
contract SomniaTipping {
    // Struct to store tip information
    struct Tip {
        address sender;
        address recipient;
        uint256 amount;
        string message;
        uint256 timestamp;
    }
    
    // Struct to store user profile information
    struct Profile {
        string username;
        string bio;
        string profileImage;
        bool exists;
    }
    
    // Mapping of user addresses to their profiles
    mapping(address => Profile) public profiles;
    
    // Mapping of user addresses to the tips they've sent
    mapping(address => Tip[]) public tipsSent;
    
    // Mapping of user addresses to the tips they've received
    mapping(address => Tip[]) public tipsReceived;
    
    // Events
    event TipSent(address indexed sender, address indexed recipient, uint256 amount, string message, uint256 timestamp);
    event ProfileUpdated(address indexed user, string username, string bio, string profileImage);
    
    /**
     * @dev Send a tip to a recipient
     * @param recipient The address of the recipient
     * @param message An optional message to include with the tip
     */
    function sendTip(address recipient, string memory message) external payable {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Tip amount must be greater than 0");
        require(recipient != msg.sender, "Cannot send tip to yourself");
        
        // Create a new tip
        Tip memory newTip = Tip({
            sender: msg.sender,
            recipient: recipient,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp
        });
        
        // Add the tip to the sender's sent tips
        tipsSent[msg.sender].push(newTip);
        
        // Add the tip to the recipient's received tips
        tipsReceived[recipient].push(newTip);
        
        // Transfer the tip amount to the recipient
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Emit the TipSent event
        emit TipSent(msg.sender, recipient, msg.value, message, block.timestamp);
    }
    
    /**
     * @dev Update a user's profile
     * @param username The user's username
     * @param bio The user's bio
     * @param profileImage The URL to the user's profile image
     */
    function updateProfile(string memory username, string memory bio, string memory profileImage) external {
        require(bytes(username).length > 0, "Username cannot be empty");
        
        // Update the user's profile
        profiles[msg.sender] = Profile({
            username: username,
            bio: bio,
            profileImage: profileImage,
            exists: true
        });
        
        // Emit the ProfileUpdated event
        emit ProfileUpdated(msg.sender, username, bio, profileImage);
    }
    
    /**
     * @dev Get a user's profile
     * @param user The address of the user
     * @return The user's profile information
     */
    function getProfile(address user) external view returns (string memory username, string memory bio, string memory profileImage) {
        Profile memory profile = profiles[user];
        require(profile.exists, "Profile does not exist");
        return (profile.username, profile.bio, profile.profileImage);
    }
    
    /**
     * @dev Get all tips sent by a user
     * @param user The address of the user
     * @return An array of tips sent by the user
     */
    function getTipsSentByUser(address user) external view returns (Tip[] memory) {
        return tipsSent[user];
    }
    
    /**
     * @dev Get all tips received by a user
     * @param user The address of the user
     * @return An array of tips received by the user
     */
    function getTipsReceivedByUser(address user) external view returns (Tip[] memory) {
        return tipsReceived[user];
    }
}
