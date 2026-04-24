const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fyt2",
    version: "11.0.0",
    credits: "ATTAULLAH KING",
    countDown: 2,
    role: 2, 
    shortDescription: "Fixed War Module",
    longDescription: "Reply-based War with 1-minute default delay",
    category: "war",
    guide: "Reply: {pn} on [seconds] | Default: 60s"
  },

  onStart: async function ({ api, event, args, Users }) {
    const { threadID, mentions, senderID, messageReply, type, messageID } = event;
    const jsonPath = path.join(__dirname, "galiyan.json");

    // --- Admin Lock ---
    const adminIDs = global.config.ADMINBOT || [];
    if (!adminIDs.includes(senderID)) {
      return api.sendMessage("Sirf mere Boss (ATTAULLAH KING) hi is command ko use kar sakte hain! 😡❌", threadID, messageID);
    }

    if (!global.fyt2ActiveWars) global.fyt2ActiveWars = {};

    const action = args[0] ? args[0].toLowerCase() : "";

    // --- Target & Speed Identification ---
    let targetID, targetName, speed;
    const lastArg = parseInt(args[args.length - 1]);
    
    // Default 60s agar speed mention nahi hai
    speed = (!isNaN(lastArg) && lastArg > 0 && args.length > 1) ? lastArg * 1000 : 60000;

    try {
        if (type === "message_reply") {
            targetID = messageReply.senderID;
            targetName = await Users.getNameUser(targetID);
        } else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
            targetName = mentions[targetID].replace(/@/g, "");
        } else if (args[1] && !isNaN(args[1])) {
            targetID = args[1];
            targetName = "Target"; 
        }
    } catch (e) {
        return api.sendMessage("Target ki info nikaalne mein error aaya!", threadID, messageID);
    }

    // --- Action Logic ---
    if (action === "off") {
      if (global.fyt2ActiveWars[threadID] && global.fyt2ActiveWars[threadID][targetID]) {
        delete global.fyt2ActiveWars[threadID][targetID];
        return api.sendMessage(`✅ Target [${targetName}] ki tagging rok di gayi hai.`, threadID, messageID);
      }
      return api.sendMessage("Is target par koi war nahi chal rahi.", threadID, messageID);
    }

    if (action === "on") {
      if (!targetID) return api.sendMessage("⚠️ Reply ya @mention karein!", threadID, messageID);
      if (!fs.existsSync(jsonPath)) return api.sendMessage("Error: galiyan.json nahi mili!", threadID, messageID);

      if (!global.fyt2ActiveWars[threadID]) global.fyt2ActiveWars[threadID] = {};
      if (global.fyt2ActiveWars[threadID][targetID]) return api.sendMessage("Pehle se war on hai!", threadID, messageID);

      let savageLines = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      global.fyt2ActiveWars[threadID][targetID] = true;
      
      api.sendMessage(`🚀 War Started!\n🎯 Target: ${targetName}\n⏱️ Speed: ${speed / 1000}s`, threadID, messageID);

      const runLoop = () => {
        if (!global.fyt2ActiveWars[threadID] || !global.fyt2ActiveWars[threadID][targetID]) return;

        let line = savageLines[Math.floor(Math.random() * savageLines.length)];
        api.sendMessage({
          body: `@${targetName} ${line}`,
          mentions: [{ tag: `@${targetName}`, id: targetID }]
        }, threadID, (err) => {
          if (!err) setTimeout(runLoop, speed);
          else delete global.fyt2ActiveWars[threadID][targetID];
        });
      };
      runLoop();
    }
  }
};
    
