module.exports.config = {
    hasPermssion: 1, 
    credits: "**Kashif Raza**",
    name: "antispam", 
    commandCategory: "Admin",
    usages: "set/on/off [count] [time]",
    version: "1.0.0", 
    cooldowns: 0,
    description: "Automatically kick users for spamming in the group",
};

const fs = require("fs-extra");
let antiSpamStatus = {};
let usersSpam = {};
const path = "./modules/commands/cache/data/antispamStatus.json";

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID } = event;
    if (!fs.existsSync(path)) {
        antiSpamStatus = {};
        fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
    } else {
        antiSpamStatus = JSON.parse(fs.readFileSync(path));
    }
    let settings = antiSpamStatus[event.threadID]; 
    if (!settings || !settings.status) return;
    if (!usersSpam[senderID]) {
        usersSpam[senderID] = {
            count: 0,
            start: Date.now()
        };
    }
    usersSpam[senderID].count++;
    if (Date.now() - usersSpam[senderID].start > settings.spamTime) {
        if (usersSpam[senderID].count > settings.spamCount && settings.status) {
            api.removeUserFromGroup(senderID, threadID);
            api.sendMessage({
                body: `⚝──⭒─⭑─⭒──⚝\n**User **Attaullah Sindhi** automatically kicked due to spam**\n⚝──⭒─⭑─⭒──⚝`,
                mentions: [{
                    tag: `**Attaullah Sindhi**`,
                    id: senderID
                }]
            }, threadID);
        }
        usersSpam[senderID].count = 0;
        usersSpam[senderID].start = Date.now();
    }
};

module.exports.run = async function ({event, api, args}) {
    let infoThread = await api.getThreadInfo(event.threadID);
    let adminIDs = infoThread.adminIDs.map(e => e.id);
    var idBot = api.getCurrentUserID();
    switch(args[0]) {
        case "set":
            if (!adminIDs.includes(idBot)) {
                api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Bot is not an admin in the group, so it cannot set the configuration!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
                return;
            }
            let newCount = parseInt(args[1]);
            let newTime = parseInt(args[2]);
            if (!newCount || !newTime) {
                api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Please provide both the number of messages and a valid time (in milliseconds)**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
                return;
            }
            antiSpamStatus[event.threadID] = {
                spamCount: newCount,
                spamTime: newTime,
                status: false
            };
            fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
            api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Configuration set successfully!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
            break;
        case "on":
            if (!adminIDs.includes(idBot)) {
                api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Bot is not an admin in the group, so it cannot activate anti-spam mode!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
                return;
            }
            if (!antiSpamStatus[event.threadID]) {
                api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Please use 'antispam set [count] [time]'**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
                return;
            }
            antiSpamStatus[event.threadID].status = true;
            fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
            api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Anti-spam mode enabled!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
            break;
        case "off":
            if (antiSpamStatus[event.threadID]) {
                antiSpamStatus[event.threadID].status = false;
                fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
                api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Anti-spam mode disabled!**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
            }
            break;
        default:
            api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Usage: antispam set/on/off [count] [time]**\n⚝──⭒─⭑─⭒──⚝`, event.threadID);
    }
};
