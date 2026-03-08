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

const devilStatus = new Map(); // user based
let globalDevil = false; // owner global mode

const ADMIN_UID = "100003615741592";
const API_URL = "https://apiabuse-kz4b.vercel.app/api/chat";

const badWords = [
  "madarchod","behenchod","bhosdike","chutiya",
  "harami","lund","gandu","mc","bc","bsdk","randi"
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").trim().toLowerCase();

  // 🔒 only owner control
  if (content === "on" || content === "off") {

    if (senderID !== ADMIN_UID) {
      return api.sendMessage(
        "❌ Devil mode sirf owner control karega.",
        threadID,
        messageID
      );
    }

    if (content === "on") {
      globalDevil = true;
      return api.sendMessage("😈 Devil Mode GLOBAL ON ho gaya!", threadID, messageID);
    }

    if (content === "off") {
      globalDevil = false;
      return api.sendMessage("🙂 Devil Mode GLOBAL OFF.", threadID, messageID);
    }
  }

  if (!content) {
    return api.sendMessage(
      senderID === ADMIN_UID
        ? "Jaan kuch to bolo na... ❤️ main hamesha wafadar hoon."
        : "Abey bol madarchod, kya chahiye?",
      threadID,
      messageID
    );
  }

  return chatWithDevil(api, event, args.join(" "));
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, type, messageReply } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  const lowerBody = body.toLowerCase();

  // gaali detect -> user devil
  if (badWords.some(word => lowerBody.includes(word))) {
    devilStatus.set(senderID, true);
  }

  const isUserDevil = devilStatus.get(senderID) || false;

  if (!globalDevil && !isUserDevil) return;

  if (
    lowerBody.startsWith("devil ") ||
    (type === "message_reply" && messageReply?.senderID === botID)
  ) {

    const query = lowerBody.startsWith("devil ")
      ? body.slice(6).trim()
      : body.trim();

    if (!query) {
      return api.sendMessage(
        senderID === ADMIN_UID
          ? "Kuch type kar jaan... ❤️"
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
      isAdmin: isAdmin
    });

    let reply = res.data.reply || "Kuch gadbad ho gai... 😭";

    if (isAdmin) {
      reply = "Attaullah jani ❤️: " + reply;
    }

    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error("Devil API error:", error.message);

    return api.sendMessage(
      isAdmin
        ? "Arre pyare, thodi der lag rahi... sorry jaan ❤️"
        : "Arre behenchod API down ho gaya! 😈",
      event.threadID,
      event.messageID
    );
  }
}
