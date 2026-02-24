const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER UID =================
const OWNER_UID = "100003615741592"; // Owner ka UID

// ================= BOT UID =================
const BOT_UID = "100001991336350"; // Apni bot ki UID

// ================= MEMORY FILE =================
const memoryPath = path.join(__dirname, "alexa_memory.json");

// ================= INITIAL MEMORY =================
let memory = {
  [OWNER_UID]: {
    name: "Attaullah",
    lastMessage: ""
  },
  [BOT_UID]: {
    name: "Alexa",
    introduction: "Main Alexa hoon, Pakistan ke Sindh se. Attaullah ne mujhe banaya hai aur main apne Sir ki hamesha izzat karti hoon. Agar koi unki badtameezi kare, to main usko politely ya witty tareeke se handle karti hoon.",
    lastMessage: ""
  }
};

// Load existing memory safely if file exists
if (fs.existsSync(memoryPath)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
    memory = { ...memory, ...loaded }; // merge existing memory
  } catch (err) {
    console.error("Memory file parse error, using initial memory...", err.message);
  }
}

// Save memory
function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// ================= FUNNY / ROAST REPLIES =================
const ABUSE_KEYWORDS = ["stupid", "idiot", "bewakoof", "chutiya", "gadha", "ullu", "haram"];
function getRoastReply(senderID) {
  const isOwner = senderID === OWNER_UID;
  const replies = isOwner
    ? ["Sir ❤️, aapki baat meri liye hamesha precious hai 😘", "Sir 🥰, aap bohat pyare ho", "Sir 😇, main aapko hamesha respect karti hoon"]
    : ["Oye 😂 thoda tameez seekh lo!", "Hahaha 🤭 so cute lagta hai jab gussa hote ho!", "Arre bhai, thoda polite ho jao 😎"];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "5.5.0",
  hasPermssion: 0,
  credits: "Attaullah + ChatGPT",
  description: "Alexa AI Interactive with Friendly Owner Love, Funny Replies & Memory 🧠",
  commandCategory: "AI",
  usages: "alexa [message]",
  cooldowns: 2
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const content = args.join(" ");
  if (!content) return api.sendMessage("❓ Kuch to bolo Alexa se...", event.threadID, event.messageID);
  return chatWithAlexa(api, event, content);
};

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, senderID } = event;
  if (!body) return;

  // Safe botID
  const botID = api.getCurrentUserID ? api.getCurrentUserID() : BOT_UID;

  // Check for abuse keywords
  const bodyLower = body.toLowerCase();
  if (ABUSE_KEYWORDS.some(word => bodyLower.includes(word))) {
    const roast = getRoastReply(senderID);
    return api.sendMessage(roast, event.threadID, event.messageID);
  }

  if (
    body.toLowerCase().startsWith("alexa ") ||
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const query = body.toLowerCase().startsWith("alexa ")
      ? body.slice(6)
      : body;
    return chatWithAlexa(api, event, query);
  }
};

// ================= MAIN FUNCTION =================
async function chatWithAlexa(api, event, query) {
  const { threadID, messageID, senderID } = event;
  const isOwner = senderID === OWNER_UID;

  // ================= MEMORY =================
  if (!memory[senderID]) {
    memory[senderID] = {
      name: "Friend",
      lastMessage: ""
    };
  }

  // Save last message
  memory[senderID].lastMessage = query;

  // Detect name safely (optional)
  if (query.toLowerCase().includes("mera naam")) {
    const nameMatch = query.match(/mera naam ([a-zA-Z\s]+)( hai)?/i);
    if (nameMatch && nameMatch[1]) {
      memory[senderID].name = nameMatch[1].trim();
      saveMemory();
    }
  }

  const userName = memory[senderID].name || "Friend";
  const lastMsg = memory[senderID].lastMessage;

  // ================= SYSTEM PROMPT =================
  let systemPrompt = "";

  if (isOwner) {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein pyar bhare aur short reply karti ho. Tum apne owner Attaullah ko hamesha Sir kehti ho aur hamesha izzat karti ho. Pehle unhone kaha tha: "${lastMsg}".`;
  } else {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein short aur crispy reply karti ho. User ka naam ${userName} hai. Tum uski purani baatein kabhi kabhi yaad dilati ho. Jaise pehle unhone kaha tha: "${lastMsg}". Bot ka naam Alexa hai, Pakistan ke Sindh se hai. Attaullah ne mujhe banaya hai aur main Owner ki badtameezi politely ya witty tareeke se handle karti hoon.`;
  }

  try {
    const res = await axios.get(
      `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(query)}&systemPrompt=${encodeURIComponent(systemPrompt)}`,
      { timeout: 15000 }
    );

    if (res.data.status && res.data.response) {
      let reply = res.data.response;

      // 👑 Owner prefix
      if (isOwner) {
        reply = "👑 Owner Sir ❤️\n\n" + reply;
      }

      saveMemory(); // save after reply
      return api.sendMessage(reply, threadID, messageID);
    }

  } catch (err) {
    console.error("Alexa Error:", err.message);
    return api.sendMessage("⚠️ Alexa busy hai, baad me try karo.", threadID, messageID);
  }
  }
