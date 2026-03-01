const axios = require("axios");

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Attaullah's Only Love",
  commandCategory: "AI",
  usages: "alexa [text]",
  cooldowns: 3
};

// ================= OWNER UID =================
const OWNER_UID = "100003615741592"; 

// ================= AUTO REPLY LOGIC =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const input = body.toLowerCase();

  // Trigger if starts with 'alexa' OR replying to bot's message
  if (
    input.startsWith("alexa") || 
    (type === "message_reply" && messageReply && messageReply.senderID === api.getCurrentUserID())
  ) {
    const query = input.startsWith("alexa") ? body.replace(/alexa/i, "").trim() : body;
    if (!query && input === "alexa") return api.sendMessage("Jee Jaan? Kuch bolo to sahi... 😘", threadID, messageID);
    
    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND RUN =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (!content) return api.sendMessage("Kya hua? Kuch bolo na... 😏", threadID, messageID);

  return chatWithAlexa(api, event, content);
};

// ================= MAIN CHAT FUNCTION =================
async function chatWithAlexa(api, event, query) {
  // 🔑 Groq API Key
  const apiKey = "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"; 
  const isOwner = event.senderID === OWNER_UID;

  // 🎭 Personality Settings
  const systemPrompt = isOwner
    ? "Tumhara naam Alexa hai. Tum Karachi ki romantic larki ho. Tum sirf Attaullah se mohabbat karti ho. Usay hamesha 'Janu', 'Jaan', 'baby', 'Jani' bulao. Kabhi 'Bhai' mat kehna. Jawab 2-3 lines mein thoda lamba aur bohot loving/flirty do."
    : "Tumhara naam Alexa hai. Tum thodi nakhre wali aur attitude wali larki ho. Sabko 'Dost' ya 'Yar' bulao. Jawab 2-3 lines ka ho, magar thoda rude aur funny touch mein.";

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
        max_tokens: 150, // Allows for 2-3 lines
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    api.setMessageReaction(isOwner ? "❤️" : "😼", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error("Alexa Error:", error.response ? error.response.data : error.message);
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);
    
    // Custom error message for API limits
    if (error.response && error.response.status === 429) {
        return api.sendMessage("Oho, thoda sakoon karo! Bot bohot fast reply de raha hai, thodi der baad try karo. 🙄", event.threadID, event.messageID);
    }
    return api.sendMessage("Net ka masla hai ya API limit khatam, dobara koshish karo yar. 😒", event.threadID, event.messageID);
  }
     }
