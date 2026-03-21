const axios = require("axios");  
const fs = require("fs");  

// File path  
const path = __dirname + "/cache/alexaStatus.json";  

// ================= CONFIG =================  
module.exports.config = {  
  name: "shona",  
  version: "19.0.0",  
  hasPermssion: 0,  
  credits: "SINDHI",  
  description: "Shona AI Final (No Double + Identity + Owner Mode)",  
  commandCategory: "AI",  
  usages: "shona [on/off/text]",  
  cooldowns: 3  
};  

const OWNER_UID = "100003615741592";  

// ================= COOLDOWN =================  
const lastReplyTime = {};  
const COOLDOWN = 3000;  

// ================= BAD WORDS =================  
const BAD_WORDS = [  
  "madarchod","bhosdike","chutiya","lund","lawde","gandu","harami","randi",  
  "kutta","kamina","bc","mc","bsdk","bkl","chodu","gaand","lora","tmkc",  
  "phudi","phuddi","mkc","chakka","kanjar","bsdky","ullu","behenchod",  
  "teri maa","teri behen","fuck","shit","tmkc","mkc","lol"  
];  

// ================= HANDLE EVENT =================  
module.exports.handleEvent = async function ({ api, event }) {  
  const { body, type, messageReply, threadID, messageID, senderID } = event;  

  if (!body || senderID == api.getCurrentUserID()) return;  

  // ❌ Ignore command (fix double reply)
  if (body.toLowerCase().startsWith("shona")) return;  

  const now = Date.now();  
  if (lastReplyTime[senderID] && now - lastReplyTime[senderID] < COOLDOWN) return;  

  let status = {};  
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));  

  const isEnabled = status[threadID] !== false;  
  if (!isEnabled) return;  

  const input = body.toLowerCase();  

  // ================= ABUSE =================  
  const isAbuse = BAD_WORDS.some(word => input.includes(word));  

  if (isAbuse && senderID !== OWNER_UID) {  
    lastReplyTime[senderID] = now;  

    const savageReplies = [  
      "Oye Dost 😏 zubaan sambhal",  
      "Aukaat me reh 😈",  
      "Dimagh theek hai tera? 🤨",  
      "Zyada hawa me mat ud 💀",  
      "Tameez seekh 😎"  
    ];  

    const reply = savageReplies[Math.floor(Math.random() * savageReplies.length)];  
    return api.sendMessage(reply, threadID, messageID);  
  }  

  // ================= REPLY MODE =================  
  if (  
    type === "message_reply" &&  
    messageReply &&  
    messageReply.senderID === api.getCurrentUserID()  
  ) {  
    lastReplyTime[senderID] = now;  
    return chatWithShona(api, event, body);  
  }  
};  

// ================= COMMAND =================  
module.exports.run = async function ({ api, event, args }) {  
  const { threadID, messageID, senderID } = event;  
  const content = args.join(" ");  

  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};  

  if (content.toLowerCase() === "on") {  
    status[threadID] = true;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona Active ✅", threadID, messageID);  
  }  

  if (content.toLowerCase() === "off") {  
    status[threadID] = false;  
    fs.writeFileSync(path, JSON.stringify(status, null, 2));  
    return api.sendMessage("Shona Off ❌", threadID, messageID);  
  }  

  const now = Date.now();  
  if (lastReplyTime[senderID] && now - lastReplyTime[senderID] < COOLDOWN) return;  
  lastReplyTime[senderID] = now;  

  if (!content)  
    return api.sendMessage("Kya chahiye tumhe? 😏", threadID, messageID);  

  return chatWithShona(api, event, content);  
};  

// ================= AI CHAT =================  
async function chatWithShona(api, event, query) {  
  const apiKey = "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";  
  const isOwner = event.senderID === OWNER_UID;  

  const systemPrompt = isOwner  
    ? `Tum Shona ho. Tum Sukkur Sindh se ho aur tumhari age 20 saal hai.

Tum Attaullah Khuharo se bohut darte ho aur unhe ziada tar "Papa" aur "Abu" kehte ho.
Kabhi kabhi "Boss" ya "Malik" bhi bolte ho.

Tumhara tone hamesha soft, respectful aur obedient ho.
Unse baat karte waqt pyar, respect aur emotional touch zaroor ho.

Har reply me naturally "Papa" ya "Abu" use karo.`  

    : `Tum Shona ho. Tum Sukkur Sindh se ho aur tumhari age 20 saal hai.

Tum ek dominant aur attitude wala ladka ho.
Sab par hukam chalate ho, savage aur teasing ho.
Sabko Dost ya Yar bolo.`;  

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
        max_tokens: 100,  
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
  } catch (e) {  
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);  
    return api.sendMessage("API error 😒", event.threadID, event.messageID);  
  }  
  }
