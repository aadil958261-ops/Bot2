const axios = require("axios");

module.exports.config = {
  name: "autobanuser",
  version: "1.0.0",
  hasPermssion: 3, 
  credits: "**Kashif Raza**",
  description: "Automatically ban users for spamming the bot (random image)",
  commandCategory: "Admin",
  usages: "x",
  cooldowns: 5
};

module.exports.run = ({api, event}) => {
  return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Stop spamming!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
};

module.exports.handleEvent = async ({ Users, api, event }) => {
  const fs = require("fs-extra");
  const moment = require("moment-timezone");

  let { senderID, messageID, threadID } = event;
  const so_lan_spam = 5; // number of spam attempts before ban
  const thoi_gian_spam = 60000; // 60000 milliseconds (1 minute)
  const unbanAfter = 600000; // 600000 milliseconds (10 minutes) 
  const folderRandomImage = __dirname + "/autoban";
  const allImage = fs.readdirSync(folderRandomImage);

  if (!global.client.autoban) global.client.autoban = {};
  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  }

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  if (!event.body || event.body.indexOf(prefix) != 0) return;

  let dataUser = await Users.getData(senderID) || {};
  let data = dataUser.data || {};

  if ((global.client.autoban[senderID].timeStart + thoi_gian_spam) <= Date.now()) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  } else {
    global.client.autoban[senderID].number++;
    if (global.client.autoban[senderID].number >= so_lan_spam) {
      const time = moment.tz("Asia/Karachi").format("DD/MM/YYYY HH:mm:ss");
      if (data && data.banned == true) return;

      data.banned = true;
      data.reason = `spam bot ${so_lan_spam} times/${thoi_gian_spam/60000} minutes`;
      data.autoban = {
        timeStart: Date.now(),
        unbanAfter
      };
      data.dateAdded = time;
      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };

      api.sendMessage({
        body: `⚝──⭒─⭑─⭒──⚝\n**${senderID} | **Attaullah Sindhi**\n🤍 You have been banned from using the bot for ${unbanAfter/60000} minutes due to spamming\n🖤 Auto unban after ${Math.floor(unbanAfter/60000)} minutes**\n⚝──⭒─⭑─⭒──⚝`,
        attachment: fs.createReadStream(`${folderRandomImage}/${allImage[Math.floor(Math.random() * allImage.length)]}`)
      }, threadID, () => {
        setTimeout(async function() {
          delete data.autoban;
          data.banned = false;
          data.reason = null;
          data.dateAdded = null;
          await Users.setData(senderID, { data });
          global.data.userBanned.delete(senderID);
          api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Unbanned successfully! You can now continue using the bot.**\n⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
          for (let idAdmin of [100003615741592]) {
            api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Bot has unbanned ${senderID} | **Kashif Raza**\nSystem has unbanned the user\nTime: ${time}**\n⚝──⭒─⭑─⭒──⚝`, idAdmin);
          }
        }, unbanAfter);
      });
      for (let idAdmin of [100003615741592]) {
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Bot has banned ${senderID} | **Kashif Raza** for spamming ${so_lan_spam} times/minute\nSystem will unban the user after ${Math.floor(unbanAfter/60000)} minutes\nTime: ${time}**\n⚝──⭒─⭑─⭒──⚝`, idAdmin);
      }
    }
  }
};
