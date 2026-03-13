const axios = require("axios");

module.exports.config = {
  name: "devil",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Kashif Raza - Simple API Mode",
  description: "Devil AI via deployed API (full gaali mode)",
  commandCategory: "AI",
  usages: "devil [message] or devil on/off",
  cooldowns: 2
};

const devilStatus = new Map();
const ADMIN_UID = "100003615741592"; // Teri UID - pyar mode
const API_URL = "https://apiabuse-kz4b.vercel.app/api/chat";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").trim();

  if (content.toLowerCase() === "on") {
    devilStatus.set(threadID, true);
    return api.sendMessage("✅ Devil ON ho gaya bhai! Ab full maza 🔥", threadID, messageID);
  }
  if (content.toLowerCase() === "off") {
    devilStatus.set(threadID, false);
    return api.sendMessage("❌ Devil OFF... miss you already 😏", threadID, messageID);
  }

  if (!content) {
    return api.sendMessage(
      senderID === ADMIN_UID 
        ? "Jaan kuch to bolo na... ❤️" 
        : "Abey bol madarchod, kya chahiye?", 
      threadID, messageID
    );
  }

  return chatWithDevil(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, type, messageReply, senderID } = event;
  if (!body) return;

  const isEnabled = devilStatus.get(threadID) || false;
  const botID = api.getCurrentUserID();

  if (!isEnabled) return;

  const lowerBody = body.toLowerCase().trim();
  if (lowerBody.startsWith("devil ") || (type === "message_reply" && messageReply?.senderID === botID)) {
    const query = lowerBody.startsWith("devil ") ? body.slice(6).trim() : body.trim();
    if (!query) {
      return api.sendMessage(
        senderID === ADMIN_UID 
          ? "Kuch type kar jaan... bore ho raha hoon tere bina ❤️" 
          : "Kuch bol na harami... 😈", 
        threadID
      );
    }
    return chatWithDevil(api, event, query);
  }
};

async function chatWithDevil(api, event, query) {
  const isAdmin = event.senderID === ADMIN_UID;

  try {
    const res = await axios.post(API_URL, {
      message: query,
      isAdmin: isAdmin  // Admin check API ko bhej rahe hain
    });

    const reply = res.data.reply || "Kuch gadbad ho gai... 😭";
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error("Devil API error:", error.message);
    return api.sendMessage(
      isAdmin 
        ? "Arre pyare, thodi der lag rahi... sorry jaan ❤️" 
        : "Arre behenchod API down ho gaya! Teri behn intezaar kar rahi 😈", 
      event.threadID, event.messageID
    );
  }
}
