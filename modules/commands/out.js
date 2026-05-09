module.exports.config = {
  name: "out",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Leave groups with stylish Owner Order frame",
  commandCategory: "Admin",
  usages: "[tid | all]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {

  // 🔒 UPDATED BOT OWNER IDS
  const ownerIDs = ["61576425552638", "61576393655883", "100002679518256"]; 

  if (!ownerIDs.includes(event.senderID)) {
    return api.sendMessage("❌ Only Bot Owner can use this command.", event.threadID, event.messageID);
  }

  // ✨ STYLISH FRAME MESSAGE
  const stylishMessage = 
    "┏━━━━━━━ ●● ━━━━━━━┓\n" +
    "   ⚠️  𝗢𝗪𝗡𝗘𝗥 𝗢𝗥𝗗𝗘𝗥  ⚠️\n" +
    "┗━━━━━━━ ●● ━━━━━━━┛\n\n" +
    "Mere **Owner** ne mujhe is group se\n" +
    "exit hone ka hukum diya hai. Hukum\n" +
    "ki tameel karte hue main ye group\n" +
    "chor raha hoon.\n\n" +
    "--- 𝗔𝗹𝘃𝗶𝗱𝗮 / 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 ---\n\n" +
    "『 𝗦𝗜𝗡𝗗𝗛𝗜 𝗦𝗔𝗥𝗞𝗔𝗥 』";

  // CASE: "out all" - Leave EVERY group
  if (args[0] && args[0].toLowerCase() == "all") {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    let groupList = list.filter(group => group.isGroup);
    
    if (groupList.length === 0) return api.sendMessage("Bot kisi bhi group mein nahi hai.", event.threadID);

    api.sendMessage(`🚀 **Processing...**\nOwner ke hukum par tamam (${groupList.length}) groups se exit kiya ja raha hai.`, event.threadID);
    
    for (const group of groupList) {
      try {
        await api.sendMessage(stylishMessage, group.threadID);
        await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
      } catch (e) {
        console.log(`Could not leave group ${group.threadID}`);
      }
    }
    return;
  }

  // CASE: "out" - Leave current group (or specific TID if provided)
  const id = args[0] || event.threadID;

  return api.sendMessage(stylishMessage, id, () => {
    api.removeUserFromGroup(api.getCurrentUserID(), id);
  });
};
  
