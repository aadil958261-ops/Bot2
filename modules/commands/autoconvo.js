const fs = require("fs");

// ================= MODULE CONFIG =================
module.exports.config = {
  name: "autoconvo",
  version: "3.0.0",
  hasPermission: 2,
  credits: "ARIF BABU",
  description: "Auto war convo system",
  commandCategory: "Prashasanik",
  usePrefix: false,
  usages: "Gaali dene par bot war start karega",
  cooldowns: 5,
};

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator credit change detected!");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// ================= WAR SYSTEM =================
const offensiveKeywords = [
  "tmkc","behenchod","madarchod","bhenchod","lode","chudai","bhosda","chut",
  "bahanchod","jhantu","boxdi","tera jija","laude","bc","mc","hijda","hijde",
  "chhakka","chakka","6kka","madharchod","lol","bsdky","gandu","mkc","randi k bachy"
].map(k => new RegExp(`\\b${k}\\b`, "i"));

let warMode = false;
let targetUID = null;
let intervalId = null;
let targetName = "";

// ================= GAALI FILE =================
function getGaliyanFromFile() {
  return fs.readFileSync("FYT_GROUP.txt", "utf8")
    .split("\n")
    .filter(g => g.trim() !== "");
}

// ================= HANDLE EVENT =================
module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, senderID, body, messageReply } = event;
  if (!body) return;

  const lowerBody = body.toLowerCase().trim();

  const containsOffensive = offensiveKeywords.some(r => r.test(body));
  const mentionsBot = /\b(bot|attaullah)\b/i.test(body);
  const isReplyToBot =
    messageReply && messageReply.senderID == api.getCurrentUserID();

  // ===== STOP WAR =====
  const stopPhrases = [
    "sorry attaullah",
    "attaullah sorry",
    "sorry bot",
    "bot sorry",
    "sorry"
  ];

  if (warMode && senderID === targetUID && stopPhrases.includes(lowerBody)) {
    warMode = false;
    targetUID = null;
    targetName = "";
    if (intervalId) clearInterval(intervalId);

    return api.sendMessage(
      "😏 Theek hai maaf kiya… aage se zubaan sambhal ke!",
      threadID
    );
  }

  // ===== ADMIN FORCE STOP =====
  if (
    warMode &&
    global.config.ADMINBOT.includes(senderID) &&
    ["ruk", "band kar", "ruk ja"].includes(lowerBody)
  ) {
    warMode = false;
    targetUID = null;
    targetName = "";
    if (intervalId) clearInterval(intervalId);

    return api.sendMessage("😎 Boss ne bola, war band!", threadID);
  }

  // ===== INSTANT REPLY DURING WAR =====
  if (warMode && senderID === targetUID) {
    try {
      const galiyan = getGaliyanFromFile();
      const random = galiyan[Math.floor(Math.random() * galiyan.length)];
      return api.sendMessage(
        {
          body: `@${targetName} ${random}`,
          mentions: [{ tag: targetName, id: senderID }]
        },
        threadID
      );
    } catch {}
  }

  // ===== START WAR =====
  if (!warMode && containsOffensive && (mentionsBot || isReplyToBot)) {
    warMode = true;
    targetUID = senderID;
    targetName = await Users.getNameUser(senderID);

    if (intervalId) clearInterval(intervalId);

    api.sendMessage(
      `Oye @${targetName} 😈 War mode ON!\nHimmat hai to "sorry attaullah" likh.`,
      threadID
    );

    try {
      const galiyan = getGaliyanFromFile();

      intervalId = setInterval(() => {
        if (!warMode) return;

        const random = galiyan[Math.floor(Math.random() * galiyan.length)];
        api.sendMessage(
          {
            body: `@${targetName} ${random}`,
            mentions: [{ tag: targetName, id: targetUID }]
          },
          threadID
        );
      }, 4000);
    } catch {}
  }
};

// ================= COMMAND =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ Sirf owner ke liye hai.", threadID);
  }

  if (args[0] === "off") {
    warMode = false;
    targetUID = null;
    targetName = "";
    if (intervalId) clearInterval(intervalId);

    return api.sendMessage("✅ War mode band kar diya.", threadID);
  }

  api.sendMessage("War band karne ke liye: autoconvo off", threadID);
};
