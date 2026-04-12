const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "kiss",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Kiss via mention, reply, or UID with romantic poetry",
  commandCategory: "Love",
  usages: "[tag/reply/uid]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Users }) => {
  const link = [    
    "https://i.postimg.cc/yxDKkJyH/02d4453f3eb0a76a87148433395b3ec3.gif",
    "https://i.postimg.cc/nLTf2Kdx/1483589602-6b6484adddd5d3e70b9eaaaccdf6867e.gif",
    "https://i.postimg.cc/Wpyjxnsb/574fcc797b21e-1533876813029926506824.gif",
    "https://i.postimg.cc/xdsT8SVL/kiss-anime.gif"
  ];

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
      name = "Bae";
    }
  }

  if (!mentionID) {
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝘀𝗼𝗺𝗲𝗼𝗻𝗲, 𝗿𝗲𝗽𝗹𝘆, 𝗼𝗿 𝘁𝘆𝗽𝗲 𝗮 𝗨𝗜𝗗 💞\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
  }

  const romanticPoetry = [
    "Tumhaari ek chhuwan se meri duniya badal gayi,\nJaise sadiyon ki pyaas ek pal mein bujh gayi...",
    "Labon ki narmi ne jab rooh ko chhua,\nKhuda kasam mohalla saara gawah hua...",
    "Mere dil ki bas ek hi khwahish hai,\nTumhare labon ka mere labon se raabta ho...",
    "Mohabbat ki dastaan bas itni si hai,\nMain tumhara hoon aur tum meri ho..."
  ];

  const poetry = romanticPoetry[Math.floor(Math.random() * romanticPoetry.length)];
  const chosenLink = link[Math.floor(Math.random() * link.length)];
  const filePath = __dirname + "/cache/kissme.gif";

  const callback = () => {
    api.sendMessage({
      body: `⚝──⭒─⭑─⭒──⚝\n\n${name}, 𝐁𝐚𝐞 𝐠𝐢𝐯𝐞 𝐦𝐞 𝐚 𝐬𝐰𝐞𝐞𝐭 𝐤𝐢𝐬𝐬 💞\n\n"${poetry}"\n\n⚝──⭒─⭑─⭒──⚝\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚`,
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
  
