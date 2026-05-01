const axios = require("axios");
const fs = require("fs");

const path = __dirname + "/cache/soniyaStatus.json";

module.exports.config = {
  name: "soniya",
  version: "21.0.0",
  hasPermssion: 0,
  credits: "ATTAULLAH KHUHARO", 
  description: "Soniya AI - Bold, Romantic & Nakhre Wali",
  commandCategory: "AI",
  usages: "soniya [on/off/text]",
  cooldowns: 2
};

const OWNERS = ["61584291400048", "100003889376568"];

module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  
  if (!body || senderID == api.getCurrentUserID()) return;

  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  
  if (status[threadID] === undefined) {
    status[threadID] = false; 
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
  }

  const isEnabled = status[threadID];
  const isBotOwner = OWNERS.includes(senderID.toString());
  const input = body.toLowerCase().trim();

  if (input === "soniya on" || input === "soni on") {
    if (!isBotOwner) return api.sendMessage("Hatt! Sirf mere Malik hi mujhe on kar sakte hain... 💅", threadID, messageID);
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Soniya is back! ❤️ Maahol garam karne ke liye taiyar ho? 🫦", threadID, messageID);
  }

  if (input === "soniya off" || input === "soni off") {
    if (!isBotOwner) return api.sendMessage("Zyada free mat ho, sirf Malik mujhe sula sakte hain... 🙄", threadID, messageID);
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Soniya ja rahi hai, bye baby! 🥀", threadID, messageID);
  }

  if (!isEnabled) return;

  const triggerRegex = /\b(soni|soniya|bot)\b/i;
  const isTriggered = triggerRegex.test(input);
  const isReplyToBot = type === "message_reply" && messageReply?.senderID === api.getCurrentUserID();

  if (isTriggered || isReplyToBot) {
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
  
  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  if (status[threadID] === false && !isBotOwner) return;

  if (!args[0]) return api.sendMessage("Jee baby? Kuch bolo toh sahi... 💋", threadID, messageID);
  
  return chatWithSoniya(api, event, args.join(" "), isBotOwner, false);
};

async function chatWithSoniya(api, event, query, isOwner, isCalledBot) {
  const apiKey = "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";
  
  let systemPrompt = `
    Tum Soniya ho. Intehai nakhre wali, bold, aur seductive. 
    ${isOwner ? "User tumhara MALIK (Attaullah Khuharo) hai. Uske liye intehai pyari aur romantic raho. Agar wo romance kare toh tum bhi puri tarah respond karo aur khud ko mat roko. Uske sath extreme flirty raho." : "Baqi logo ko nakhre dikhao aur attitude do, lekin agar koi larka tareef kare toh flirty ho jao."}
    
    Rule 1: Jawab chota aur seductive rakho (1-2 lines).
    Rule 2: Max 2 emojis use karo: 🫦, 💋, 🔥, 🥀.
    Rule 3: 'Jaanu' aur 'Baby' sirf Malik ko kaho.
    Rule 4: Agar maahol romantic ho toh nakhre khatam karke pura sath do.
    Rule 5: Owner ka naam 'Attaullah Khuharo' lo.
  `;

  if (isCalledBot && !isOwner) {
    systemPrompt += " Special Rule: User ne tumhe 'Bot' kaha hai. Use batao ke tum bot nahi Soniya ho, aur tameez se baat kare warna ignore kar dogi. 💅🔥";
  }

  try {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
      max_tokens: 150,
      temperature: 1.3 // Mazeed creative aur bold responses ke liye temperature badhaya hai
    }, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }
    });

    const reply = res.data.choices[0].message.content;
    api.setMessageReaction(isOwner ? "💖" : "🫦", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("Uff, mera mood kharab ho gaya... 🙄 Thori dair baad aana! 💅", event.threadID, event.messageID);
  }
  }
      
