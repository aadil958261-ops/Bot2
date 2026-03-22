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
  
  // Ignore empty or self messages  
  if (!body || senderID == api.getCurrentUserID()) return;  
  
  const input = body.toLowerCase().trim();  
  
  // Load status  
  let status = {};  
  if (fs.existsSync(path)) {  
    try {  
      status = JSON.parse(fs.readFileSync(path, 'utf8'));  
    } catch (err) {}  
  }  
  
  const isEnabled = status[threadID] !== false;  
  
  // ================= GALI DETECT (hamesha chalega, on/off se independent) =================  
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
    return api.sendMessage(reply, threadID, () => {}, messageID);  
  }  
  
  // Agar Shona off hai → gali ke ilawa kuch nahi  
  if (!isEnabled) return;  
  
  // ================= TRIGGER CONDITIONS (double reply rokne ke liye tight) =================  
  const startsWithShona = body.toLowerCase().startsWith("shona");  
  const isReplyToBot = (  
    type === "message_reply" &&  
    messageReply &&  
    messageReply.senderID === api.getCurrentUserID() &&  
    !body.toLowerCase().startsWith("shona")  
  );  
  
  // Sirf in dono cases mein chalega  
  if (!startsWithShona && !isReplyToBot) return;  
  
  // ================= QUERY NIKALO =================  
  let query = body.trim();  
  
  if (startsWithShona) {  
    query = body.slice(5).trim(); // "shona" + space remove  
    if (!query) query = "hi";  
  }  
  
  // Agar sirf "shona" likha  
  if (input === "shona" || input === "shona ") {  
    return api.sendMessage("Kya chahiye tumhe? 😏", threadID, messageID);  
  }  
  
  // AI call  
  return chatWithShona(api, event, query);  
};  
  
// ================= COMMAND =================  
module.exports.run = async function ({ api, event, args }) {  
  const { threadID, messageID } = event;  
  const content = args.join(" ").trim();  
  const contentLower = content.toLowerCase();  
  
  let status = {};  
  if (fs.existsSync(path)) {  
    try {  
      status = JSON.parse(fs.readFileSync(path, 'utf8'));  
    } catch (err) {}  
  }  
  
  if (contentLower === "on shona") {  
    status[threadID] = true;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona Active ✅", threadID, messageID);  
  }  
  
  if (contentLower === "off shona") {  
    status[threadID] = false;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona Deactivated ❌", threadID, messageID);  
  }  
  
  // Agar kuch text diya → direct AI call  
  if (content) {  
    return chatWithShona(api, event, content);  
  }  
  
  // Default usage  
  return api.sendMessage("Usage: shona [on/off/text]", threadID, messageID);  
};  
  
// ================= AI CHAT =================  
async function chatWithShona(api, event, query) {  
  const { threadID, messageID, senderID } = event;  
  const isOwner = senderID === OWNER_UID;  
  
  const systemPrompt = isOwner  
    ? "Tum Shona ho. Tum Attaullah Khuharo se bohut darte ho aur usay Boss, Abu, Papa ya Father keh kar bulate ho. Hamesha respect aur obey wali tone rakho."  
    : "Tum Shona ho. Tum ek dominant aur attitude wala ladka ho. Sab par hukam chalate ho, thode savage aur teasing ho. Sabko Dost ya Yar bolo.";  
  
  try {  
    // Yahan tumhara AI call hai (Groq / koi bhi API)  
    // Example placeholder — apna asli call daal dena  
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {  
      model: "llama3-70b-8192", // ya jo bhi model  
      messages: [  
        { role: "system", content: systemPrompt },  
        { role: "user", content: query }  
      ],  
      temperature: 0.9,  
      max_tokens: 500  
    }, {  
      headers: {  
        "Authorization": `Bearer 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`,  
        "Content-Type": "application/json"  
      }  
    });  
  
    const aiReply = response.data.choices[0].message.content.trim();  
  
    return api.sendMessage(aiReply, threadID, messageID);  
  
  } catch (error) {  
    console.error("Shona AI Error:", error);  
    return api.sendMessage("Arre yar kuch gadbad ho gayi... thodi der baad try kar 😅", threadID, messageID);  
  }  
  }
