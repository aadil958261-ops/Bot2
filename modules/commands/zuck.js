const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "zuck",
    version: "1.0.1",
    hasPermssion: 0,
    prefix: true,
    credits: "Raza",
    premium:false,
    commandCategory: "group",
    description: "Comment on the board ( ͡° ͜ʖ ͡°)",
    usages: "zuck [text]",
    cooldowns: 10,
    dependencies: {
        "canvas":"",
        "axios":"",
        "fs-extra":""
    }
};

async function wrapText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
        else {
            lines.push(line.trim());
            line = '';
        }
        if (words.length === 0) lines.push(line.trim());
    }
    return lines;
}

module.exports.run = async function({ api, event, args }) {
    let { threadID, messageID } = event;
    let pathImg = __dirname + '/cache/zuck.png';
    var text = args.join(" ");
    if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);

    try {
        let getImg = (await axios.get(`https://i.postimg.cc/gJCXgKv4/zucc.jpg`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(pathImg, Buffer.from(getImg, 'utf-8'));
        let baseImage = await loadImage(pathImg);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.font = "400 18px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        
        const lines = await wrapText(ctx, text, 470);
        ctx.fillText(lines.join('\n'), 15, 75);
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
    } catch (e) {
        return api.sendMessage("Error: " + e.message, threadID, messageID);
    }
}
