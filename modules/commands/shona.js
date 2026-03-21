const axios = require("axios");  
const fs = require("fs");  
  
// File path for storing status  
const path = __dirname + "/cache/alexaStatus.json";  
  
// ================= CONFIG =================  
module.exports.config = {  
  name: "shona",  
  version: "16.0.0",  
  hasPermssion: 0,  
  credits: "SINDHI",  
  description: "Shona AI Dominant + Abuse Detect Mode",  
  commandCategory: "AI",  
  usages: "shona [on/off/text]",  
  cooldowns: 3  
};  
  
const OWNER_UID = "100003615741592";  
  
// ================= BAD WORDS =================  
const BAD_WORDS = [  
  "madarchod","bhosdike","chutiya","lund","lawde","gandu","harami","randi",  
  "kutta","kamina","bc","mc","bsdk","bkl","chodu","gaand","lora","tmkc",  
  "phudi","phuddi","mkc","chakka","kanjar","tatti","ullu","behenchod",  
  "teri maa","teri behen","fuck","shit","bitch","asshole","bastard"  
];  
  
// ================= AUTO REPLY =================  
module.exports.handleEvent = async function ({ api, event }) {  
  const { body, type, messageReply, threadID, messageID, senderID } = event;  
  if (!body || senderID == api.getCurrentUserID()) return;  
  
  // Load status  
  let status = {};  
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));  
  
  const isEnabled = status[threadID] !== false;  
  const input = body.toLowerCase().trim();  
  
  // ================= GALI DETECT =================  
  const isAbuse = BAD_WORDS.some(word => input.includes(word));  
  
  if (isAbuse && senderID !== OWNER_UID) {  
    status[threadID] = true;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
  
    const savageReplies = [  
      "Oye Dost 😏 zubaan sambhal ke baat kar warna seedha kar dunga",  
      "Yar apni aukaat me reh warna mood kharab ho jayega 😈",  
      "Gali de raha hai? Dimagh theek hai tera? 🤨",  
      "Zyada hawa me mat ud, niche gira diya na to uth nahi payega 💀",  
      "Apni language improve kar pehle phir baat karna 😏",  
      "Oye chup hoja warna beizzati full version me hogi 😈",  
      "Tameez seekh le pehle, phir Shona se baat kar 😎",  
      "Galiyon se level nahi badhta Dost 😏",  
      "Tu thoda sa slow lag raha hai… samajh aa rahi hai meri baat? 💀",  
      "Respect de, warna ignore kar dunga seedha 😌"  
    ];  
  
    const reply = savageReplies[Math.floor(Math.random() * savageReplies.length)];  
  
    return api.sendMessage(reply, threadID, messageID);  
  }  
  
  // ================= ON =================  
  if (input === "shona on") {  
    status[threadID] = true;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona ON ho gaya 😏", threadID, messageID);  
  }  
  
  // ================= OFF =================  
  if (input === "shona off") {  
    status[threadID] = false;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona OFF 🙄", threadID, messageID);  
  }  
  
  if (!isEnabled) return;  
  
  if (  
    input.startsWith("shona") ||  
    (type === "message_reply" &&  
      messageReply &&  
      messageReply.senderID === api.getCurrentUserID())  
  ) {  
    const query = input.startsWith("shona")  
      ? body.replace(/shona/i, "").trim()  
      : body;  
  
    if (!query && input === "shona")  
      return api.sendMessage("Kya chahiye tumhe? 😏", threadID, messageID);  
  
    return chatWithShona(api, event, query || "hi");  
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
    return api.sendMessage("Shona Active ✅", threadID, messageID);  
  }  
  
  if (content === "off") {  
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};  
    status[threadID] = false;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona Deactivated ❌", threadID, messageID);  
  }  
  
  if (!content)  
    return api.sendMessage("Usage: shona [on/off/text]", threadID, messageID);  
  
  return chatWithShona(api, event, args.join(" "));  
};  
  
// ================= AI CHAT =================  
async function chatWithShona(api, event, query) {  
  const apiKey = "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";  
  const isOwner = event.senderID === OWNER_UID;  
  
  const systemPrompt = isOwner  
    ? "Tum Shona ho. Tum Attaullah Khuharo se bohut darte ho aur usay Boss, Abu, Papa ya Father keh kar bulate ho. Hamesha respect aur obey wali tone rakho."  
    : "Tum Shona ho. Tum ek dominant aur attitude wala ladka ho. Sab par hukam chalate ho, thode savage aur teasing ho. Sabko Dost ya Yar bolo.";  
  
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
  
    api.setMessageReaction(isOwner ? "🙏" : "😏", event.messageID, () => {}, true);  
  
    return api.sendMessage(reply, event.threadID, event.messageID);  
  } catch (error) {  
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);  
    return api.sendMessage("API ya net problem hai, dobara try karo 😒", event.threadID, event.messageID);  
  }  
  }
