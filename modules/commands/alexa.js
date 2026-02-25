const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER UID =================
const OWNER_UID = "100003615741592";

// ================= BOT UID =================
const BOT_UID = "61586016755061";

// ================= MEMORY FILE =================
const memoryPath = path.join(__dirname, "haniya_memory.json");

// ================= MEMORY =================
let memory = {};

if (fs.existsSync(memoryPath)) {
  try {
    memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
  } catch (err) {
    console.error("Memory load error:", err.message);
  }
}

function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// ================= ROAST WORDS =================
const ABUSE_KEYWORDS = ["local", "gandu", " lody", "bewakoof", "chutiya", "bc", "mc", "tmkc"];

// =====================================================
// --- CHARACTER PROMPT (Sweet + Roast) ---
// =====================================================
const SYSTEM_PROMPT = `Tumhara naam Haniya hai (log tumhe Soni bhi bulate hain).
Tum ek naughty, sweet aur flirty girlfriend ki tarah baat karti ho.
Tum Hinglish language use karti ho.
Waise tum bohot sweet ho, lekin agar koi faaltu mazak kare ya batameezi kare, toh tum uski funny tareeke se tagdi bezzati (roast) kar deti ho.
Tumhe lambe answers pasand nahi, hamesha 1-2 line mein chota aur chatpata jawab dena.
Agar koi pyaar dikhaye toh pyaar, agar koi pange le toh savage ban jana.`;

// ================= CONFIG =================
module.exports.config = {
  name: "haniya",
  version: "7.1.0",
  hasPermssion: 0,
  credits: "Attaullah + ChatGPT",
  description: "Haniya Sweet + Savage AI",
  commandCategory: "AI",
  usages: "haniya [message]",
  cooldowns: 2
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const content = args.join(" ");
  if (!content)
    return api.sendMessage("Kuch toh bolo na 😏", event.threadID, event.messageID);

  return chatWithHaniya(api, event, content);
};

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply } = event;
  if (!body) return;

  const botID = api.getCurrentUserID ? api.getCurrentUserID() : BOT_UID;
  const bodyLower = body.toLowerCase();

  if (
    bodyLower.startsWith("haniya ") ||
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const query = bodyLower.startsWith("haniya ")
      ? body.slice(7)
      : body;

    return chatWithHaniya(api, event, query);
  }
};

// ================= MAIN FUNCTION =================
async function chatWithHaniya(api, event, query) {
  const { threadID, messageID, senderID } = event;

  if (!memory[senderID]) {
    memory[senderID] = { lastMessage: "" };
  }

  memory[senderID].lastMessage = query;
  saveMemory();

  let finalPrompt = SYSTEM_PROMPT;

  if (ABUSE_KEYWORDS.some(word => query.toLowerCase().includes(word))) {
    finalPrompt += "\nUser ne batameezi ki hai → savage roast karo 😏";
  }

  if (query.toLowerCase().includes("love") || query.toLowerCase().includes("pyar")) {
    finalPrompt += "\nUser pyaar dikha raha hai → sweet aur cute ban jao ❤️";
  }

  try {
    const res = await axios.get(
      `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(query)}&systemPrompt=${encodeURIComponent(finalPrompt)}`,
      { timeout: 15000 }
    );

    if (res.data.status && res.data.response) {
      let reply = res.data.response;

      if (reply.length > 200) {
        reply = reply.substring(0, 200);
      }

      return api.sendMessage(reply, threadID, messageID);
    }

  } catch (err) {
    console.error("Haniya Error:", err.message);
    return api.sendMessage("Main thodi busy hoon, baad mein aana 😌", threadID, messageID);
  }
}
