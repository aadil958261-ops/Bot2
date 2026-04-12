module.exports.config = {
  name: "approve",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Modified by Attaullah",
  description: "Manage group bot rentals with Auto-Protection on Join",
  commandCategory: "Admin",
  usages: "[add/remove/list/check/extend] [threadID] [days]",
  cooldowns: 5,
  dependencies: {
      "moment-timezone": "",
      "fs-extra": ""
  }
};

module.exports.onLoad = function () {
    const fs = require("fs-extra");
    const path = require("path");
    const dir = path.resolve(__dirname, 'cache', 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dataPath = path.join(dir, 'approve.json');
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([], null, 4));
};

module.exports.handleEvent = async function({ api, event }) {
    const fs = require("fs-extra");
    const path = require("path");
    const { threadID, logMessageType, logMessageData } = event;
    const botID = api.getCurrentUserID();
    
    // 🔒 Bot Owners for Tagging
    const ownerIDs = ["100003889376568", "61584291400048"];
    const footer = "\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";

    // Jab bot group mein add ho toh check kare
    if (logMessageType === "log:subscribe" && logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
        const dataPath = path.resolve(__dirname, 'cache', 'data', 'approve.json');
        let rentals = [];
        if (fs.existsSync(dataPath)) {
            rentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        }
        
        const isApproved = rentals.some(item => item.t_id === threadID);

        if (!isApproved) {
            let msg = "⚠️ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗!\n━━━━━━━━━━━━━━━\n\nYe Bot Approved nahi hai. Isay use karne ke liye mere Owner se rabta karein aur approval lein.\n\n👤 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿𝘀:";
            
            let mentions = [];
            let bodyMsg = msg;
            
            ownerIDs.forEach(id => {
                bodyMsg += `\n- @Owner`;
                mentions.push({ tag: "@Owner", id: id });
            });

            return api.sendMessage({ 
                body: bodyMsg + footer, 
                mentions 
            }, threadID);
        }
    }
};

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID, senderID } = event;
  const fs = require("fs-extra");
  const moment = require("moment-timezone");
  const path = require("path");

  const ownerIDs = ["100003889376568", "61584291400048"];
  const footer = "\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";
  const dataPath = path.resolve(__dirname, 'cache', 'data', 'approve.json');

  let rentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const action = args[0]?.toLowerCase();

  if (!action) {
      return api.sendMessage(
`🤖 𝗕𝗢𝗧 𝗥𝗘𝗡𝗧𝗔𝗟 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧
━━━━━━━━━━━━━━━━━
📌 add [TID] [days] - Approval dein
📌 remove [TID] - Approval khatam karein
📌 list - Approved groups dekhein
📌 check [TID] - Status check karein
📌 extend [TID] [days] - Time barhayein
━━━━━━━━━━━━━━━━━${footer}`, threadID, messageID);
  }

  const parseDate = (str) => moment(str, "DD/MM/YYYY");

  switch (action) {
      case "add": {
          if (!ownerIDs.includes(senderID)) return api.sendMessage("❌ Sirf Bot Owner approval de sakta hai!", threadID, messageID);
          const targetID = args[1] || threadID;
          const days = parseInt(args[2]) || 30;

          let threadName = "Unnamed Group";
          try {
              let info = await api.getThreadInfo(targetID);
              threadName = info.threadName || threadName;
          } catch (e) {
              let tData = await Threads.getData(targetID);
              if (tData) threadName = tData.threadInfo.threadName || threadName;
          }

          const endDate = moment().tz("Asia/Karachi").add(days, "days").format("DD/MM/YYYY");
          const index = rentals.findIndex(item => item.t_id === targetID);

          if (index !== -1) {
              rentals[index].time_end = endDate;
              rentals[index].name_box = threadName;
          } else {
              rentals.push({ t_id: targetID, time_end: endDate, name_box: threadName });
          }

          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));
          return api.sendMessage(`✅ Approval Successful:\n━━━━━━━━━━━━━━━━━\n📌 Group: ${threadName}\n🆔 ID: ${targetID}\n📅 Expires: ${endDate}${footer}`, threadID, messageID);
      }

      case "remove": {
          if (!ownerIDs.includes(senderID)) return api.sendMessage("❌ Permission denied!", threadID, messageID);
          const targetID = args[1] || threadID;
          const index = rentals.findIndex(item => item.t_id === targetID);
          if (index === -1) return api.sendMessage("❌ Ye group list mein nahi hai.", threadID, messageID);

          rentals.splice(index, 1);
          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));
          return api.sendMessage(`✅ Approval removed for Thread ID: ${targetID}${footer}`, threadID, messageID);
      }

      case "list": {
          if (!rentals.length) return api.sendMessage("📭 Koi bhi group approved nahi hai.", threadID, messageID);
          let msg = `📋 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗚𝗥𝗢𝗨𝗣𝗦\n━━━━━━━━━━━━━━━━━`;
          rentals.forEach((item, i) => {
              msg += `\n${i + 1}. ${item.name_box}\n🆔 ${item.t_id}\n📅 ${item.time_end}\n`;
          });
          return api.sendMessage(msg + footer, threadID, messageID);
      }

      case "check": {
          const targetID = args[1] || threadID;
          const found = rentals.find(item => item.t_id === targetID);
          if (!found) return api.sendMessage("❌ Ye group approved nahi hai.", threadID, messageID);

          const diff = parseDate(found.time_end).diff(moment().tz("Asia/Karachi"), 'days');
          const status = diff > 0 ? `🟢 ${diff} days left` : "🔴 Expired";
          
          return api.sendMessage(`📄 𝗥𝗘𝗡𝗧𝗔𝗟 𝗦𝗧𝗔𝗧𝗨𝗦\n━━━━━━━━━━━━━━━━━\n📌 Group: ${found.name_box}\n📅 Expiry: ${found.time_end}\n⏳ Status: ${status}${footer}`, threadID, messageID);
      }

      case "extend": {
          if (!ownerIDs.includes(senderID)) return api.sendMessage("❌ Permission denied!", threadID, messageID);
          const targetID = args[1] || threadID;
          const days = parseInt(args[2]);
          if (isNaN(days)) return api.sendMessage("❌ Days add karein!", threadID, messageID);

          const index = rentals.findIndex(item => item.t_id === targetID);
          if (index === -1) return api.sendMessage("❌ Group not approved.", threadID, messageID);

          rentals[index].time_end = parseDate(rentals[index].time_end).add(days, "days").format("DD/MM/YYYY");
          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));
          return api.sendMessage(`✅ Extended successfully!\n📅 New Expiry: ${rentals[index].time_end}${footer}`, threadID, messageID);
      }
      
      default:
          return api.sendMessage("❌ Invalid action. Use: add, remove, list, check, extend", threadID, messageID);
  }
};
                                                 
