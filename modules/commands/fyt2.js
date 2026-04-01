const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fyt2",
    version: "6.2.0",
    credits: "ATTAULLAH KING",
    countDown: 5,
    role: 2,
    shortDescription: "War script using galiyan.json",
    longDescription: "Starts an infinite loop fetching lines from galiyan.json array.",
    category: "war",
    guide: "{pn} on [target] or {pn} off"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    
    // Path: modules folder ke andar 'galiyan.json'
    const jsonPath = path.join(__dirname, "galiyan.json");

    if (!global.fyt2War) global.fyt2War = new Map();

    if (args[0] === "off") {
      global.fyt2War.delete(threadID);
      return message.reply("FYT-2 War mode OFF ho gaya! ✅");
    }

    if (args[0] === "on") {
      let target = args.slice(1).join(" ");
      if (!target) return message.reply("Target ka naam ya UID toh likho! 😤");

      if (!fs.existsSync(jsonPath)) {
        return message.reply("Error: galiyan.json file nahi mili. Check karo ke file 'modules' folder mein hai ya nahi.");
      }

      if (global.fyt2War.has(threadID)) {
        return message.reply("War pehle se hi on hai! 🔥");
      }

      // JSON file read karke array mein convert karna
      const rawData = fs.readFileSync(jsonPath, "utf-8");
      const savageLines = JSON.parse(rawData); 

      if (!Array.isArray(savageLines) || savageLines.length === 0) {
        return message.reply("Error: galiyan.json khali hai ya format sahi nahi hai!");
      }

      global.fyt2War.set(threadID, true);
      message.reply(`FYT-2 War started on: ${target} 😈\nTotal lines loaded: ${savageLines.length}`);

      async function startWar() {
        if (!global.fyt2War.has(threadID)) return;

        // Array se random line uthana
        let randomLine = savageLines[Math.floor(Math.random() * savageLines.length)];
        let finalMessage = `${target} ${randomLine}`;

        api.sendMessage(finalMessage, threadID, (err) => {
          if (!err) {
            // 600ms ka delay (aapke requirement ke mutabiq)
            setTimeout(startWar, 600); 
          }
        });
      }

      startWar();
    } else {
      message.reply("Use: fyt2 on [target] or fyt2 off");
    }
  }
};
