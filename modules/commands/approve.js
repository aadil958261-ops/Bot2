module.exports.config = {
  name: "approve",
  version: "2.6.0",
  hasPermssion: 2,
  credits: "Modified by Attaullah",
  description: "Strict Approval System with 10-min Auto-Leave",
  commandCategory: "Admin",
  usages: "[add/remove/list/check/extend] [threadID] [days]",
  cooldowns: 5,
  dependencies: {
      "moment-timezone": "",
      "fs-extra": ""
  }
};

const timers = new Map();

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
    const { threadID, logMessageType, logMessageData, senderID, body } = event;
    const botID = api.getCurrentUserID();
    const ownerIDs = ["100003889376568", "61584291400048"];
    const footer = "\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";

    const dataPath = path.resolve(__dirname, 'cache', 'data', 'approve.json');
    let rentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const isApproved = rentals.some(item => item.t_id === threadID);

    // 1. Jab bot join kare (Timer Start)
    if (logMessageType === "log:subscribe" && logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
        if (!isApproved) {
            let bodyMsg = "⚠️ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗!\n━━━━━━━━━━━━━━━\n\nBot Approved nahi hai. Mere Owner se rabta karein approval ke liye, phir mujh se baat karna.\n\n👤 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿𝘀:";
            let mentions = ownerIDs.map(id => ({ tag: "@Owner", id }));
            let mentionText = ownerIDs.map(() => "\n- @Owner").join("");

            api.sendMessage({ body: bodyMsg + mentionText + footer, mentions }, threadID);

            const timer = setTimeout(async () => {
                let currentRentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
                if (!currentRentals.some(item => item.t_id === threadID)) {
                    await api.sendMessage("⏰ 10 Minutes over. No approval received. Leaving... Bye!" + footer, threadID);
                    api.removeUserFromGroup(botID, threadID);
                }
                timers.delete(threadID);
            }, 600000); 
            timers.set(threadID, timer);
        }
    }

    // 2. Agar koi un-approved group mein msg kare (Commands Block)
    if (body && !isApproved && !ownerIDs.includes(senderID) && event.isGroup) {
        // Yeh sirf tab trigger ho jab koi command (prefix) use kare
        // Note: Agar aap chahte hain har message pe bole toh condition hata dein
        const prefix = "/"; // Apna prefix yahan likhein
        if (body.startsWith(prefix)) {
            return api.sendMessage("❌ Mere Owner se rabta karo approval keliye, bad main bat krna mujh se." + footer, threadID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const fs = require("fs-extra");
  const moment = require("moment-timezone");
  const path = require("path");

  const ownerIDs = ["100003889376568", "61584291400048"];
  const footer = "\n— 𝗦𝗜𝗡𝗗𝗛𝗜 𝗞𝗜𝗡𝗚";
  const dataPath = path.resolve(__dirname, 'cache', 'data', 'approve.json');
  let rentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Check Approval before running any sub-command
  const isApproved = rentals.some(item => item.t_id === threadID);
  if (!isApproved && !ownerIDs.includes(senderID)) {
      return api.sendMessage("❌ Access Denied! Approval required." + footer, threadID, messageID);
  }

  const action = args[0]?.toLowerCase();
  if (!action) return api.sendMessage(`🤖 𝗕𝗢𝗧 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧\n━━━━━━━━━━━━━━━━━\n📌 add [TID] [days]\n📌 remove [TID]\n📌 list\n━━━━━━━━━━━━━━━━━${footer}`, threadID, messageID);

  switch (action) {
      case "add": {
          if (!ownerIDs.includes(senderID)) return api.sendMessage("❌ Only Owners can approve!", threadID, messageID);
          const targetID = args[1] || threadID;
          const days = parseInt(args[2]) || 30;

          if (timers.has(targetID)) {
              clearTimeout(timers.get(targetID));
              timers.delete(targetID);
          }

          let threadName = "Group Chat";
          try { threadName = (await api.getThreadInfo(targetID)).threadName || "Unnamed Group"; } catch(e) {}

          const endDate = moment().tz("Asia/Karachi").add(days, "days").format("DD/MM/YYYY");
          const index = rentals.findIndex(item => item.t_id === targetID);
          
          if (index !== -1) rentals[index].time_end = endDate;
          else rentals.push({ t_id: targetID, time_end: endDate, name_box: threadName });

          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));
          return api.sendMessage(`✅ Bot Approved for ${days} days!\n📌 Group: ${threadName}\n📅 Expiry: ${endDate}${footer}`, threadID, messageID);
      }
      
      case "list": {
          if (!ownerIDs.includes(senderID)) return;
          let msg = "📋 Approved Groups:";
          rentals.forEach((item, i) => msg += `\n${i+1}. ${item.name_box} (${item.t_id})`);
          return api.sendMessage(msg + footer, threadID);
      }
      
      case "remove": {
          if (!ownerIDs.includes(senderID)) return;
          const targetID = args[1] || threadID;
          const index = rentals.findIndex(item => item.t_id === targetID);
          if (index !== -1) {
              rentals.splice(index, 1);
              fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));
              return api.sendMessage("🗑️ Approval Removed." + footer, threadID);
          }
      }
  }
};
                                  
