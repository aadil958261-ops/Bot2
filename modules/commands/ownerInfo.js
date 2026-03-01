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
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Attaullah + ChatGPT",
  description: "Auto reply owner info (no prefix)",
  commandCategory: "info",
  usages: "owner",
  cooldowns: 2,
  usePrefix: false
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!event.body) return;

    const senderID = event.senderID;
    const botID = api.getCurrentUserID();

    // Bot khud ko reply na kare
    if (senderID == botID) return;

    const msg = event.body.toLowerCase().trim();

    // Agar message me "owner" word ho
    if (msg.includes("owner")) {
      return api.sendMessage(
        {
          body: OWNER_INFO,
          mentions: [
            {
              tag: OWNER_NAME,
              id: OWNER_ID
            }
          ]
        },
        event.threadID,
        event.messageID
      );
    }

  } catch (error) {
    console.log("Owner Info Error:", error);
  }
};
