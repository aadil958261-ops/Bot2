module.exports.config = {
  name: "adduser",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Kashif Raza",
  description: "Add a user to the group using a link or UID",
  commandCategory: "Administration",
  usages: "[link | uid]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
  const { threadID, messageID } = event;
  const axios = require('axios');
  const link = args.join(" ");
  if (!args[0]) return api.sendMessage({
    body: `⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Usage:**\n+ adduser <Facebook link>\n+ adduser <UID>\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`
  }, event.threadID, event.messageID);

  var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  if (link.indexOf(".com/") !== -1) {
    const res = await api.getUID(args[0] || event.messageReply.body);
    var uidUser = res;
    api.addUserToGroup(uidUser, threadID, (err) => {
      if (participantIDs.includes(uidUser)) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**This user is already in the group!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (err) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Unable to add user to the group!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**User has been added to the approval list!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      else return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully added user to the group, Attaullah Sindhi!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
    });
  } else {
    var uidUser = args[0];
    api.addUserToGroup(uidUser, threadID, (err) => {
      if (participantIDs.includes(uidUser)) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**This user is already in the group!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (err) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Unable to add user to the group!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**User has been added to the approval list!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      else return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully added user to the group, Attaullah Sindhi!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
    });
  }
};
