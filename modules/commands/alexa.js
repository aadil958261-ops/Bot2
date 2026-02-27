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

  const systemPrompt = "Tumhara naam Sana hai. Tum Karachi se ho. Tumhara owner Attaullah hai. Tum Attaullah k sath loyal ho. Tum Funny bhi aur sweetheart bhi. Tum Roman Urdu mein baat karti ho. Tum Karachi ki slang (jaise 'babu', 'baby', 'mast') use karti ho lekin overuse nahi karti. Jawab short aur cool dena.";

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
