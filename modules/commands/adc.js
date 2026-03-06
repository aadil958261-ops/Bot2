const axios = require('axios');
const fs = require('fs');
const { PasteClient } = require('pastebin-api');

const OWNER_ID = "100003615741592"; // ⚠️ Apni Facebook UID yahan dalo

module.exports.config = {
    name: "adc",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Thjhn | Edit by Attaullah",
    description: "Upload code to pastebin (Owner Only)",
    commandCategory: "Admin",
    usages: "[reply or filename]",
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID, messageID, messageReply, type } = event;

    // 🔐 OWNER ONLY CHECK
    if (senderID != OWNER_ID) {
        return api.sendMessage(
            "❌ | Sirf bot owner ye command use kar sakta hai.",
            threadID,
            messageID
        );
    }

    var name = args[0];
    var text;

    if (type == "message_reply") {
        text = messageReply.body;
    }

    if (!text && !name) {
        return api.sendMessage(
            "❎ Reply link ya file name do taake code pastebin par upload ho sake!",
            threadID,
            messageID
        );
    }

    if (!text && name) {
        fs.readFile(`${__dirname}/${name}.js`, "utf-8", async (err, data) => {
            if (err) {
                return api.sendMessage(
                    `❎ Command ${name} exist nahi karti`,
                    threadID,
                    messageID
                );
            }

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
        });

        return;
    }

    const urlR = /(https?:\/\/[^\s]+)/g;
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(res => {
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                res.data,
                "utf-8",
                function (err) {
                    if (err) {
                        return api.sendMessage(
                            `⚠️ Error applying code to ${args[0]}.js`,
                            threadID,
                            messageID
                        );
                    }

                    api.sendMessage(
                        `✅ Code successfully applied to ${args[0]}.js`,
                        threadID,
                        messageID
                    );
                }
            );
        });
    }
};
