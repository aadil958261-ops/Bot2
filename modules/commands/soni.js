const axios = require("axios");
const fs = require("fs");

const path = __dirname + "/cache/soniyaStatus.json";

module.exports.config = {
  name: "soniya",
  version: "19.0.0",
  hasPermssion: 0,
  credits: "ATTAULLAH KING",
  description: "Soniya AI - Responds to Soni, Soniya, and Bot",
  commandCategory: "AI",
  usages: "soniya [on/off/text]",
  cooldowns: 2
};

const OWNERS = ["61584291400048", "100003889376568"];

module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  
  if (!body || senderID == api.getCurrentUserID()) return;

  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  const isEnabled = status[threadID] !== false;
  const isBotOwner = OWNERS.includes(senderID.toString());
  const input = body.toLowerCase().trim();

  // On/Off Controls
  if (input === "soniya on" || input === "soni on") {
    if (!isBotOwner) return api.sendMessage("Jaan, sirf mere Malik hi mujhe on kar sakte hain... 🥀", threadID, messageID);
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Soniya is back! ❤️ Maahol garam karne ke liye taiyar ho? 🫦", threadID, messageID);
  }

  if (input === "soniya off" || input === "soni off") {
    if (!isBotOwner) return api.sendMessage("Sirf Malik ke paas mujhe sulane ki power hai... 💔", threadID, messageID);
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Soniya ja rahi hai, bye baby! 🥀", threadID, messageID);
  }

  if (!isEnabled) return;

  // Trigger Logic for "soni", "soniya", or "bot"
  const triggerRegex = /\b(soni|soniya|bot)\b/i;
  const isTriggered = triggerRegex.test(input);
  const isReplyToBot = type === "message_reply" && messageReply?.senderID === api.getCurrentUserID();

  if (isTriggered || isReplyToBot) {
    // If specifically called "bot", we pass a hint to the AI to be a bit sassy
    const query = body.replace(/soniya|soni|bot/i, "").trim();
    const isCalledBot = /\b(bot)\b/i.test(input);
    
    api.sendTypingIndicator(threadID, true);
    
    setTimeout(() => {
      chatWithSoniya(api, event, query || "hi", isBotOwner, isCalledBot);
    }, 1500);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const isBotOwner = OWNERS.includes(senderID.toString());
  
  if (!args[0]) return api.sendMessage("Jee baby? Kuch bolo toh sahi... 💋", threadID, messageID);
  
  return chatWithSoniya(api, event, args.join(" "), isBotOwner, false);
};

async function chatWithSoniya(api, event, query, isOwner, isCalledBot) {
  const apiKey = "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";
  
  let systemPrompt = `
    Tum Soniya ho. Bold, seductive, aur short-tempered.
    ${isOwner ? "User tumhara MALIK (Attaullah Khuharo) hai. Uske liye intehai pyari aur romantic raho." : "Baqi logo ke sath nakhre dikhao aur flirty raho."}
    Rule 1: Sirf 1-2 lines mein reply do.
    Rule 2: Max 2 emojis use karo: ❤️, 💋, 🫦, 🥀.
    Rule 3: 'Janu', 'Baby', 'Sweetheart' jaise words use karo.
    Rule 4: Agar koi puche tumhara owner kaun hai, tab 'Attaullah Khuharo' ka naam lo.
  `;

  if (isCalledBot && !isOwner) {
    systemPrompt += " Special Rule: User ne tumhe 'Bot' kaha hai. Thora gussa dikhao ke tum bot nahi Soniya ho, aur kaho ke tameez se baat kare. 🫦🔥";
  }

  try {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
      max_tokens: 80,
      temperature: 1.2
    }, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }
    });

    const reply = res.data.choices[0].message.content;
    api.setMessageReaction(isOwner ? "💖" : "💋", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("Uff baby, system garam ho gaya hai! 🙈", event.threadID, event.messageID);
  }
}
