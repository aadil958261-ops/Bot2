const fs = require('fs-extra');
const path = require('path');

if (!global.fyt2Active) {
    global.fyt2Active = new Map();
}

// File path updated to galiyan.json
const filePath = path.join(__dirname, 'galiyan.json');

function getMessages() {
    try {
        if (!fs.existsSync(filePath)) return ['File missing! galiyan.json banayein.'];
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            const json = JSON.parse(content);
            if (Array.isArray(json)) return json.filter(x => typeof x === 'string' && x.trim());
        } catch (e) {
            return content.split('\n').map(x => x.trim()).filter(x => x.length > 0);
        }
    } catch (err) {
        return ['Error reading file'];
    }
}

function getRandomMessage() {
    const msgs = getMessages();
    return msgs[Math.floor(Math.random() * msgs.length)];
}

module.exports.config = {
    name: "fyt2",
    version: "4.0.0",
    hasPermssion: 2, 
    credits: "ATTAULLAH KING",
    description: "Advanced Multi-Target War with Reply Support",
    commandCategory: "Admin",
    usages: "fyt2 on [@mention/Reply/UID] [seconds] | fyt2 off",
    cooldowns: 2
};

module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, mentions, messageID, senderID, type, messageReply } = event;
    const send = (msg) => api.sendMessage(msg, threadID, messageID);

    // --- Admin Lock ---
    const adminIDs = global.config.ADMINBOT || [];
    if (!adminIDs.includes(senderID)) {
        return send("❌ Access Denied: Yeh command sirf ATTAULLAH KING ke admins ke liye hai.");
    }

    const action = (args[0] || '').toLowerCase();

    // --- Stop War Function ---
    if (action === 'off') {
        if (!global.fyt2Active.has(threadID)) {
            return send("❌ Is group mein koi war nahi chal rahi.");
        }
        const activeWar = global.fyt2Active.get(threadID);
        // Agar multiple targets hain toh sab ko clear karega
        for (let targetID in activeWar) {
            clearInterval(activeWar[targetID].interval);
        }
        global.fyt2Active.delete(threadID);
        return send("✅ All Wars Stopped in this group by ATTAULLAH KING!");
    }

    if (action !== 'on') return send("💡 Usage: fyt2 on [Reply/Mention] [time]");

    // Default time set to 60s agar specify na ho
    let duration = parseInt(args[args.length - 1]);
    if (isNaN(duration)) duration = 60;

    let targetID, targetName;

    // --- 1. Target by Reply ---
    if (type === "message_reply") {
        targetID = messageReply.senderID;
        try {
            const info = await api.getUserInfo(targetID);
            targetName = info[targetID].name;
        } catch (e) { targetName = "Target"; }
    } 
    // --- 2. Target by Mention ---
    else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace('@', '');
    } 
    // --- 3. Target by UID or Name Search ---
    else {
        const query = args.slice(1).filter(arg => arg != duration).join(" ").trim();
        if (!query) return send("❗ Target identify karein (Reply karein, Mention karein ya UID likhein)");

        if (/^\d+$/.test(query)) {
            try {
                const info = await api.getUserInfo(query);
                targetID = query;
                targetName = info[query].name;
            } catch (e) { return send("❌ Invalid UID!"); }
        } else {
            const threadInfo = await api.getThreadInfo(threadID);
            const found = threadInfo.userInfo.find(u => u.name.toLowerCase().includes(query.toLowerCase()));
            if (found) {
                targetID = found.id;
                targetName = found.name;
            } else {
                return send(`❌ "${query}" group mein nahi mila.`);
            }
        }
    }

    if (!targetID) return send("❌ Target nahi mil saka.");

    // Multi-Target Storage Logic
    if (!global.fyt2Active.has(threadID)) {
        global.fyt2Active.set(threadID, {});
    }

    const currentGroupWars = global.fyt2Active.get(threadID);
    if (currentGroupWars[targetID]) {
        return send(`⚠️ ${targetName} par pehle se war chal rahi hai.`);
    }

    send(`🚀 fyt2 War Activated!\n🎯 Target: ${targetName}\n⏱️ Limit: ${duration}s`);

    // Start Loop
    const interval = setInterval(() => {
        try {
            const msg = getRandomMessage();
            api.sendMessage({
                body: `@${targetName} ${msg}`,
                mentions: [{ tag: `@${targetName}`, id: targetID }]
            }, threadID);
        } catch (e) { console.log(e); }
    }, 3000); // 3 seconds gap

    // Store interval
    currentGroupWars[targetID] = { interval };

    // Auto-stop after duration
    setTimeout(() => {
        if (currentGroupWars[targetID]) {
            clearInterval(currentGroupWars[targetID].interval);
            delete currentGroupWars[targetID];
            api.sendMessage(`⌛ Time up for ${targetName}!`, threadID);
        }
    }, duration * 1000);
};
