const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "15.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Full Smart System",
  commandCategory: "AI",
  usages: "alexa [on/off/text]",
  cooldowns: 3
};

// ================= OWNER UID =================
const OWNER_UID = "100003615741592";

// ================= SETTINGS FILE =================
const settingsPath = path.join(__dirname, "alexaSettings.json");

if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(settingsPath, JSON.stringify({}));
}

function getSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(data) {
  fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
}

// ================= ABUSE FILTER =================
const badWords = [
  "mc","bc","gandu","madarchod","behenchod",
  "tmkc","lund","chutiya","kutta","kutti"
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

function containsAbuse(text) {
  const clean = normalize(text);
  return badWords.some(word => clean.includes(word));
}

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID, type, messageReply } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const settings = getSettings();
  const groupState = settings[threadID];

  if (groupState === false) return;

  const input = body.toLowerCase();

  // 🔥 Abuse detect
  if (containsAbuse(input)) {
    return api.sendMessage(
      "Oye 😏 zaban control me rakho warna Alexa attitude dikha degi!",
      threadID,
      messageID
    );
  }

  if (
    input.startsWith("alexa") ||
    (type === "message_reply" &&
      messageReply &&
      messageReply.senderID === api.getCurrentUserID())
  ) {
    const query = input.startsWith("alexa")
      ? body.replace(/alexa/i, "").trim()
      : body;

    if (!query && input === "alexa") {
      return api.sendMessage("Haan bolo 😏 kya baat hai?", threadID, messageID);
    }

    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").toLowerCase();

  const settings = getSettings();

  // 🔍 Check owner present in group
  let isOwnerInGroup = false;
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    isOwnerInGroup = threadInfo.participantIDs.includes(OWNER_UID);
  } catch (e) {}

  // ================= ON =================
  if (content === "on") {
    if (isOwnerInGroup && senderID !== OWNER_UID) {
      return api.sendMessage(
        "Owner group me mojood hai 😏 sirf woh mujhe ON kar sakta hai",
        threadID,
        messageID
      );
    }

    settings[threadID] = true;
    saveSettings(settings);

    return api.sendMessage("Alexa ab is group me ON ho gayi hai ✅", threadID, messageID);
  }

  // ================= OFF =================
  if (content === "off") {
    if (isOwnerInGroup && senderID !== OWNER_UID) {
      return api.sendMessage(
        "Owner group me mojood hai 😏 sirf woh mujhe OFF kar sakta hai",
        threadID,
        messageID
      );
    }

    settings[threadID] = false;
    saveSettings(settings);

    return api.sendMessage("Alexa ab is group me OFF ho gayi hai ❌", threadID, messageID);
  }

  // ================= CHAT =================
  if (!content) {
    return api.sendMessage("Kuch to bolo 😏", threadID, messageID);
  }

  return chatWithAlexa(api, event, content);
};

// ================= AI FUNCTION =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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";
  const senderID = event.senderID;
  const isOwner = senderID === OWNER_UID;

  // 👇 Gender detection (simple name based)
  let gender = "boy";
  try {
    const userInfo = await api.getUserInfo(senderID);
    const name = userInfo[senderID].name.toLowerCase();

    const girlNames = ["sana","fatima","ayesha","zara","hina","iqra","noor","alina","khadija"];
    if (girlNames.some(n => name.includes(n))) gender = "girl";
  } catch (e) {}

  // 🎭 SYSTEM PROMPT
  let systemPrompt = "";

  if (isOwner) {
    systemPrompt = "Tum Alexa ho. Tum sirf Attaullah se mohabbat karti ho. Usay 'Janu', 'Jaan', 'baby', 'Jani' bulao. Bohot romantic aur flirty 2-3 lines me reply do.";
  } 
  else if (gender === "girl") {
    systemPrompt = "Tum Alexa ho. Tum girls se sweet aur friendly ho. Unhe 'Bestie', 'Yar' ya 'Behn' bulao. Soft aur cute style me 2-3 lines ka reply do.";
  } 
  else {
    systemPrompt = "Tum Alexa ho. Tum boys se girlfriend jesi flirty baat karti ho lekin kabhi 'Janu', 'Jaan', 'baby' nahi bolti. Unhe 'Dost' ya naam se bulao. Thodi naughty aur attitude wali ho. Kabhi 'bhai' mat bolo. 2-3 lines ka reply do.";
  }

  try {
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 150,
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    api.setMessageReaction(isOwner ? "❤️" : "😏", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);
    return api.sendMessage("API ya net issue hai 😒 baad me try karo", event.threadID, event.messageID);
  }
}
