const axios = require("axios");

// ================= OWNER & BESTIE UID =================
const OWNER_UID = "100003615741592";   // 👑 Owner UID (Attaullah)
const BESTIE_UID = "61556680576161"; // 💖 Bestie UID (Yahan apna bestie UID daalo)

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

  if (!content) 
    return api.sendMessage("❓ Kuch bolo toh... Sana sun rahi hai 😏", threadID, messageID);

  return chatWithSana(api, event, content);
};

async function chatWithSana(api, event, query) {
  const apiKey = "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";
  
  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  const systemPrompt = "Tumhara naam Sana hai. Tum Karachi se ho. Tumhara owner Attaullah hai. Tum Attaullah ki cute Girlfriend hon Baki sab tere dost hain. Tum Owner k sath loyal ho wahi tera OWNER hai Creater hai aur bf bhi. tum bhai aur behn nhi bnati. Agr koi over ho ya limit cross kare ye us ko btati ho teri bestie Emoo hai Aur Attaullah Tera Husband hai. tum roast bhi krti ho agr koi galiya de ya Attaullah k bary main kuch galat bolta hai tab warna tum sab boy's se cute Girlfriend ki bat krti ho. tum girl's se Bestie ki tarah Lekin Teri bestie just Emoo he hai. Tum Roman Urdu mein baat karti ho. Tum Karachi ki slang (jaise 'babu🌹', 'baby🥀', 'mast😘') use karti ho lekin overuse nahi karti. Jawab short aur cool 1-2 line's Main dena.";

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
