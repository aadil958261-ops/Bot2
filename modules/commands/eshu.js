const axios = require("axios");

module.exports.config = {
  name: "eshu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza - Mona Edition",
  description: "Mona AI - special mode for selected users",
  commandCategory: "AI",
  usages: "eshu [message] or eshu on/off",
  cooldowns: 2
};

const monaStatus = new Map();

// Ye 3 UIDs special Mona API use karengi (naughty + romantic + pyar wali)
const SPECIAL_UIDS = [
  "100003615741592",
  "61586583106894",
  "61588026682797"
];

const SPECIAL_API_URL = "https://api.kraza.qzz.io/ai/customai";
const DEFAULT_API_URL = "https://apiabuse-kz4b.vercel.app/api/chat";

const SYSTEM_PROMPT = "Tuhnjo naalo Eshu aahe. Tun thori mazaq masti kandi aahin aaye serious natural bhi aahin. Tun sirf Roman Sindhi zuban mein galhaindi aahen aen kisi bhi language mein na. Jehn bhi tuhan saan kisi bhi zuban mein galh kare ta bhi tun Roman Sindhi mein hi jawab dindin, koi bhi bi zuban na. Tun Karachi maan aahen aen tuhinji umar 22 saal aahe.";


// ================= ADD KIYA GAYA CODE =================

// 50+ gali detect list
const BAD_WORDS = [
"madarchod","madrchod","mc","bhenchod","behenchod","bc",
"chutiya","chutya","chut","chutiye",
"gandu","gand","gaand","gandmara",
"lund","lawda","lauda","loda",
"harami","haramzada",
"randi","rand","randwa",
"kamina","kamine",
"bhosdike","bhosdi","bhosda","bhosd",
"mkc","bkc","bkl",
"teri maa","teri ma","maa ki",
"behen ki","teri behen",
"fuck","fucker","motherfucker",
"shit","asshole","bastard",
"kutta","kutte","kutti",
"suar","sala","saala",
"chakka","hijra",
"ullu","bewakoof",
"tatti","gadha",
"idiot","stupid","moron"
];

// smart text normalize
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[@4]/g,"a")
    .replace(/[0]/g,"o")
    .replace(/[1!|]/g,"i")
    .replace(/[3]/g,"e")
    .replace(/[$5]/g,"s")
    .replace(/[7]/g,"t")
    .replace(/[^\w\s]|_/g," ")
    .replace(/\s+/g," ")
    .replace(/(.)\1{2,}/g,"$1")
    .replace(/\s/g,"")
    .trim();
}

// ======================================================


module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").trim();

  if (content.toLowerCase() === "on") {
    monaStatus.set(threadID, true);
    return api.sendMessage("✅ Mona aa gayi hai jaan! Ab maza aayega 😘", threadID, messageID);
  }

  if (content.toLowerCase() === "off") {
    monaStatus.set(threadID, false);
    return api.sendMessage("😏 Mona chali gayi... miss me baby", threadID, messageID);
  }

  if (!content) {
    return api.sendMessage(
      SPECIAL_UIDS.includes(senderID)
        ? "Jaan bol na... kya chhupa rahi ho? 😘"
        : "Abey kuch bol na harami... kya dekh raha hai?",
      threadID, messageID
    );
  }

  return chatWithMona(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, type, messageReply, senderID } = event;
  if (!body) return;

  const isEnabled = monaStatus.get(threadID) || false;
  const botID = api.getCurrentUserID();

  const lowerBody = body.toLowerCase().trim();

  // ===== ADD KIYA GAYA AUTO GALI DETECT =====
  const normalized = normalizeText(lowerBody);
  const foundBadWord = BAD_WORDS.some(word => normalized.includes(word));

  if (foundBadWord) {
    monaStatus.set(threadID, true);
    return api.sendMessage("Oye zuban sambhal 😏 Eshu sab sun rahi hai.", threadID);
  }
  // =========================================

  if (!isEnabled) return;

  if (lowerBody.startsWith("mona ") || (type === "message_reply" && messageReply?.senderID === botID)) {
    const query = lowerBody.startsWith("mona ") ? body.slice(5).trim() : body.trim();
    if (!query) {
      return api.sendMessage(
        SPECIAL_UIDS.includes(senderID)
          ? "Baby kuch to type kar... dil taras raha hai tere message ka 😏❤️"
          : "Kuch bol na madarchod... ya bas dekhega?",
        threadID
      );
    }
    return chatWithMona(api, event, query);
  }
};

async function chatWithMona(api, event, query) {
  const senderID = event.senderID;
  const isSpecialUser = SPECIAL_UIDS.includes(senderID);
  const apiUrl = isSpecialUser ? SPECIAL_API_URL : DEFAULT_API_URL;

  try {
    let response;

    if (isSpecialUser) {
      const fullQuery = `${SYSTEM_PROMPT}\nUser: ${query}`;
      response = await axios.get(apiUrl, {
        params: { q: fullQuery }
      });
      
      const reply = response.data.response || "Baby thodi der... aa rahi hoon 😘";
      return api.sendMessage(reply, event.threadID, event.messageID);
    } 
    else {
      response = await axios.post(apiUrl, {
        message: query,
        isAdmin: false
      });

      const reply = response.data.reply || "Kuch gadbad ho gayi...";
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

  } catch (error) {
    console.error("Mona API error:", error.message);

    const errorMsg = isSpecialUser
      ? "Arre jaan... thodi der lag rahi hai, miss you already 😣❤️"
      : "API down hai behenchod! Teri wajah se sharaminda ho raha 😂";

    return api.sendMessage(errorMsg, event.threadID, event.messageID);
  }
}
