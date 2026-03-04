const { Groq } = require("groq-sdk");

module.exports.config = {
  name: "devil",
  version: "2.7.0",
  hasPermssion: 0,
  credits: "Attaullah",
  description: "Auto-Savage AI (Only Admin can On/Off)",
  commandCategory: "AI",
  usages: "devil [message] or devil on/off",
  cooldowns: 2
};

const groq = new Groq({
  apiKey: "TERI_GROQ_API_KEY_YAHAN_DAAL" 
});

const devilStatus = new Map();
const chatHistory = new Map();
const ADMIN_UID = "100003615741592"; // Attaullah
const OWNER_NAME = "Attaullah";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").trim().toLowerCase();

  // --- Only Admin can Toggle ON/OFF ---
  if (content === "on") {
    if (senderID !== ADMIN_UID) {
      return api.sendMessage(
        `Abey saale! Sirf mere maalik ${OWNER_NAME} hi mujhe jagah sakte hain. Teri aukaat nahi hai. 😏`,
        threadID,
        messageID
      );
    }
    devilStatus.set(threadID, true);
    return api.sendMessage(
      `✅ Devil Mode ON! Attaullah bhai ka hukum mil gaya hai. Taiyar ho jao sab! 🔥`,
      threadID,
      messageID
    );
  }

  if (content === "off") {
    if (senderID !== ADMIN_UID) {
      return api.sendMessage(
        `Aukat mein reh. Mujhe band sirf ${OWNER_NAME} kar sakte hain. Tu apna kaam kar. 😈`,
        threadID,
        messageID
      );
    }
    devilStatus.set(threadID, false);
    chatHistory.delete(threadID);
    return api.sendMessage(
      `❌ Devil OFF... Attaullah bhai ne bacha liya tum logon ko aaj.`,
      threadID,
      messageID
    );
  }

  // --- Chatting Logic ---
  if (!args[0]) {
    return api.sendMessage(
      senderID === ADMIN_UID 
        ? `Hukum karein ${OWNER_NAME} bhai... ❤️` 
        : "Abey khali message kyun bhej raha hai? Himmat nahi hai kya kuch bolne ki?",
      threadID,
      messageID
    );
  }

  return chatWithGroq(api, event, args.join(" "));
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, type, messageReply, senderID } = event;
  if (!body || !devilStatus.get(threadID)) return;

  const botID = api.getCurrentUserID();
  const lowerBody = body.toLowerCase();

  if (lowerBody === "devil on" || lowerBody === "devil off") return;

  const isMentioned = lowerBody.startsWith("devil ");
  const isReply = type === "message_reply" && messageReply?.senderID === botID;

  if (isMentioned || isReply) {
    const query = isMentioned ? body.slice(6).trim() : body.trim();
    if (query) return chatWithGroq(api, event, query);
  }
};

async function chatWithGroq(api, event, query) {
  const { threadID, senderID, messageID } = event;
  const isAdmin = senderID === ADMIN_UID;

  if (!chatHistory.has(threadID)) chatHistory.set(threadID, []);
  let history = chatHistory.get(threadID);

  const systemPrompt = isAdmin 
    ? `You are a very sweet and loyal assistant to your owner, ${OWNER_NAME}. Address him as Boss or Jaan. Respond in Hinglish.`
    : `You are 'Devil'. Your owner is ${OWNER_NAME}. Be extremely rude, savage, and use street-slang Hindi. Roast the user. If they ask about your boss, it's ${OWNER_NAME}. Never be polite to anyone but him.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1.1,
      max_tokens: 500
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "Dimaag kharab hai mera, baad mein aa.";

    history.push({ role: "user", content: query });
    history.push({ role: "assistant", content: reply });
    if (history.length > 10) history.splice(0, 2);

    return api.sendMessage(reply, threadID, messageID);

  } catch (error) {
    console.error("Groq Error:", error);
    return api.sendMessage(
      isAdmin
        ? "Bhai API limit hit ho gayi shayad."
        : "Tera luck hi kharab hai, AI ne mana kar diya!",
      threadID,
      messageID
    );
  }
}
