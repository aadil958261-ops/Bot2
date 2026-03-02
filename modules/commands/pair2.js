const axios = require("axios"); // Import axios for potential HTTP requests
const fs = require("fs");       // Import fs for file system operations
const path = require("path");   // Import path for path handling

const { normalizeGender } = global.gender || { 
    normalizeGender: (gender) => {
        if (gender === 1 || gender === "FEMALE" || gender === "female") return "FEMALE";
        if (gender === 2 || gender === "MALE" || gender === "male") return "MALE";
        return null;
    }
};

module.exports = {
  config: {
    name: "pair2",  // Command name
    description: "Find a pair of opposite gender user",
    usage: "{prefix}pair2",  // Usage instruction
    credit: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", // Credit
    hasPrefix: true,
    permission: "PUBLIC", // Permission level
    cooldown: 5,         // Cooldown in seconds
    category: "FUN"      // Command category
  },

  run: async function({ api, message }) {
    const { threadID, messageID, senderID } = message;

    try {
      // Get sender info and normalize gender
      const senderInfo = await api.getUserInfo(senderID);
      const senderGender = normalizeGender(senderInfo[senderID]?.gender);
      
      if (!senderGender) {
        return api.sendMessage("❌ Could not detect your gender.", threadID, messageID);
      }
      
      // Determine target gender
      const targetGender = senderGender === "FEMALE" ? "MALE" : "FEMALE";

      // Get thread info
      const threadInfo = await api.getThreadInfo(threadID);
      
      // Find opposite gender users
      const potentialPairs = [];
      if (Array.isArray(threadInfo.userInfo)) {
        for (const user of threadInfo.userInfo) {
          if (user.id === senderID) continue;
          
          const userGender = normalizeGender(user.gender);
          if (userGender === targetGender) {
            potentialPairs.push({
              userID: user.id,
              name: user.name || "Unknown"
            });
          }
        }
      }
      
      if (potentialPairs.length === 0) {
        return api.sendMessage(`❌ No ${targetGender.toLowerCase()} users found in this group.`, threadID, messageID);
      }

      // Randomly select a pair
      const randomPair = potentialPairs[Math.floor(Math.random() * potentialPairs.length)];
      
      // Send match message
      const msg = `🎉 Pair Found!\n\n${senderInfo[senderID].name} 💖 ${randomPair.name}`;
      api.sendMessage(msg, threadID, messageID);

    } catch (error) {
      console.error("Pair error:", error);
      api.sendMessage("❌ Error occurred.", threadID, messageID);
    }
  }
};
