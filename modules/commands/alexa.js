const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER UID =================
const OWNER_UID = "100003615741592"; // Owner ka UID

// ================= BOT UID =================
const BOT_UID = "100001991336350"; // Apni bot ki UID yahan dalen

// ================= MEMORY FILE =================
const memoryPath = path.join(__dirname, "alexa_memory.json");

// Load memory safely
let memory = {};
if (fs.existsSync(memoryPath)) {
  try {
    memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
  } catch (err) {
    console.error("Memory file parse error, resetting...", err.message);
    memory = {};
  }
}

// Save memory
function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

module.exports.config = {
  name: "alexa",
  version: "5.2.0", // updated version
  hasPermssion: 0,
  credits: "Raza + ChatGPT",
  description: "Alexa AI with Memory + Auto Ask Name + Last Message Reference 🧠",
  commandCategory: "AI",
  usages: "alexa [message]",
  cooldowns: 2
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const content = args.join(" ");
  if (!content) {
    return api.sendMessage("❓ Kuch to bolo Alexa se...", event.threadID, event.messageID);
  }
  return chatWithAlexa(api, event, content);
};

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply } = event;
  if (!body) return;

  // Safe botID
  const botID = api.getCurrentUserID ? api.getCurrentUserID() : BOT_UID;

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
      name: "Unknown",
      lastMessage: ""
    };
  }

  // Save last message
  memory[senderID].lastMessage = query;

  // Detect name safely
  if (query.toLowerCase().includes("mera naam")) {
    const nameMatch = query.match(/mera naam (\w+)/i);
    if (nameMatch) memory[senderID].name = nameMatch[1];
    saveMemory();
  }

  const userName = memory[senderID].name;
  const lastMsg = memory[senderID].lastMessage;

  // ================= ASK NAME IF MISSING =================
  if (userName === "Unknown") {
    return api.sendMessage(
      "Hey! 😊 Pehle mujhe apna naam batao, phir main aapko yaad rakh sakti hoon. Example: 'Mera naam Alexa hai'",
      threadID,
      messageID
    );
  }

  // ================= SYSTEM PROMPT =================
  let systemPrompt = "";

  if (isOwner) {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein short reply karti ho. Tum apne owner Attaullah ko Sir kehti ho aur bohat respect karti ho. Tumhe yaad hai ke unka naam ${userName} hai aur unhone pehle kaha tha: "${lastMsg}".`;
  } else {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein short aur crispy reply karti ho. User ka naam ${userName} hai. Tum uski purani baatein kabhi kabhi yaad dilati ho. Jaise pehle unhone kaha tha: "${lastMsg}"`;
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

      return api.sendMessage(reply, threadID, messageID);
    }

  } catch (err) {
    console.error("Alexa Error:", err.message);
    return api.sendMessage("⚠️ Alexa busy hai, baad me try karo.", threadID, messageID);
  }
    }
