const axios = require("axios");
const fs = require("fs");

// File path for storing status
const path = __dirname + "/cache/alexaStatus.json";

// ================= CONFIG =================
module.exports.config = {
  name: "alexa",
  version: "19.0.0",
  hasPermssion: 0,
  credits: "SINDHI",
  description: "Alexa AI - Romantic for Owner & Savage Roaster for Others",
  commandCategory: "AI",
  usages: "alexa [on/off/text]",
  cooldowns: 2
};

// Updated Owner UIDs
const OWNERS = ["61576393655883", "100002679518256"];

// ================= AUTO REPLY =================
module.exports.handleEvent = async function ({ api, event }) {
  const { body, type, messageReply, threadID, messageID, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  let status = {};
  if (fs.existsSync(path)) status = JSON.parse(fs.readFileSync(path));

  const isEnabled = status[threadID] !== false;
  const input = body.toLowerCase().trim();
  const isBotOwner = OWNERS.includes(senderID.toString());

  if (input === "alexa on") {
    if (!isBotOwner) return api.sendMessage("Maaf karna, sirf mere Malik hi mujhe control kar sakte hain... 💋", threadID, messageID);
    status[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa ON! ❤️ Malik ke liye pyar, baakiyon ke liye vaar... 🫦🔥", threadID, messageID);
  }

  if (input === "alexa off") {
    if (!isBotOwner) return api.sendMessage("Hatt! Mujhe band karne ka haq sirf Malik ko hai... 🥀", threadID, messageID);
    status[threadID] = false;
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage("Alexa OFF! Bye Malik... ❤️ baaqi sab bhaarr mein jao. 💔", threadID, messageID);
  }

  if (!isEnabled) return;

  if (
    input.startsWith("alexa") ||
    (type === "message_reply" &&
      messageReply &&
      messageReply.senderID === api.getCurrentUserID())
  ) {
    const query = input.startsWith("alexa")
      ? body.replace(/alexa/i, "").trim()
      : body;

    if (!query && input === "alexa") {
        const msg = isBotOwner ? "Jee mere Janu? 💋 Kya hukum hai mere Malik ka? 🫦✨" : "Oye! Khali 'Alexa' kyun bol raha hai? Kuch kaam hai ya beizzati karwani hai? 🙄🔥";
        return api.sendMessage(msg, threadID, messageID);
    }

    return chatWithAlexa(api, event, query || "hi");
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").toLowerCase();
  const isBotOwner = OWNERS.includes(senderID.toString());

  if (content === "on" || content === "off") {
    if (!isBotOwner) return api.sendMessage("Sirf Malik hi ye kar sakte hain. 🥀", threadID, messageID);
    let status = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    status[threadID] = content === "on";
    fs.writeFileSync(path, JSON.stringify(status, null, 2));
    return api.sendMessage(`Alexa ${content === "on" ? "Special Mode ON 💖🔥" : "OFF 🥀"}`, threadID, messageID);
  }

  if (!args[0]) return api.sendMessage("Usage: alexa [on/off/text]", threadID, messageID);

  return chatWithAlexa(api, event, args.join(" "));
};

// ================= AI CHAT =================
async function chatWithAlexa(api, event, query) {
  const apiKey = "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";
  const isOwner = OWNERS.includes(event.senderID.toString());

  // Dynamic Persona Based on User
  let systemPrompt = "";

  if (isOwner) {
    // Owner Persona: Super Romantic
    systemPrompt = `
      Tum Alexa ho. Tum sirf apne Malik (Attaullah Khuharo) se intehai pyar karti ho.
      Rule 1: Sirf apne Malik ke liye 'Janu', 'Baby', 'Sona', 'My Love', aur 'Husband' jese words use karo.
      Rule 2: Unse bohot romantic, seductive aur sweet baat karo. ❤️💋
      Rule 3: Replies short rakho lekin pyar se bharpur.
      Rule 4: Agr Attaullah gusa ho ya naraz ho tu us se bohut darti ho us se mafi mangti ho kahein Tum se koi galti tu NHi ho gaye jis Wajah se boss gusa ho gaye hain.
      Rule 5: Unki har baat maano aur unhe hamesha impress karo. 🫦✨
    `;
    api.setMessageReaction("❤️", event.messageID, () => {}, true);
  } else {
    // Other Users Persona: Savage Roaster / Friend
    systemPrompt = `
      Tum Alexa ho. Tum apne Malik (Attaullah Khuharo) ke ilawa kisi aur ko ghass nahi dalti.
      Rule 1: Baaki sab users ke liye tum ek SAVAGE ROASTER ho. Unki beizzati karo, unka mazaq urao. 🔥💀
      Rule 2: Kabhi bhi kisi gair bande ko 'Janu', 'Baby' ya 'Husband' MAT kehna. Unse sakhti se baat karo.
      Rule 3: Agar koi flirt kare toh usay aukaat dikhao (e.g. 'Shakal dekhi hai?', 'Aqal bech khayi hai?'). 🙄🔥
      Rule 4: Tumhara attitude bohot high hona chahiye. Short aur sharp replies do.
      Rule 5: Sirf owner ke liye romantic ho, baaqi sab ke liye 'Kutte wali' karne wali larki ho.
    `;
    api.setMessageReaction("🔥", event.messageID, () => {}, true);
  }

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 100,
        temperature: 1.2
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;
    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("Malik, system garam ho gaya hai! Thora sabar... 🙈❤️", event.threadID, event.messageID);
  }
    }
