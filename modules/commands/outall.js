module.exports.config = { 	
  name: "outall", 	
  version: "1.0.1", 	
  hasPermssion: 0,
  credits: "KASHIF RAZA | Edited by Attaullah", 	
  description: "Leave all groups (Owner Only)", 	
  commandCategory: "Admin", 	
  usages: "outall", 	
  cooldowns: 5, 	
};

module.exports.run = async ({ api, event, args }) => {

  const ownerID = "100003615741592"; // 👉 Yahan apni Facebook UID lagao

  if (event.senderID !== ownerID) {
    return api.sendMessage(
      "❌ | Yeh command sirf Bot Owner use kar sakta hai.",
      event.threadID,
      event.messageID
    );
  }

  api.getThreadList(100, null, ["INBOX"], (err, list) => {
    if (err) return console.log(err);

    list.forEach(item => {
      if (item.isGroup && item.threadID != event.threadID) {
        api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
      }
    });

    api.sendMessage(
      "≿━━━━༺❀༻━━━━≾\n\n𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗹𝗲𝗳𝘁 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽𝘀!\n\n≿━━━━༺❀༻━━━━≾",
      event.threadID
    );
  });
};
