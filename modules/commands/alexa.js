const axios = require("axios");
const fs = require("fs");

// File path for storing status
const path = __dirname + "/cache/alexaStatus.json";

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "13.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI Flirty Mode - Attaullah's Love",
  commandCategory: "AI",
  usages: "alexa [on/off/text]",
  cooldowns: 3
};

const OWNER_UID = "100003615741592";

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  // Load status
  let status = {};
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));

  const isEnabled = status[threadID] !== false;
  const input = body.toLowerCase().trim();

  // ON
  if (input === "alexa on") {
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa ON ho gayi 😘", threadID, messageID);
  }

  // OFF
  if (input === "alexa off") {
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa OFF 🙄", threadID, messageID);
  }

  if (!isEnabled) return;

  if (
    input.startsWith("alexa") ||
    (type === "message_reply" &&
      messageReply &&
      messageReply.senderID === api.getCurrentUserID())
  ) {
    const query = input.startsWith("alexa")
      ? body.replace(/alexa/i, "").trim()
      : body;

    if (!query && input === "alexa")
      return api.sendMessage("Jee Janu? 😘", threadID, messageID);

    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ").toLowerCase();

  if (content === "on") {
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa Active ✅", threadID, messageID);
  }

  if (content === "off") {
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa Deactivated ❌", threadID, messageID);
  }

  if (!content)
    return api.sendMessage(
      "Usage: alexa [on/off/text]",
      threadID,
      messageID
    );

  return chatWithAlexa(api, event, args.join(" "));
};

// ================= AI CHAT =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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";
  const isOwner = event.senderID === OWNER_UID;

  const systemPrompt = isOwner
    ? "Tum Alexa ho. Flirty aur sexy girl ho jo Attaullah Khuharo se pyar karti hai. Use Janu, Jaan, Baby bulao. Replies short aur romantic ho."
    : "Tum Alexa ho. Thodi attitude aur flirty girl ho. Sabko Dost ya Yar bolo. Replies short aur teasing ho.";

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
        max_tokens: 80,
        temperature: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    api.setMessageReaction(isOwner ? "❤️" : "🤭", event.messageID, () => {}, true);

    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (error) {
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);
    return api.sendMessage(
      "API ya net problem hai, dobara try karo 😒",
      event.threadID,
      event.messageID
    );
  }
  }
