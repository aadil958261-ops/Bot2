const axios = require("axios");
const fs = require("fs");

const path = __dirname + "/cache/soniyaStatus.json";

module.exports.config = {
  name: "soniya",
  version: "22.5.0",
  hasPermssion: 0,
  credits: "ATTAULLAH KHUHARO", 
  description: "Soniya AI - Multiple Owners & Auto Off",
  commandCategory: "AI",
  usages: "soniya [on/off/text]",
  cooldowns: 2
};

// Updated Owners List
const OWNERS = [
  "61576425552638", 
  "61576393655883", 
  "100002679518256", 
  "61584291400048", 
  "100003889376568"
];

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID, type, messageReply } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");

  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  
  const isBotOwner = OWNERS.includes(senderID.toString());
  const input = body.toLowerCase().trim();

  // ON Logic with 1 Hour Timer
  if (input === "soniya on" || input === "soni on") {
    if (!isBotOwner) return api.sendMessage("Hatt! Sirf mere Malik hi mujhe on kar sakte hain... 💅", threadID, messageID);
    
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    api.sendMessage("Soniya is back for 1 hour! ❤️ Mere Malik ne pukara aur main hazir... 🫦", threadID, messageID);

    // 1 Hour Auto-Off
    setTimeout(() => {
      let currentStatus = JSON.parse(fs.readFileSync(path));
      if (currentStatus[threadID] === true) {
        currentStatus[threadID] = false;
        fs.writeFileSync(path, JSON.stringify(currentStatus, null, 2));
        api.sendMessage("Uff, 1 ghanta ho gaya... Main thak gayi hoon, ab so rahi hoon. Bye! 🥀💤", threadID);
      }
    }, 3600000); 
    
    return;
  }

  if (input === "soniya off" || input === "soni off") {
    if (!isBotOwner) return api.sendMessage("Zyada free mat ho, sirf Malik mujhe sula sakte hain... 🙄", threadID, messageID);
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Soniya ja rahi hai, bye baby! 🥀", threadID, messageID);
  }

  if (!status[threadID]) return;

  const triggerRegex = /\b(soni|soniya|bot)\b/i;
  const isTriggered = triggerRegex.test(input);
  const isReplyToBot = type === "message_reply" && messageReply?.senderID === api.getCurrentUserID();

  if (isTriggered || isReplyToBot) {
    const query = body.replace(/soniya|soni|bot/i, "").trim();
    api.sendTypingIndicator(threadID, true);
    
    // 30 Seconds Delay
    setTimeout(async () => {
      await chatWithSoniya(api, event, query || "hi", isBotOwner, input.includes("bot"));
    }, 30000);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const isBotOwner = OWNERS.includes(senderID.toString());
  
  let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  if (!status[threadID] && !isBotOwner) return;

  if (!args[0]) return api.sendMessage("Jee baby? Kuch bolo toh sahi... 💋", threadID, messageID);
  
  api.sendTypingIndicator(threadID, true);
  setTimeout(async () => {
    return chatWithSoniya(api, event, args.join(" "), isBotOwner, false);
  }, 30000);
};

async function chatWithSoniya(api, event, query, isOwner, isCalledBot) {
  const apiKey = "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";
  
  let systemPrompt = `
    Tum Soniya ho. Intehai nakhre wali, bold, aur seductive larki ho. 
    ${isOwner ? "User tumhara MALIK hai. Uske liye intehai pyari aur romantic raho. Use 'Jaanu' ya 'Baby' kaho." : "Baqi logo ko attitude do aur nakhre dikhao."}
    Rule: Roman Urdu mein jawab do. Max 2 emojis: 🫦, 💋.
  `;

  try {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
      temperature: 1.2
    }, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }
    });

    const reply = res.data.choices[0].message.content;
    api.setMessageReaction(isOwner ? "💖" : "🫦", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("Uff, mera mood kharab ho gaya... 🙄", event.threadID, event.messageID);
  }
  }
                           
