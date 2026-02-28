// ownerInfo.js
const OWNER_ID = "100003615741592"; // Owner UID
const OWNER_NAME = "Attaullah";

const OWNER_INFO = `
━━━━━━━━━━━━
👑 OWNER INFO 👑
━━━━━━━━━━━━
👤 Name: ${OWNER_NAME}
🌐 Social Links:
📢 Messenger: https://m.me/j/AbZEYm9NtHS9ubSl/
📲 Telegram: https://t.me/attaullah_janu6
📘 Facebook: https://www.facebook.com/attaullah.janu6
━━━━━━━━━━━━
✨ Connect for updates & support
━━━━━━━━━━━━
`;

module.exports.config = {
  name: "owner",
  version: "1.3.0",
  hasPermssion: 0, // all users
  description: "Auto replies with owner info whenever someone types 'owner' in chat",
  commandCategory: "info",
  usages: "Just type 'owner' in chat",
  cooldowns: 2,
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const message = event.body || "";

    // Agar message me "owner" word ho to auto send owner info
    if (message.toLowerCase().includes("owner")) {
      await api.sendMessage(
        {
          body: OWNER_INFO,
          mentions: [{ tag: OWNER_NAME, id: OWNER_ID }],
        },
        event.threadID
      );
    }
  } catch (err) {
    console.error("Error sending owner info:", err);
  }
};
