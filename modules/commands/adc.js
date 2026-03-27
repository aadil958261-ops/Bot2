const axios = require('axios');
const fs = require('fs');
const { PasteClient } = require('pastebin-api');

// 🔥 MULTI OWNER UID
const allowedUIDs = ["100003615741592","100003889376568","61584291400048"];

module.exports.config = {
    name: "adc",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Thjhn | Edit by Attaullah",
    description: "Upload code to pastebin (Owner Only)",
    commandCategory: "Admin",
    usages: "[reply or filename]",
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID, messageID, messageReply, type } = event;

    // 🔒 ACCESS CONTROL
    if (!allowedUIDs.includes(senderID)) {
        return api.sendMessage(
            "❌ | Sirf bot owner ye command use kar sakta hai.",
            threadID,
            messageID
        );
    }

    const name = args[0];
    let text;

    if (type == "message_reply") {
        text = messageReply.body;
    }

    if (!name && !text) {
        return api.sendMessage(
            "❎ Reply karo ya command name do!",
            threadID,
            messageID
        );
    }

    // 📤 Upload command file to pastebin
    if (name && !text) {
        const filePath = `${__dirname}/${name}.js`;

        if (!fs.existsSync(filePath)) {
            return api.sendMessage(
                `❎ Command ${name} exist nahi karti`,
                threadID,
                messageID
            );
        }

        const data = fs.readFileSync(filePath, "utf-8");

        const client = new PasteClient("P5FuV7J-UfXWFmF4lUTkJbGnbLBbLZJo");

        try {
            const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
            });

            const id = url.split('/')[3];
            const raw = 'https://pastebin.com/raw/' + id;

            return api.sendMessage(raw, threadID, messageID);

        } catch (error) {
            return api.sendMessage(
                `⚠️ Pastebin error: ${error.message}`,
                threadID,
                messageID
            );
        }
    }

    // 📥 Apply code from link
    const urlR = /(https?:\/\/[^\s]+)/g;
    const url = text.match(urlR);

    if (url && name) {
        axios.get(url[0]).then(res => {
            fs.writeFile(
                `${__dirname}/${name}.js`,
                res.data,
                "utf-8",
                function (err) {
                    if (err) {
                        return api.sendMessage(
                            `⚠️ Error applying code to ${name}.js`,
                            threadID,
                            messageID
                        );
                    }

                    api.sendMessage(
                        `✅ Code successfully applied to ${name}.js`,
                        threadID,
                        messageID
                    );
                }
            );
        });
    }
};
