module.exports.config = {
    name: "fyt2",
    version: "1.3.1",
    hasPermssion: 2,
    credits: "ATTAULLAH BHAI",
    description: "War with UID, Tag & On/Off (Fixed & Slower)",
    commandCategory: "group",
    usages: "fyt2 [on/off] [UID/@mention/name]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

const fs = require("fs-extra");
const path = require("path");

if (!global.fytActiveThreads) {
    global.fytActiveThreads = new Map();
}

const galiyanPath = path.join(__dirname, "galiyan.json");
let galiyan = [];

try {
    galiyan = JSON.parse(fs.readFileSync(galiyanPath, "utf8"));
} catch (e) {
    console.log("Galiyan file load nahi hui:", e);
}

module.exports.run = async function({ api, args, event }) {
    const { threadID, messageID, mentions } = event;
    const action = args[0]?.toLowerCase();

    // STOP COMMAND
    if (action === "off") {
        if (global.fytActiveThreads.has(threadID)) {
            clearInterval(global.fytActiveThreads.get(threadID));
            global.fytActiveThreads.delete(threadID);
            return api.sendMessage("❌ FYT2 War command band kar di gayi hai. Credits: ATTAULLAH BHAI", threadID, messageID);
        } else {
            return api.sendMessage("FYT2 pehle se hi band hai.", threadID, messageID);
        }
    }

    // START COMMAND
    if (action === "on") {
        if (global.fytActiveThreads.has(threadID)) {
            return api.sendMessage("FYT2 pehle se hi chal raha hai.", threadID, messageID);
        }

        let targetID = "";
        let targetName = "";

        if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
            targetName = mentions[targetID].replace("@", "");
        } else if (args[1] && !isNaN(args[1])) {
            targetID = args[1];
            targetName = "Oye";
        } else {
            targetName = args.slice(1).join(" ") || "Oye";
        }

        const randomGali = () => {
            if (!galiyan || galiyan.length === 0) return "Abe Oye! 😡";
            return galiyan[Math.floor(Math.random() * galiyan.length)];
        };

        api.sendMessage(`✅ FYT2 War Mode ON!\nTarget: ${targetName}\nSpeed: Slow\nBy: ATTAULLAH BHAI`, threadID);

        // Speed: 3 seconds per message
        const intervalTime = 3000; 

        const interval = setInterval(() => {
            const msg = randomGali();
            if (targetID) {
                api.sendMessage({
                    body: `${targetName} ${msg}`,
                    mentions: [{ tag: targetName, id: targetID }]
                }, threadID);
            } else {
                api.sendMessage(`${targetName} ${msg}`, threadID);
            }
        }, intervalTime);

        global.fytActiveThreads.set(threadID, interval);
        return;
    }

    return api.sendMessage("Usage: fyt2 on [UID/@tag/name] ya fyt2 off", threadID, messageID);
}
  
