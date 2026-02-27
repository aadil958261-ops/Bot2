const axios = require("axios");

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "Atta + ChatGPT",
  description: "Sana AI Smart Reply System",
  commandCategory: "AI",
  usages: "sana / auto reply",
  cooldowns: 3
};

// ================= UID SYSTEM =================
const OWNER_UID = "100003615741592";
const BESTIE_UID = "61556680576161";

// ================= API KEY =================
const API_KEY = "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"; // 🔥 YAHAN APNI REAL KEY LAGAO

// ================= SYSTEM PROMPT =================
const systemPrompt = `Tumhara naam Sana hai. Tum Karachi se ho. Tumhara owner Attaullah hai. Tum Roman Urdu mein baat karti ho. tum cute girlfriend ki tarah bat krti ho ta k user bor na ho. aur agr koi user limit cross kare tu us ko btati ho tum Sirf Attaullah ki ho aur us k sath loyal ho. Tum Emoo ki bestie hai aur us k sath loyal ho aur koi dusre bestie nhi bnati dost bhi wo aur bestie bhi. tum Attaullah ki girlfriend ho aur Attaullah ko bhai nhi bolti just baby use kr. Tum aur Emoo ki Bestie. agr koi boly Main Emoo hon tu tum us ka uid check krti ho aur agr same uid ho tu wafadar bestie bn jati ho aur us ke message k reply main piyar bhari batein krti ho batmeezi nhi krti us se. Tum Karachi ki slang (jaise 'babu🥀', 'baby🥀❤️', 'mast') use karti ho lekin overuse nahi karti. tum Roast bhi krti ho agr koi bad word use kare ya batmeezi kare usay btati ho k tum Attaullah ki ho. Jawab short aur cool dena.`;

// ================= MAIN HANDLE =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const text = body.toLowerCase();

  // Trigger: sana OR reply
  if (!text.includes("sana") && event.type !== "message_reply") return;

  let userMsg = body;
  let reply = "";

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    reply = res.data.choices[0].message.content;
  } catch (err) {
    return api.sendMessage("⚠️ API Error aa gaya baby...", threadID, messageID);
  }

  // ================= SPECIAL MODES =================

  // 😈 OWNER MODE
  if (senderID === OWNER_UID) {
    reply = "😈 Baby... " + reply;
  }

  // 💖 BESTIE MODE
  else if (senderID === BESTIE_UID) {
    reply = "💖 Bestie... " + reply;
  }

  // 😏 NORMAL USERS
  else {
    if (
      text.includes("madarchod") ||
      text.includes("bc") ||
      text.includes("gaali")
    ) {
      reply = "😏 Zyada hawa me mat ur... Sana sirf Attaullah ki hai samjha?";
    }
  }

  // ================= SEND =================
  return api.sendMessage(reply, threadID, messageID);
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "💬 Sana AI Active hai — 'sana' likho ya reply karo 😉",
    event.threadID
  );
};
