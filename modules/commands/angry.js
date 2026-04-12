const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "angry",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Express anger via mention, reply, or UID",
  commandCategory: "Member",
  usages: "[tag/reply/uid]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Users }) => {
  const link = ["https://i.imgur.com/kljyQPh.gif"];
  let mentionID, name;

  // 1. Check for Reply
  if (event.type == "message_reply") {
    mentionID = event.messageReply.senderID;
    name = (await Users.getData(mentionID)).name;
  }
  // 2. Check for Mention
  else if (Object.keys(event.mentions).length > 0) {
    mentionID = Object.keys(event.mentions)[0];
    name = event.mentions[mentionID].replace("@", "");
  }
  // 3. Check for UID in args
  else if (args[0] && !isNaN(args[0])) {
    mentionID = args[0];
    try {
      name = (await Users.getData(mentionID)).name;
    } catch (e) {
      name = "User";
    }
  }

  // Agar teeno mein se kuch bhi na ho
  if (!mentionID) {
    return api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝐚 𝐮𝐬𝐞𝐫, 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞, 𝐨𝐫 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐔𝐈𝐃\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID,
      event.messageID
    );
  }

  const chosenLink = link[Math.floor(Math.random() * link.length)];
  const extension = chosenLink.split('.').pop();
  const filePath = __dirname + `/cache/angry.${extension}`;

  const callback = () => {
    api.sendMessage({
      body: `≿━━━━༺❀༻━━━━≾\n\n𝐀𝐧𝐠𝐫𝐲 𝐚𝐭 ${name} 😤\n\n≿━━━━༺❀༻━━━━≾`,
      mentions: [{ tag: name, id: mentionID }],
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, event.messageID);
  };

  return request(encodeURI(chosenLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback());
};
  
