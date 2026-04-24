const fs = require('fs-extra');
const path = require('path');

// Global map to handle multiple threads independently
if (!global.fytActive) {
    global.fytActive = new Map();
}

const filePath = path.join(__dirname, 'galiyan.json2');

function getMessages() {
    try {
        if (!fs.existsSync(filePath)) return ['File missing!'];
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
    name: "fyt",
    version: "3.0.0",
    hasPermssion: 2, 
    credits: "ATTAULLAH KING",
    description: "Multiple War support for Bot Admins",
    commandCategory: "Admin",
    usages: "fyt on [@mention/UID/Name] [time] | fyt off",
    cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, mentions, messageID, senderID } = event;
    const send = (msg) => api.sendMessage(msg, threadID, messageID);

    // --- Admin Lock ---
    const adminIDs = global.config.ADMINBOT || [];
    if (!adminIDs.includes(senderID)) {
        return send("❌ Access Denied: Yeh command sirf ATTAULLAH KING ke admins ke liye hai.");
    }

    const action = (args[0] || '').toLowerCase();

    // --- Stop War Function ---
    if (action === 'off') {
        if (!global.fytActive.has(threadID)) {
            return send("❌ Is group mein koi war nahi chal rahi.");
        }
        const { interval, timeout } = global.fytActive.get(threadID);
        clearInterval(interval);
        clearTimeout(timeout);
        global.fytActive.delete(threadID);
        return send("✅ War Stopped in this group!");
    }

    if (action !== 'on') return send("💡 Usage: fyt on @mention 60 (Seconds)");

    // Multi-War Check: Is group mein already chal rahi hai?
    if (global.fytActive.has(threadID)) {
        return send("⚠️ Is group mein pehle se ek war chal rahi hai. Pehle 'fyt off' karein.");
    }

    let duration = parseInt(args[args.length - 1]);
    if (isNaN(duration)) duration = 60;

    let targets = [];

    // Target Logic
    const mentionIDs = Object.keys(mentions || {});
    if (mentionIDs.length > 0) {
        for (let id of mentionIDs) {
            targets.push({ id, name: mentions[id].replace('@', '') });
        }
    } else {
        const query = args.slice(1).filter(arg => arg != duration).join(" ").trim();
        if (!query) return send("❗ Target identify karein (Name/UID/@mention)");

        if (/^\d+$/.test(query)) {
            try {
                const info = await api.getUserInfo(query);
                targets.push({ id: query, name: info[query].name });
            } catch (e) { return send("❌ Invalid UID!"); }
        } else {
            const threadInfo = await api.getThreadInfo(threadID);
            const found = threadInfo.userInfo.find(u => u.name.toLowerCase().includes(query.toLowerCase()));
            if (found) {
                targets.push({ id: found.id, name: found.name });
            } else {
                return send(`❌ "${query}" group mein nahi mila.`);
            }
        }
    }

    if (targets.length === 0) return send("❌ Target nahi mil saka.");

    send(`🚀 Multiple War Activated!\n🎯 Targets: ${targets.map(t => t.name).join(", ")}\n⏱️ Limit: ${duration}s`);

    // Start Interval for this specific thread
    const interval = setInterval(async () => {
        try {
            for (let t of targets) {
                const msg = getRandomMessage();
                api.sendMessage({
                    body: `@${t.name} ${msg}`,
                    mentions: [{ tag: `@${t.name}`, id: t.id }]
                }, threadID);
            }
        } catch (e) { console.log("War Error:", e); }
    }, 3500); // Har 3.5 seconds mein tag

    // Auto-stop for this specific thread
    const timeout = setTimeout(() => {
        if (global.fytActive.has(threadID)) {
            clearInterval(interval);
            global.fytActive.delete(threadID);
            api.sendMessage(`⌛ Time Up! War ended automatically in this group.`, threadID);
        }
    }, duration * 1000);

    // Store in Global Map using threadID as key
    global.fytActive.set(threadID, { interval, timeout });
};
        
