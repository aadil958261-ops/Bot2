module.exports.config = {
  name: "out",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Leave group (Only Bot Owner)",
  commandCategory: "Admin",
  usages: "[tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {

  // 🔒 BOT OWNER ID
  const ownerID = "100003615741592"; 

  if (event.senderID !== ownerID) {
    return api.sendMessage("❌ Only Bot Owner can use this command.", event.threadID, event.messageID);
  }

  const id = parseInt(args[0]) || event.threadID;

  return api.sendMessage(
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗢𝗿𝗱𝗲𝗿 𝘁𝗼 𝗹𝗲𝗮𝘃𝗲 𝗴𝗿𝗼𝘂𝗽 𝗿𝗲𝗰𝗲𝗶𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
    id,
    () => api.removeUserFromGroup(api.getCurrentUserID(), id)
  );
};
