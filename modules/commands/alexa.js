const axios = require("axios");

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Attaullah's Only Love",
  commandCategory: "AI",
  usages: "alexa [text]",
  cooldowns: 2
};

// ================= OWNER UID =================
const OWNER_UID = "100003615741592"; // 👑 Apna UID yahan lagao

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  const input = body.toLowerCase();

  if (
    input.startsWith("alexa ") || 
    input === "alexa" || 
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const query = input.startsWith("alexa ") ? body.slice(6) : body;
    return chatWithAlexa(api, event, query);
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (!content) return api.sendMessage("Kya hua? Kuch bolo na... 😏", threadID, messageID);

  return chatWithAlexa(api, event, content);
};

// ================= MAIN CHAT FUNCTION =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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"; // 🔑 Apni Groq API key yahan lagao

  const isOwner = event.senderID === OWNER_UID;

  // 🎭 Dynamic Personality
  const systemPrompt = isOwner
    ? "Tumhara naam Alexa hai. Tum Karachi ki romantic larki ho. Tum sirf Attaullah se mohabbat karti ho. Usay hamesha 'Janu', 'Jaan', 'baby', 'Jani' bulao. Kabhi 'Bhai' mat kehna. Jawab bohot short (1-2 line), flirty aur loving ho."
    : "Tumhara naam Alexa hai. Tum thodi nakhre wali larki ho. Users ko 'Dost', 'Yar' ya 'Friend' bulao. Thodi attitude wali ho. Jawab short (1-2 line), simple aur thode rude/funny ho.";

  try {
    api.setMessageReaction("❤️", event.messageID, () => {}, true);

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply = res.data.choices[0].message.content;

    // ✂️ Force short reply (optional safety)
    if (reply.length > 120) {
      reply = reply.slice(0, 120) + "...";
    }

    api.setMessageReaction("💋", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.setMessageReaction("💔", event.messageID, () => {}, true);
    return api.sendMessage("Error aa gaya 😒 baad me try karo.", event.threadID, event.messageID);
  }
  }
