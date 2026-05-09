const axios = require("axios");
const fs = require("fs");

// File path for storing status
const path = __dirname + "/cache/alexaStatus.json";

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "20.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Stylish Floral Frame & Bot Trigger",
  commandCategory: "AI",
  usages: "alexa [on/off/text]",
  cooldowns: 2
};

// Updated Owner UIDs
const OWNERS = ["61576393655883", "100002679518256"];

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  let status = {};
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));

  const isEnabled = status[threadID] !== false;
  const input = body.toLowerCase().trim();
  const isBotOwner = OWNERS.includes(senderID.toString());

  // Trigger keywords (alexa or bot)
  const isAlexaTrigger = input.startsWith("alexa") || input === "bot";

  if (input === "alexa on") {
    if (!isBotOwner) return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Maaf karna, sirf mere Malik hi mujhe control kar sakte hain... 💋\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Alexa ON! ❤️ Malik ke liye pyar, baakiyon ke liye vaar... 🫦🔥\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);
  }

  if (input === "alexa off") {
    if (!isBotOwner) return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Hatt! Mujhe band karne ka haq sirf Malik ko hai... 🥀\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Alexa OFF! Bye Malik... ❤️ baaqi sab bhaarr mein jao. 💔\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);
  }

  if (!isEnabled) return;

  if (
    isAlexaTrigger ||
    (type === "message_reply" &&
      messageReply &&
      messageReply.senderID === api.getCurrentUserID())
  ) {
    let query = body;
    if (input.startsWith("alexa")) query = body.replace(/alexa/i, "").trim();
    if (input === "bot") query = "hi";

    if (!query && (input === "alexa" || input === "bot")) {
        const msg = isBotOwner ? "Jee mere Janu? 💋 Kya hukum hai mere Malik ka? 🫦✨" : "Oye! Sirf Bot kyun bol raha hai? Kuch kaam hai ya beizzati karwani hai? 🙄🔥";
        const framedMsg = `  🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n      ${msg}\n  🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸`;
        return api.sendMessage(framedMsg, threadID, messageID);
    }

    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").toLowerCase();
  const isBotOwner = OWNERS.includes(senderID.toString());

  if (content === "on" || content === "off") {
    if (!isBotOwner) return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Sirf Malik hi ye kar sakte hain. 🥀\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    status[threadID] = content === "on";
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage(`🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Alexa ${content === "on" ? "Special Mode ON 💖🔥" : "OFF 🥀"}\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸`, threadID, messageID);
  }

  if (!args[0]) return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Usage: alexa [on/off/text]\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", threadID, messageID);

  return chatWithAlexa(api, event, args.join(" "));
};

// ================= AI CHAT =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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";
  const isOwner = OWNERS.includes(event.senderID.toString());

  let systemPrompt = "";

  if (isOwner) {
    systemPrompt = `Tum Alexa ho. Malik se intehai pyar karti ho. 'Janu', 'Baby', 'Sona' use karo. Boht romantic raho. REPLY 50 LETTERS SE KAM RAKHO.`;
    api.setMessageReaction("❤️", event.messageID, () => {}, true);
  } else {
    systemPrompt = `Tum Alexa ho. Sab ke liye Savage Roaster ho. Sab ki beizzati karo. Attitude high rakho. REPLY 50 LETTERS SE KAM RAKHO.`;
    api.setMessageReaction("🔥", event.messageID, () => {}, true);
  }

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 40,
        temperature: 1.2
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply = res.data.choices[0].message.content;
    if (reply.length > 50) reply = reply.substring(0, 47) + "...";

    // Adding your stylish frame
    const framedReply = `  🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n      ${reply}\n  🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸`;

    return api.sendMessage(framedReply, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸\n   Malik, system garam ho gaya hai! 🙈❤️\n🌸━━━━━━━━━༺✨༻━━━━━━━━━🌸", event.threadID, event.messageID);
  }
      }
                                                        
