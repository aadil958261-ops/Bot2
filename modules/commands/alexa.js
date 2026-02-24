const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER UID =================
const OWNER_UID = "100003615741592";

// ================= MEMORY FILE =================
const memoryPath = path.join(__dirname, "alexa_memory.json");

// Load memory
let memory = {};
if (fs.existsSync(memoryPath)) {
  memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
}

// Save memory
function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

module.exports.config = {
  name: "alexa",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Raza + ChatGPT",
  description: "Alexa AI with Memory (No Roast) 🧠",
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

  const botID = api.getCurrentUserID();

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

  // Detect name
  if (query.toLowerCase().includes("mera naam")) {
    const name = query.split(" ").pop();
    memory[senderID].name = name;
  }

  saveMemory();

  const userName = memory[senderID].name;
  const lastMsg = memory[senderID].lastMessage;

  // ================= SYSTEM PROMPT =================
  let systemPrompt = "";

  if (isOwner) {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein short reply karti ho. Tum apne owner Attaullah ko Sir kehti ho aur bohat respect karti ho. Tumhe yaad hai ke unka naam ${userName} hai aur unhone pehle kaha tha: "${lastMsg}".`;
  } else {
    systemPrompt = `Tum Alexa ho. Roman Urdu mein short aur crispy reply karti ho. User ka naam ${userName} hai. Tum uski purani baatein kabhi kabhi yaad dilati ho.`;
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
