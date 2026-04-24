const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "pair",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 / ATTAULLAH KING",
  description: "Pair with Reply, Mention, UID, or Random user",
  commandCategory: "Love",
  usages: "pair [Reply/Mention/UID/on/off]",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID, participantIDs, type, messageReply, mentions } = event;

  if (!global.pairStatus) global.pairStatus = new Map();
  const adminIDs = global.config.ADMINBOT || [];
  const action = (args[0] || "").toLowerCase();

  // --- Admin Control ---
  if (action === "off") {
    if (!adminIDs.includes(senderID)) return api.sendMessage("❌ Sirf ATTAULLAH KING ke admins ise off kar sakte hain!", threadID, messageID);
    global.pairStatus.set(threadID, false);
    return api.sendMessage("✅ Pair command is now DISABLED.", threadID, messageID);
  }
  if (action === "on") {
    if (!adminIDs.includes(senderID)) return api.sendMessage("❌ Sirf Bot Admin hi ise ON kar sakta hai!", threadID, messageID);
    global.pairStatus.set(threadID, true);
    return api.sendMessage("✅ Pair command is now ENABLED.", threadID, messageID);
  }

  if (global.pairStatus.get(threadID) === false) {
    return api.sendMessage("⚠️ Pair command is currently disabled.", threadID, messageID);
  }

  // --- Target Identification Logic ---
  let id;
  if (type === "message_reply") {
    id = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    id = Object.keys(mentions)[0];
  } else if (args[0] && !isNaN(args[0]) && args[0].length > 5) {
    id = args[0];
  } else {
    // Default: Random selection
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    if (listUserID.length == 0) return api.sendMessage("❌ Group mein koi aur user nahi mila!", threadID, messageID);
    id = listUserID[Math.floor(Math.random() * listUserID.length)];
  }

  try {
    const namee = (await Users.getData(senderID)).name;
    const name = (await Users.getData(id)).name;
    const tle = Math.floor(Math.random() * 101);

    const gifCute = [
      "https://i.ibb.co/DPCPZ5d6/BWji8Em.gif",
      "https://i.ibb.co/rK5XRF3Q/ubJ31Mz.gif",
      "https://i.ibb.co/twWtcqMy/9550619d3659.gif",
      "https://i.ibb.co/ymQqT9Hw/5768d6a10231.gif",
      "https://i.ibb.co/kYJ6DWV/3181f3185353.gif",
      "https://i.ibb.co/LXwRQ32h/ac4482d35848.gif",
      "https://i.ibb.co/m5YBmLsY/9ed7726de7fc.gif",
      "https://i.ibb.co/nNqK6Q6Q/fcf1672a9d4f.gif"
    ];

    const cachePath = __dirname + "/cache/";
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    // Download Avatars
    let avt1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    let avt2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    let gif = (await axios.get(gifCute[Math.floor(Math.random() * gifCute.length)], { responseType: "arraybuffer" })).data;

    fs.writeFileSync(cachePath + "avt.png", Buffer.from(avt1, "utf-8"));
    fs.writeFileSync(cachePath + "avt2.png", Buffer.from(avt2, "utf-8"));
    fs.writeFileSync(cachePath + "giflove.png", Buffer.from(gif, "utf-8"));

    var msg = {
      body: `≿━━━━༺❀༻━━━━≾\n\n💕✨ 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐌𝐚𝐭𝐜𝐡 𝐅𝐨𝐮𝐧𝐝 ✨💕\n\n🌸 ${namee} 💖 ${name} 🌸\n\n━━━━━━━━━━━━━━━━━━━━━━━\n💫 Love Compatibility: ${tle}% 💫\n━━━━━━━━━━━━━━━━━━━━━━━\n\n✨ May your love story be as beautiful as a fairytale ✨\n\n💝 By: 𝐀𝐓𝐓𝐀𝐔𝐋𝐋𝐀𝐇 𝐊𝐈𝐍𝐆 💝\n\n≿━━━━༺❀༻━━━━≾`,
      mentions: [{ id: senderID, tag: namee }, { id: id, tag: name }],
      attachment: [
        fs.createReadStream(cachePath + "avt.png"),
        fs.createReadStream(cachePath + "giflove.png"),
        fs.createReadStream(cachePath + "avt2.png")
      ]
    };

    return api.sendMessage(msg, threadID, messageID);
  } catch (e) {
    return api.sendMessage("❌ Error: Pairing process mein masla aaya! Shayad UID galat hai.", threadID, messageID);
  }
};
      
