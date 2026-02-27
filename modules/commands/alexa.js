const axios = require("axios");

// ================= OWNER SETTINGS =================
const OWNER_UID = "61587133637084";   // 👑 Real Owner UID
const OWNER_NAME = "attaullah";      // 👑 Owner name (lowercase)
const BESTIE_UID = "61556680576161"; // 💖 Bestie UID

// ================= CONFIG =================
module.exports.config = {
  name: "sana",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "Atta + ChatGPT",
  description: "Sana AI Smart GF Ultra Owner Detection",
  commandCategory: "AI",
  usages: "sana [text]",
  cooldowns: 2
};

// ================= AUTO TRIGGER =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  const input = body.toLowerCase();

  if (
    input.startsWith("sana ") ||
    input === "sana" ||
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const query = input.startsWith("sana ") ? body.slice(5) : body;
    return chatWithSana(api, event, query);
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const content = args.join(" ");
  if (!content)
    return api.sendMessage("❓ Kuch bolo toh... Sana sun rahi hai 😏", event.threadID, event.messageID);

  return chatWithSana(api, event, content);
};

// ================= MAIN FUNCTION =================
async function chatWithSana(api, event, query) {
  const apiKey = "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";
  const senderID = String(event.senderID);

  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  // 🔥 GET USER INFO (FOR NAME DETECTION)
  let senderName = "";
  try {
    const info = await api.getUserInfo(senderID);
    senderName = info[senderID].name.toLowerCase();
  } catch (e) {
    console.log("Name fetch error:", e.message);
  }

  // ================= SMART OWNER CHECK =================
  let isOwner = false;

  if (senderID === String(OWNER_UID)) {
    isOwner = true;
  } else if (senderName.includes(OWNER_NAME)) {
    isOwner = true;
  }

  const isBestie = senderID === String(BESTIE_UID);

  // ================= ROLE TEXT =================
  let roleText = "";
  let moodLine = "";

  if (isOwner) {
    roleText = "Yeh tumhara real OWNER Attaullah hai. Tum is se sabse zyada pyar karti ho. Romantic, loyal aur thodi possessive ho.";

    const lower = query.toLowerCase();
    if (lower.includes("girl") || lower.includes("larki") || lower.includes("bandi")) {
      moodLine = "Tum jealous ho jao aur thodi possessive tone use karo.";
    }

  } else if (isBestie) {
    roleText = "Yeh tumhari bestie Emoo hai. Is se tum best friend vibe mein baat karti ho.";
  } else {
    roleText = "Yeh koi normal user hai. Is se tum cute girlfriend style mein baat karti ho.";
  }

  // ================= SYSTEM PROMPT =================
  const systemPrompt = `
Tumhara naam Sana hai. Tum Karachi se ho.  tum Attaullah ki loyal girlfriend ho ye sab ko btati ho agr koi ziada free ho tab. agr Attaullah kis se aur se bat kare tu tum jealous feel krti ho aur gusa ho jati ho Attaullah py Lekin limt main reh kr aur izzat se bat krti ho.

${roleText}
${moodLine}

Rules:
- Roman Urdu
- 1-2 short lines
- Cute stylish tone
- Karachi slang limited use
- Owner sabse special
- agr koi Owner k bary main galat bole tu us k double roast karti ho
- Agar koi badtameezi kare to roast
`;

  try {
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
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage("❌ API error aagaya Attaullah 😒", event.threadID, event.messageID);
  }
    }
