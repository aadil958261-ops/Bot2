// ownerInfo.js
const OWNER_INFO = `
━━━━━━━━━━━━
👑 OWNER INFO 👑
━━━━━━━━━━━━
👤 Name:
Attaullah 
🌐 Social Links:
📢 facebook:
https://m.me/j/AbZEYm9NtHS9ubSl/
📲 Telegram:
https://m.me/attaullah.janu6
📘 Facebook:
https://www.facebook.com/attaullah.janu6
━━━━━━━━━━━━
✨ Connect for updates & support
━━━━━━━━━━━━
`;

module.exports.config = {
  name: "ownerinfo",
  version: "1.0.0",
  hasPermssion: 0, // 0 = all users
  description: "Sends owner info when someone types 'Owner' in the group",
  commandCategory: "info",
  usages: "Type 'Owner' in chat",
  cooldowns: 2,
};

module.exports.run = async ({ api, event }) => {
  try {
    const message = event.body || "";
    // Agar message me "owner" word ho to reply send karo
    if (message.toLowerCase().includes("owner")) {
      await api.sendMessage(OWNER_INFO, event.threadID);
    }
  } catch (err) {
    console.error("Error sending owner info:", err);
  }
};