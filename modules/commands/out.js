module.exports.config = {
  name: "out",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Leave one or all groups with poetry (Only Bot Owner)",
  commandCategory: "Admin",
  usages: "[tid | all]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {

  // 🔒 BOT OWNER IDS
  const ownerIDs = ["100003889376568", "61584291400048"]; 

  if (!ownerIDs.includes(event.senderID)) {
    return api.sendMessage("❌ Only Bot Owner can use this command.", event.threadID, event.messageID);
  }

  const poetry = "Udaas kar ke humein khushiyan manate ho,\nBhula kar humein tum mehfil sajate ho,\nHumein toh tumhari yaad mein rona hi tha,\nMagar afsos tum humein rula kar muskurate ho...";
  const footer = "\n\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";

  // CASE: "out all" - Leave EVERY group
  if (args[0] && args[0].toLowerCase() == "all") {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    let groupList = list.filter(group => group.isGroup);
    
    if (groupList.length === 0) return api.sendMessage("Bot kisi bhi group mein nahi hai.", event.threadID);

    api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗢𝗿𝗱𝗲𝗿 𝘁𝗼 𝗹𝗲𝗮𝘃𝗲 𝗔𝗟𝗟 𝗴𝗿𝗼𝘂𝗽𝘀 𝗿𝗲𝗰𝗲𝗶𝘃𝗲𝗱!\nTotal groups: ${groupList.length}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺${footer}`, event.threadID);
    
    for (const group of groupList) {
      // Har group mein poetry bhej kar left karega
      await api.sendMessage(`${poetry}${footer}`, group.threadID);
      await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
    }
    return;
  }

  // CASE: "out" - Leave current group (or specific TID if provided)
  const id = args[0] || event.threadID;

  return api.sendMessage(
    `${poetry}${footer}`,
    id,
    () => api.removeUserFromGroup(api.getCurrentUserID(), id)
  );
};
    
