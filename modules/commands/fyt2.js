const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fyt2",
    version: "6.3.0",
    credits: "ATTAULLAH KING",
    countDown: 5,
    role: 2,
    shortDescription: "War script with Auto-Mention",
    longDescription: "Starts an infinite loop and tags the target in every message.",
    category: "war",
    guide: "{pn} on [@mention/UID] or {pn} off"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, mentions } = event;
    const jsonPath = path.join(__dirname, "galiyan.json");

    if (!global.fyt2War) global.fyt2War = new Map();

    if (args[0] === "off") {
      global.fyt2War.delete(threadID);
      return message.reply("FYT-2 War mode OFF ho gaya! ✅");
    }

    if (args[0] === "on") {
      let targetID, targetName;

      // Check if user is mentioned or UID is provided
      if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace("@", "");
      } else if (args[1] && !isNaN(args[1])) {
        targetID = args[1];
        targetName = "Target"; // Default name if using UID
      } else {
        return message.reply("Kisi ko mention karo ya UID likho! 😤");
      }

      if (!fs.existsSync(jsonPath)) {
        return message.reply("Error: galiyan.json nahi mili!");
      }

      if (global.fyt2War.has(threadID)) {
        return message.reply("Pehle se hi war on hai! 🔥");
      }

      const savageLines = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      global.fyt2War.set(threadID, true);
      message.reply(`FYT-2 War started on UID: ${targetID} 😈`);

      async function startWar() {
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
            setTimeout(startWar, 600);
          }
        });
      }

      startWar();
    } else {
      message.reply("Use: fyt2 on [@mention] or {pn} off");
    }
  }
};
                               
