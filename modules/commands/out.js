module.exports.config = {
  name: "out",
  version: "1.4.0",
  hasPermssion: 0,
  credits: "Modified by Attaullah",
  description: "Leave groups with Owner Order message",
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

  const exitMessage = "⚠️ **NOTICE:**\n\nMere **Owner** ne mujhe is group se exit hone ka hukum diya hai. Hukum ki tameel karte hue main ye group chor raha hoon.\n\nAlvida!";
  const footer = "\n\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";

  // CASE: "out all" - Leave EVERY group
  if (args[0] && args[0].toLowerCase() == "all") {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    let groupList = list.filter(group => group.isGroup);
    
    if (groupList.length === 0) return api.sendMessage("Bot kisi bhi group mein nahi hai.", event.threadID);

    api.sendMessage(`🚀 **Processing...**\nOwner ke hukum par tamam (${groupList.length}) groups se exit kiya ja raha hai.`, event.threadID);
    
    for (const group of groupList) {
      try {
        // Pehle message bhejega phir leave karega
        await api.sendMessage(`${exitMessage}${footer}`, group.threadID);
        await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
      } catch (e) {
        console.log(`Could not leave group ${group.threadID}`);
      }
    }
    return;
  }

  // CASE: "out" - Leave current group (or specific TID if provided)
  const id = args[0] || event.threadID;

  return api.sendMessage(`${exitMessage}${footer}`, id, () => {
    api.removeUserFromGroup(api.getCurrentUserID(), id);
  });
};
                                
