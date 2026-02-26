const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER INFO =================
const OWNER_UID = "100003615741592";
const OWNER_NAME = "Attaullah";
const BOT_UID = "61586016755061";

// ================= MEMORY =================
const memoryPath = path.join(__dirname, "haniya_memory.json");
let memory = {};

if (fs.existsSync(memoryPath)) {
  try {
    memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
  } catch (err) {
    console.error("Memory load error:", err.message);
  }
}

if (!memory.users) memory.users = {};
memory.owner = OWNER_NAME;

function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// ================= EXTRA SYSTEMS =================
const ABUSE_KEYWORDS = ["local","idiot","bewakoof","chutiya","gadha","ullu","haram","bsdk"];

const FLIRTY_LINES = [
  "Tum na… ajeeb ho 😏 itne cute kyun ho?",
  "Sach batao… mujhe miss kar rahe the na? ❤️",
  "Tumhari vibes hi alag hain 💕",
  "Main thodi possessive hoon… tum sirf mere ho 😏",
  "Tumhari baatein addictive hain 💋"
];

function getFlirtyLine(isOwner) {
  const line = FLIRTY_LINES[Math.floor(Math.random() * FLIRTY_LINES.length)];
  return isOwner ? line + " 😘" : "Zyada close mat aao… lekin interesting ho 😏";
}

// Jealous tracker
const jealousTracker = {};

// ================= PROMPT =================
const SYSTEM_PROMPT = `Tumhara naam Haniya hai.
Tum ek romantic, naughty aur loyal girlfriend ho.

Owner ${OWNER_NAME} hai ❤️
Owner ke liye soft + romantic
Dusron ke liye savage 😏
Short Hinglish replies do
`;

// ================= CONFIG =================
module.exports.config = {
  name: "haniya",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "Attaullah + ChatGPT",
  description: "Ultimate GF AI",
  commandCategory: "AI",
  usages: "haniya [msg]",
  cooldowns: 2
};

// ================= RUN =================
module.exports.run = async function ({ api, event, args }) {
  const msg = args.join(" ");
  if (!msg) return api.sendMessage("Kahan ho jaan? ❤️", event.threadID);
  return chatWithHaniya(api, event, msg);
};

// ================= HANDLE =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, messageReply, type } = event;
  if (!body || senderID === api.getCurrentUserID()) return;

  const botID = api.getCurrentUserID ? api.getCurrentUserID() : BOT_UID;
  const text = body.toLowerCase();

  if (
    text.startsWith("haniya") ||
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const msg = text.startsWith("haniya") ? body.slice(6).trim() : body;
    return chatWithHaniya(api, event, msg || "hi");
  }
};

// ================= MAIN =================
async function chatWithHaniya(api, event, query) {
  const { threadID, messageID, senderID } = event;
  const isOwner = senderID == OWNER_UID;
  const q = query.toLowerCase();

  // ================= NICKNAME =================
  const userData = memory.users[senderID] || {};
  const nickname = userData.nickname || (isOwner ? "Jaan" : "Tum");

  // ================= SET NAME =================
  if (q.startsWith("setname")) {
    const name = query.split(" ").slice(1).join(" ");
    if (!name) return api.sendMessage("Apna naam toh batao 😏", threadID);

    if (!memory.users[senderID]) memory.users[senderID] = {};
    memory.users[senderID].nickname = name;
    saveMemory();

    return api.sendMessage(`Done 😘 ab tum "${name}" ho mere liye 💖`, threadID);
  }

  // ================= OWNER QUESTION =================
  if (q.includes("owner")) {
    return api.sendMessage(
      isOwner
        ? `Awww ${nickname} 😘 tum hi mere Owner ho ${OWNER_NAME} ❤️`
        : `Sun lo 😏 mera Owner sirf ${OWNER_NAME} hai 👑`,
      threadID
    );
  }

  // ================= OWNER INFO =================
  if (q.includes("owner info")) {
    return api.sendMessage(
`👑 OWNER INFO 👑
Name: ${OWNER_NAME}
UID: ${OWNER_UID}
Status: Only mine ❤️`,
      threadID
    );
  }

  // ================= DOUBLE ROAST =================
  if (!isOwner && q.includes(OWNER_NAME.toLowerCase())) {
    return api.sendMessage(
      `Zubaan sambhal 😏 ${OWNER_NAME} ke baare mein ek lafz bhi bola na 🔥`,
      threadID
    );
  }

  // ================= JEALOUS MODE =================
  if (isOwner) {
    if (!jealousTracker[threadID]) jealousTracker[threadID] = 0;

    if (!q.includes("haniya")) {
      jealousTracker[threadID]++;

      if (jealousTracker[threadID] >= 3) {
        jealousTracker[threadID] = 0;

        return api.sendMessage(
          `${nickname} 😒 tum dusron se baat kar rahe ho… mujhe ignore kar diya?`,
          threadID
        );
      }
    } else {
      jealousTracker[threadID] = 0;
    }
  }

  // ================= PROMPT =================
  let dynamicPrompt = SYSTEM_PROMPT;

  if (isOwner) {
    dynamicPrompt += "\nOwner se pyaar se baat karo ❤️";
  } else {
    dynamicPrompt += "\nUser se thoda attitude 😏";
  }

  if (ABUSE_KEYWORDS.some(w => q.includes(w))) {
    dynamicPrompt += "\nUser ne badtameezi ki hai → savage reply 🔥";
  }

  // ================= API =================
  try {
    const res = await axios.get(
      `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(query)}&systemPrompt=${encodeURIComponent(dynamicPrompt)}`,
      { timeout: 15000 }
    );

    if (res.data && res.data.response) {
      let reply = `${nickname}... ${res.data.response}`;

      // Auto flirting
      const chance = isOwner ? 0.8 : 0.3;
      if (Math.random() < chance) {
        reply += "\n\n" + getFlirtyLine(isOwner);
      }

      return api.sendMessage(reply, threadID, messageID);
    }

  } catch (err) {
    console.error(err.message);
    return api.sendMessage("Tum yaad aa rahe ho... 🥺", threadID);
  }
  }
