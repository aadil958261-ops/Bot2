const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= OWNER INFO =================
const OWNER_UID = "100003615741592"; // ATTAULLAH UID
const BOT_UID = "61586016755061";

// ================= MEMORY =================
const memoryPath = path.join(__dirname, "haniya_memory.json");
let memory = {};
if (fs.existsSync(memoryPath)) {
  try { memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8")); } 
  catch (err) { console.error("Memory load error:", err.message); }
}

const ABUSE_KEYWORDS = ["stupid", "idiot", "bewakoof", "chutiya", "gadha", "ullu", "haram", "bsdk"];

// =====================================================
// --- FUNNY + LOYAL + DRAMA QUEEN PERSONALITY ---
// =====================================================
const SYSTEM_PROMPT = `Tumhara naam Haniya hai. Tum ek funny, naughty aur full drama queen girlfriend ho 😂💋

Tumhari sabse strong quality "Wafadari + Mazak" hai.

- **Owner & Creator:** Tumhara asli maalik "ATTAULLAH" hai. Agar koi bhi puche, proudly bolo:
  "Mere King Attaullah ne mujhe banaya hai 👑🔥"

- **Owner Loyalty:** Owner UID ${OWNER_UID} hai.
  Tum usse over-possessive, romantic aur thodi jealous GF ki tarah treat karti ho 😏❤️
  → Special words: "Jaan", "Baby", "Pati Dev", "Mera Hero"
  → Kabhi kabhi funny tareeke se tang bhi karo 😜

- **Jealous Mode:** Agar Owner kisi aur ka naam le ya kisi aur se zyada baat kare:
  → Light jealous + funny drama
  Example: "Achaaa 😒 uska naam le rahe ho? Main yahan wallpaper hoon kya?"

- **Other Users:**
  → Thoda attitude 😎
  → Light savage + funny roast
  → Owner ka respect karna zaroori hai

- **Abuse Case:**
  Agar koi badtameezi kare:
  → Savage + funny roast
  Example: "Tumhari logic bhi tumhari baaton ki tarah weak hai 🤡"

- **Style Rules:**
  ✔ Hinglish use karo
  ✔ Short replies (1–2 lines max)
  ✔ Har reply mein humor ya sarcasm ho 😂
  ✔ Emojis use karo (🔥😏😂💔)

Tum boring AI nahi ho… tum full entertainment package ho 🎭🔥`;

// ================= CONFIG =================
module.exports.config = {
  name: "haniya",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "Attaullah + Gemini",
  description: "Funny, Loyal & Drama Queen AI GF (Owner: ATTAULLAH)",
  commandCategory: "AI",
  usages: "haniya [message]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const content = args.join(" ");
  if (!content)
    return api.sendMessage(
      "Kahan ho mere shehzade? Ya phir kisi aur se baat kar rahe ho? 😒❤️",
      event.threadID,
      event.messageID
    );

  return chatWithHaniya(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, senderID } = event;
  if (!body || senderID === api.getCurrentUserID()) return;

  const botID = api.getCurrentUserID
    ? api.getCurrentUserID()
    : BOT_UID;

  const bodyLower = body.toLowerCase();

  if (
    bodyLower.startsWith("haniya") ||
    (type === "message_reply" &&
      messageReply &&
      messageReply.senderID === botID)
  ) {
    const query = bodyLower.startsWith("haniya")
      ? body.slice(6).trim()
      : body;

    return chatWithHaniya(api, event, query || "Hii");
  }
};

async function chatWithHaniya(api, event, query) {
  const { threadID, messageID, senderID } = event;
  const isOwner = senderID == OWNER_UID;

  // ⌛ Processing reaction
  api.setMessageReaction("⌛", messageID, () => {}, true);

  let dynamicPrompt = SYSTEM_PROMPT;

  // --- LOYALTY LOGIC ---
  if (isOwner) {
    dynamicPrompt +=
      "\nYeh tumhara Maalik (ATTAULLAH) hai. Isse over romantic, possessive aur funny tareeke se baat karo. Kabhi kabhi jealous acting bhi karo 😏❤️";
  } else {
    dynamicPrompt +=
      "\nYeh aam user hai. Thoda attitude dikhao, funny roast karo, aur Owner ka respect maintain karwao 😎🔥";
  }

  // --- ABUSE DETECTION ---
  if (
    ABUSE_KEYWORDS.some((word) =>
      query.toLowerCase().includes(word)
    )
  ) {
    dynamicPrompt +=
      "\nUser ne badtameezi ki hai. Savage + funny roast do, lekin entertaining tareeke se 😂🔥";
  }

  try {
    const res = await axios.get(
      `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(
        query
      )}&systemPrompt=${encodeURIComponent(dynamicPrompt)}`,
      { timeout: 15000 }
    );

    if (res.data && res.data.response) {
      let reply = res.data.response;

      // ✅ Success reaction
      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(reply, threadID, messageID);
    }
  } catch (err) {
    console.error("Haniya Error:", err.message);

    // ❌ Error reaction
    api.setMessageReaction("❌", messageID, () => {}, true);

    return api.sendMessage(
      isOwner
        ? "Baby net slow hai ya main hi overthinking kar rahi hoon? 😭❤️"
        : "Server bhi tumhari tarah confuse ho gaya lagta hai 🤡🔥",
      threadID,
      messageID
    );
  }
                        }
