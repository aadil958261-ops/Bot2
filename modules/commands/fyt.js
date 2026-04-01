const fs = require('fs-extra');
const path = require('path');

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
        } catch (e) {}
        return content.split('\n').map(x => x.trim()).filter(x => x.length > 0);
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
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ATTAULLAH KING", // Updated credits
    description: "Advanced multi-target tagging via UID, Mention, or Name search",
    commandCategory: "Group",
    usages: "fyt on [@mention / UID / Name] [time]",
    cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, mentions, messageID } = event;
    const send = (msg) => api.sendMessage(msg, threadID, messageID);

    const action = (args[0] || '').toLowerCase();

    if (action === 'off') {
        if (!global.fytActive.has(threadID)) return send("❌ Koi system running nahi hai.");
        const { interval, timeout } = global.fytActive.get(threadID);
        clearInterval(interval);
        clearTimeout(timeout);
        global.fytActive.delete(threadID);
        return send("✅ War Stopped by ATTAULLAH KING!");
    }

    if (action !== 'on') return send("💡 Usage: fyt on @mention/UID/Name 60");

    let duration = parseInt(args[args.length - 1]);
    if (isNaN(duration)) duration = 60; 

    let targets = [];

    // 1. Mentions Check
    const mentionIDs = Object.keys(mentions || {});
    if (mentionIDs.length > 0) {
        for (let id of mentionIDs) {
            targets.push({ id, name: mentions[id].replace('@', '') });
        }
    } 
    // 2. UID or Name Search Check
    else {
        const query = args.slice(1).join(" ").replace(duration.toString(), "").trim();
        if (!query) return send("❗ Target ka naam ya UID toh likho!");

        if (/^\d+$/.test(query)) {
            try {
                const info = await api.getUserInfo(query);
                targets.push({ id: query, name: info[query].name });
            } catch (e) {
                return send("❌ Invalid UID!");
            }
        } 
        else {
            const threadInfo = await api.getThreadInfo(threadID);
            const found = threadInfo.userInfo.find(u => u.name.toLowerCase().includes(query.toLowerCase()));
            if (found) {
                targets.push({ id: found.id, name: found.name });
            } else {
                return send(`❌ Group mein "${query}" naam ka koi nahi mila.`);
            }
        }
    }

    if (global.fytActive.has(threadID)) return send("⚠️ Ek waqt mein ek hi war chal sakti hai.");

    send(`🔥 ATTAULLAH KING War Started!\n🎯 Target: ${targets.map(t => t.name).join(", ")}\n⏱️ Time: ${duration}s`);

    const interval = setInterval(async () => {
        try {
            for (let t of targets) {
                const msg = getRandomMessage();
                api.sendMessage({
                    body: `@${t.name} ${msg}`,
                    mentions: [{ tag: `@${t.name}`, id: t.id }]
                }, threadID);
            }
        } catch (e) { console.log(e); }
    }, 4000); 

    const timeout = setTimeout(() => {
        clearInterval(interval);
        global.fytActive.delete(threadID);
        api.sendMessage(`⌛ Time up! Tagging finished.`, threadID);
    }, duration * 1000);

    global.fytActive.set(threadID, { interval, timeout });
};
  
