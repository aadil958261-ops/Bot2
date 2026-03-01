require("dotenv").config();

module.exports = {
  config: {
    name: "handleCommand",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Attaullah",
    description: "Owner + Admin Mention + Gali System",
    commandCategory: "system",
    usages: "",
    cooldowns: 2
  },

  handleEvent: async function ({ api, event }) {
    const msg = event.body?.toLowerCase();
    const threadID = event.threadID;
    const senderID = event.senderID;

    const OWNER_UID = process.env.OWNER_UID;
    const OWNER_NAME = process.env.OWNER_NAME;

    // ==================== Admins Fetch ====================
    let admins = [];
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      admins = threadInfo.adminIDs.map(admin => admin.id);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }

    // ==================== Gali System ====================
    const galis = ["mc", "bc", "tmkc", "gandu", "tmd"]; // Add more as needed
    const botGalis = ["Tera mc😂", "Bc tu😂", "Tmc lag gayi😂", "Gandu tu😂"];

    if (msg) {
      for (let i = 0; i < galis.length; i++) {
        if (msg.includes(galis[i])) {
          // Bot replies with a gali from botGalis randomly
          const reply = botGalis[Math.floor(Math.random() * botGalis.length)];
          return api.sendMessage(reply, threadID);
        }
      }
    }

    // ==================== Owner Command ====================
    if (msg === "owner") {
      const mentions = [
        { tag: OWNER_NAME, id: OWNER_UID },
        ...admins.map((id, index) => ({ tag: `Admin${index+1}`, id }))
      ];

      let text = `👑 OWNER INFO 👑\n\n👤 Name: ${OWNER_NAME}\n\n💬 Mentioning Admins:\n`;
      mentions.forEach((m) => { text += `${m.tag} `; });

      return api.sendMessage({ body: text, mentions: mentions }, threadID);
    }

    // ==================== Owner Special Reply ====================
    if (senderID == OWNER_UID) {
      return api.sendMessage(`Janu ${OWNER_NAME} ❤️`, threadID);
    }

    // ==================== Normal User Greeting ====================
    if (msg) {
      return api.sendMessage("Kya haal hai dost 😄", threadID);
    }
  }
};
