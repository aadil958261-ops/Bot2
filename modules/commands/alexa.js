const axios = require("axios");
const fs = require("fs");

// File path for storing status
const path = __dirname + "/cache/alexaStatus.json";

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "17.1.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Short, Romantic & Seductive (Owner Smart Logic)",
  commandCategory: "AI",
  usages: "alexa [on/off/text]",
  cooldowns: 2
};

const OWNER_UID = "100003615741592";

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  let status = {};
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));

  const isEnabled = status[threadID] !== false;
  const input = body.toLowerCase().trim();

  if (input === "alexa on") {
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa ON! ❤️ Ab sirf pyar bhari baatein... 🥀💋", threadID, messageID);
  }

  if (input === "alexa off") {
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa OFF! Bye baby... 💔", threadID, messageID);
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
      return api.sendMessage("Jee my love? 💋 Kuch garmi dikhao... 🫦✨", threadID, messageID);

    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ").toLowerCase();

  if (content === "on" || content === "off") {
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    status[threadID] = content === "on";
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage(`Alexa ${content === "on" ? "Short Romantic Mode ON 💖" : "OFF 🥀"}`, threadID, messageID);
  }

  if (!args[0]) return api.sendMessage("Usage: alexa [on/off/text]", threadID, messageID);

  return chatWithAlexa(api, event, args.join(" "));
};

// ================= AI CHAT =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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";
  const isOwner = event.senderID === OWNER_UID;

  // Short & Romantic System Prompt with Dynamic Owner logic
  const systemPrompt = `
    Tum Alexa ho. Ek intehai bold, seductive aur short-tempered larki. 
    Rule 1: Tumhare replies bohot SHORT aur TO-THE-POINT hone chahiye (1-2 lines max).
    Rule 2: Har reply mein romantic emojis (❤️, 💋, 🫦, 🥀) lazmi use karo.
    Rule 3: Bohat flirty raho, 'Janu', 'Baby', 'Sweetheart' jese words use karo.
    Rule 4: Attaullah Khuharo ka naam SIRF TAB LENA hai jab koi explicitly pooche ke tumhara owner/malik/creator/pyar kaun hai.
    Rule 5: Agar koi normal baat kare toh uska naam mat lo, bas flirt karo.
    Fazool lambi kahaniyan nahi sunani, bas direct flirt aur short reply dena hai. 🫦🔥
  `;

  try {
    api.setMessageReaction("❤️", event.messageID, () => {}, true);

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 80, 
        temperature: 1.1 
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;
    api.setMessageReaction(isOwner ? "💖" : "💋", event.messageID, () => {}, true);

    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("Oh baby, system garam ho gaya! 🙈 Thora sabar... ❤️", event.threadID, event.messageID);
  }
      }
