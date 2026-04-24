const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fyt2",
    version: "6.3.2",
    credits: "ATTAULLAH KING",
    countDown: 5,
    role: 2, // Role 2 matlab group admin/bot admin, lekin hum niche strict check lagayenge
    shortDescription: "War script (Only Bot Admin)",
    longDescription: "Starts an infinite loop. Only Bot Admin can use this.",
    category: "war",
    guide: "{pn} on [@mention/UID] or {pn} off"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, mentions, senderID } = event;
    const jsonPath = path.join(__dirname, "galiyan.json");

    // --- Admin Lock Logic ---
    // Check if the sender is a Bot Admin
    const adminIDs = global.config.ADMINBOT || [];
    if (!adminIDs.includes(senderID)) {
      return message.reply("Sirf mere Boss (Bot Admin) hi is command ko use kar sakte hain! 😡❌");
    }
    // -------------------------

    if (!global.fyt2War) global.fyt2War = new Map();

    if (args[0] === "off") {
      if (!global.fyt2War.has(threadID)) return message.reply("War pehle se hi band hai!");
      global.fyt2War.delete(threadID);
      return message.reply("FYT-2 War mode OFF ho gaya! ✅");
    }

    if (args[0] === "on") {
      let targetID, targetName;

      if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace(/@/g, "");
      } else if (args[1] && !isNaN(args[1])) {
        targetID = args[1];
        targetName = "Target"; 
      } else {
        return message.reply("Kisi ko mention karo ya UID likho! 😤");
      }

      if (!fs.existsSync(jsonPath)) {
        return message.reply("Error: galiyan.json file nahi mili!");
      }

      if (global.fyt2War.has(threadID)) {
        return message.reply("Pehle se hi war on hai! 🔥");
      }

      let savageLines;
      try {
        savageLines = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      } catch (e) {
        return message.reply("Error: galiyan.json file sahi nahi hai!");
      }

      global.fyt2War.set(threadID, true);
      message.reply(`FYT-2 War started on: ${targetName} 😈`);

      const startWar = () => {
        if (!global.fyt2War.has(threadID)) return;

        let randomLine = savageLines[Math.floor(Math.random() * savageLines.length)];
        let msgWithTag = {
          body: `@${targetName} ${randomLine}`,
          mentions: [{
            tag: `@${targetName}`,
            id: targetID
          }]
        };

        api.sendMessage(msgWithTag, threadID, (err) => {
          if (!err) {
            setTimeout(startWar, 2000); // Admin script hai toh thora safe delay rakha hai
          } else {
            global.fyt2War.delete(threadID);
          }
        });
      };

      startWar();
    } else {
      message.reply("Use: fyt2 on [@mention/UID] or fyt2 off");
    }
  }
};
                                                              
