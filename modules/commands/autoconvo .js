const fs = require('fs');

// ================= MODULE CONFIG =================
module.exports.config = {
  name: "autoconvo",
  version: "2.4.0",
  hasPermission: 2,
  credits: "ARIF BABU",
  description: "MADE BY ARIF BABU",
  commandCategory: "Prashasanik",
  usePrefix: false,
  usages: "Gaali dene par bot khud war start karega.",
  cooldowns: 5,
};

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, 'base64').toString('utf8');
})();

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("Creator Lock Activate ho gaya! Credits change nahi kar sakte.");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// ================= WAR SYSTEM =================
const offensiveKeywords = [
  "tmkc","behenchod","madarchod","bhenchod","lode","chudai","bhosda","chut",
  "bahanchod","jhantu","boxdi","tera jija","laude","bc","mc","hijda","hijde",
  "chhakka","chakka","6kka","madharchod","bahenchod","madarchod",
  "lol","tata","bsdky","gandu","mkc","randi k bachy"
].map(keyword => new RegExp(`\\b${keyword}\\b`, 'i'));

let warMode = false;
let targetUID = null;
let intervalId = null;

function getGaliyanFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('FYT_GROUP.txt', 'utf8', (err, data) => {
      if (err) return reject("Gaali wali file read karne me problem aa gayi.");
      const galiyan = data.split('\n').filter(g => g.trim() !== '');
      resolve(galiyan);
    });
  });
}

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, senderID, messageID, body } = event;
  if (!body) return;

  const containsOffensiveLanguage = offensiveKeywords.some(r => r.test(body));
  const mentionsBotOrAttaullah = /\b(bot|attaullah)\b/i.test(body);

  // ✅ Check if user is replying to bot
  const isReplyToBot = event.messageReply && event.messageReply.senderID == api.getCurrentUserID();

  // ===== ACTIVE WAR MODE =====
  if (warMode && senderID === targetUID) {
    const lowerBody = body.toLowerCase().trim();

    const deactivationPhrases = [
      "sorry attaullah","attaullah sorry","sorry bot","bot sorry","sorry"
    ];

    const adminStopPhrases = ["ruk ja","ruk jaa","band kar","ruk"];

    const isDeactivation = deactivationPhrases.includes(lowerBody);
    const isAdminStop = adminStopPhrases.includes(lowerBody) &&
                        global.config.ADMINBOT.includes(senderID);

    if (isDeactivation || isAdminStop) {
      warMode = false;
      targetUID = null;
      if (intervalId) clearInterval(intervalId);

      if (isAdminStop) {
        return api.sendMessage("Theek hai boss, aap bole to war band kar diya 😎", threadID);
      }

      return api.sendMessage("Chalo maaf kiya 😏 Aage se zubaan sambhal ke.", threadID);
    }

    try {
      const name = await Users.getNameUser(senderID);
      const galiyan = await getGaliyanFromFile();
      const random = galiyan[Math.floor(Math.random() * galiyan.length)];
      api.sendMessage({
        body: `@${name} ${random}`,
        mentions: [{ tag: name, id: senderID }]
      }, threadID);
    } catch {}
    return;
  }

  // ===== START WAR =====
  if (containsOffensiveLanguage && (mentionsBotOrAttaullah || isReplyToBot)) {
    warMode = true;
    targetUID = senderID;

    const name = await Users.getNameUser(senderID);
    api.sendMessage(
      `Oye @${name} 😈 War mode on ho gaya!\nHimmat hai to "sorry attaullah" likh ke dikha.`,
      threadID,
      messageID
    );

    try {
      const galiyan = await getGaliyanFromFile();
      intervalId = setInterval(() => {
        const random = galiyan[Math.floor(Math.random() * galiyan.length)];
        api.sendMessage({
          body: `@${name} ${random}`,
          mentions: [{ tag: name, id: senderID }]
        }, threadID);
      }, 4000);
    } catch {}
  }
};

// ================= COMMAND CONTROL =================
module.exports.run = async function({ api, event, args }) {
  const { threadID, senderID, messageID } = event;

  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage(
      "Yeh command sirf bot owner ke liye hai bhai 😅",
      threadID,
      messageID
    );
  }

  if (args[0]?.toLowerCase() === "off") {
    warMode = false;
    targetUID = null;
    if (intervalId) clearInterval(intervalId);

    return api.sendMessage("War mode band kar diya gaya 👍", threadID, messageID);
  }

  return api.sendMessage(
    "War band karne ke liye: !convo off likho.",
    threadID,
    messageID
  );
};