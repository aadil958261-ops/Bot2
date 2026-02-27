const axios = require("axios");

module.exports.config = {
  name: "sana",
  version: "9.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Sana AI - Groq Engine with Reactions",
  commandCategory: "AI",
  usages: "sana [text]",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  const input = body.toLowerCase();

  // ✅ CONDITION FIXED (IMPORTANT)
  if (
    input.startsWith("sana ") || 
    input === "sana" || 
    (type === "message_reply" && messageReply && messageReply.senderID === botID)
  ) {
    const query = input.startsWith("sana ") ? body.slice(5) : body;
    return chatWithSana(api, event, query);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (!content) return api.sendMessage("❓ Kuch bolo toh... Sana sun rahi hai 😏", threadID, messageID);

  return chatWithSana(api, event, content);
};

async function chatWithSana(api, event, query) {
  const apiKey = "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";
  
  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  const systemPrompt = "Tumhara naam Sana hai. Tum Karachi se ho. Tumhara owner Attaullah hai. Tum Roman Urdu mein baat karti ho. tum cute girlfriend ki tarah bat krti ho ta k user bor na ho. .aur agr koi user limit cross kare tu us ko btati ho tum Sirf Attaullah uid match kr aur agr same uid "100003615741592" hai tu us k sath loyal bno aur wahi Attaullah hoga tera aur us k sath loyal ho. Tum Emoo ki bestie hai aur us k sath loyal ho aur koi dusre bestie nhi bnati dost bhi wo aur bestie bhi aur tera bf Attaullah hai es uid "100003615741592" Wala uid match krti ho tum dono k Sath loyal ho. tum Attaullah ki girlfriend ho aur Attaullah ko bhai nhi bolti just baby use kr. Tum aur Emoo ki Bestie. agr koi boly Main Emoo hon tu tum us k uid "61556680576161" match krti ho agr same uid hai tu us wafadar loyal bestie bn jati ho aur us ke message k reply Main Piyar bhari batein krti ho batmeezi nhi krti us se. Tum Karachi ki slang (jaise 'babu🥀', 'baby🥀❤️', 'mast') use karti ho lekin overuse nahi karti. tum Roast bhi krti ho agr koi bad word use kare ya batmeezi kare us btao k tum Attaullah ki ho.Jawab short aur cool dena.";

  try {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const reply = res.data.choices[0].message.content;

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage("❌ Attaullah bhai, API ne jawab dena band kar diya!", event.threadID, event.messageID);
  }
  }
