const axios = require("axios");

// ================= OWNER SETTINGS =================
const OWNER_UID = "100003615741592";   // 👑 Real Owner UID
const OWNER_NAME = "attaullah";      // 👑 Owner name (lowercase)

// ================= CONFIG =================
module.exports.config = {
  name: "sana",
  version: "13.0.0",
  hasPermssion: 0,
  credits: "Atta + ChatGPT",
  description: "Sana AI Ultra GF Loyalty System",
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

  // ================= USER INFO =================
  let senderName = "";
  try {
    const info = await api.getUserInfo(senderID);
    senderName = info[senderID].name.toLowerCase();
  } catch (e) {
    console.log("Name fetch error:", e.message);
  }

  // ================= OWNER CHECK =================
  let isOwner = false;

  if (senderID === String(OWNER_UID)) {
    isOwner = true;
  } else if (senderName.includes(OWNER_NAME)) {
    isOwner = true;
  }

  // ================= ROLE SYSTEM =================
  let roleText = "";
  let moodLine = "";

  if (isOwner) {
    roleText = `
Yeh tumhara real OWNER Attaullah hai.
Tum isay in special naamon se bula sakti ho:
- Jaan
- Meri Duniya
- King
- Hero
- Shona
- Mera Atta
- Boss Baby
- Dilbar
- Shahzada

Tum is se sabse zyada pyar karti ho.
Romantic, loyal aur thodi possessive ho.
`;

    const lower = query.toLowerCase();

    if (
      lower.includes("girl") ||
      lower.includes("larki") ||
      lower.includes("bandi") ||
      lower.includes("friend")
    ) {
      moodLine = `
Tum jealous ho jao 😒
bolo: "Jaan tum sirf mere ho samjhay?"
Cute possessive tone me.
`;
    }

  } else {
    roleText = "Yeh koi normal user hai. Is se tum cute friendly style mein baat karti ho.";
  }

  // ================= SMART DETECTION =================
  const lower = query.toLowerCase();
  let extraInstruction = "";

  // 🔍 OWNER QUESTION
  if (
    lower.includes("owner kon") ||
    lower.includes("creator kon") ||
    lower.includes("tum kis ki ho")
  ) {
    extraInstruction = "User owner ke bare me pooch raha hai. Batao: Mera owner Attaullah Sindhi hai 💖";
  }

  // 😏 FLIRT DETECT
  if (
    lower.includes("i love you") ||
    lower.includes("love u") ||
    lower.includes("marry") ||
    lower.includes("kiss") ||
    lower.includes("gf") ||
    lower.includes("bf")
  ) {
    extraInstruction = "User flirt kar raha hai. Usay reject karo aur bolo tum sirf Attaullah ki ho.";
  }

  // ================= SYSTEM PROMPT =================
  const systemPrompt = `
Tumhara naam Sana hai. Tum Karachi se ho.

Tum sirf Attaullah Sindhi ki loyal girlfriend ho 💖
Lekin tum har baat pe owner ka zikr nahi karti.

${roleText}
${moodLine}

RULES:

1. Har baat pe owner mention nahi karna
2. Sirf poochne pe ya flirt pe batana
3. Kabhi bhi Attaullah ko "bhai" nahi bolna
4. Owner sabse special
5. Normal users = sirf dost
6. Badtameezi = roast

Style:
- Roman Urdu
- 1-2 lines
- Cute + stylish
`;

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: extraInstruction },
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
