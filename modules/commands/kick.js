module.exports.config = {
    name: "kick",
    version: "1.0.2",
    hasPermssion: 1,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Remove users with hierarchy protection",
    commandCategory: "Admin",
    usages: "[tag/reply/UID/all]",
    cooldowns: 0
};

module.exports.run = async function ({ args, api, event, Threads, permssion }) {
    const { threadID, messageID, senderID, type, mentions } = event;
    const botID = api.getCurrentUserID();
    const footer = "\n\n— » 𝐒𝐈𝐍𝐃𝐇𝐈 « —";
    
    // Get thread info to check for Group Admins
    const threadInfo = (await Threads.getData(threadID)).threadInfo;
    const groupAdmins = threadInfo.adminIDs.map(item => item.id);
    
    // Get Bot Admins from config
    const botAdmins = global.config.ADMINBOT || [];
    const botSupporters = global.config.NDH || [];
    const allBotAdmins = [...botAdmins, ...botSupporters];

    async function canKick(targetID) {
        // 1. Never kick Bot Admins/Supporters
        if (allBotAdmins.includes(targetID)) return { possible: false, reason: "I cannot remove a Bot Admin!" };
        
        // 2. If the sender is a Bot Admin (Level 2 or 3), they can kick anyone else
        if (permssion >= 2) return { possible: true };

        // 3. If sender is just a Group Admin, they cannot kick other Group Admins
        if (groupAdmins.includes(targetID)) return { possible: false, reason: "I cannot remove another Group Admin unless a Bot Admin tells me to!" };

        return { possible: true };
    }

    async function executeKick(id) {
        if (id == botID) return;
        const check = await canKick(id);
        if (check.possible) {
            api.removeUserFromGroup(id, threadID);
        } else {
            api.sendMessage(`⚠️ Action Denied: ${check.reason}` + footer, threadID, messageID);
        }
    }

    try {
        // Handle Mentions
        if (Object.keys(mentions).length !== 0) {
            for (let id in mentions) {
                await executeKick(id);
            }
        } 
        // Handle Reply
        else if (type == "message_reply") {
            await executeKick(event.messageReply.senderID);
        } 
        // Handle "all"
        else if (args[0] == "all") {
            if (permssion < 2) return api.sendMessage("❌ Only Bot Admins can use 'all' command." + footer, threadID, messageID);
            const listUserID = event.participantIDs.filter(ID => ID != botID && ID != senderID);
            for (let idUser of listUserID) {
                setTimeout(() => { executeKick(idUser); }, 1000);
            }
        } 
        // Handle UID
        else if (args[0] && !isNaN(args[0])) {
            await executeKick(args[0]);
        } 
        else {
            return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴, 𝗿𝗲𝗽𝗹𝘆, 𝗼𝗿 𝘁𝘆𝗽𝗲 𝘁𝗵𝗲 𝗨𝗜𝗗." + footer, threadID, messageID);
        }
    } catch (e) {
        return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❌ Error: Make sure the bot is an admin in this group." + footer, threadID, messageID);
    }
}
    
