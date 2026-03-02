module.exports.config = {
  name: "pair",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Modified by You",
  description: "HD Couple Poster with Random Background",
  commandCategory: "Love",
  usages: "pair [@mention/reply]",
  cooldowns: 15
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");
  const Canvas = require("canvas");

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const participants = threadInfo.participantIDs;
    const botID = api.getCurrentUserID();
    const tle = Math.floor(Math.random() * 101);

    // Select partner
    let id;
    if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0];
    } else if (event.messageReply) {
      id = event.messageReply.senderID;
    } else {
      const list = participants.filter(uid => uid != botID && uid != event.senderID);
      if (list.length === 0)
        return api.sendMessage("❌ Group mein koi aur member nahi mila!", event.threadID);
      id = list[Math.floor(Math.random() * list.length)];
    }

    if (id == event.senderID)
      return api.sendMessage("❌ Aap apne saath pairing nahi kar sakte!", event.threadID);

    // Get user info
    const senderInfo = await api.getUserInfo(event.senderID);
    const partnerInfo = await api.getUserInfo(id);

    const senderName = senderInfo[event.senderID]?.name || "User";
    const partnerName = partnerInfo[id]?.name || "User";

    const arraytag = [
      { id: event.senderID, tag: senderName },
      { id: id, tag: partnerName }
    ];

    // Create cache folder
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const avtPath1 = path.join(cacheDir, `avt1.png`);
    const avtPath2 = path.join(cacheDir, `avt2.png`);
    const posterPath = path.join(cacheDir, `couple.png`);

    // Download avatars
    const avatar1 = await axios.get(
      `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`,
      { responseType: "arraybuffer" }
    );
    const avatar2 = await axios.get(
      `https://graph.facebook.com/${id}/picture?width=512&height=512`,
      { responseType: "arraybuffer" }
    );

    fs.writeFileSync(avtPath1, Buffer.from(avatar1.data));
    fs.writeFileSync(avtPath2, Buffer.from(avatar2.data));

    // Create Canvas
    const canvas = Canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    // Auto Random Background
    const bgFolder = path.join(__dirname, "cache", "background");
    if (!fs.existsSync(bgFolder)) fs.mkdirSync(bgFolder, { recursive: true });

    const backgrounds = fs.readdirSync(bgFolder).filter(file =>
      file.endsWith(".jpg") || file.endsWith(".png")
    );

    if (backgrounds.length === 0) {
      ctx.fillStyle = "#ff4d6d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      const bgPath = path.join(bgFolder, randomBg);
      const background = await Canvas.loadImage(bgPath);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    const img1 = await Canvas.loadImage(avtPath1);
    const img2 = await Canvas.loadImage(avtPath2);

    function drawCircle(image, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
    }

    drawCircle(img1, 150, 300, 350);
    drawCircle(img2, 580, 300, 350);

    ctx.font = "150px Arial";
    ctx.fillText("💖", 470, 520);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 70px Arial";
    ctx.fillText(senderName, 150, 750);
    ctx.fillText(partnerName, 580, 750);

    ctx.font = "bold 90px Arial";
    ctx.fillText(`Love: ${tle}%`, 350, 900);

    const buffer = canvas.toBuffer();
    fs.writeFileSync(posterPath, buffer);

    return api.sendMessage({
      body: `💞 COUPLE POSTER GENERATED 💞\n\n${senderName} ❤️ ${partnerName}\nLove Level: ${tle}%`,
      mentions: arraytag,
      attachment: fs.createReadStream(posterPath)
    }, event.threadID, () => {
      fs.unlinkSync(avtPath1);
      fs.unlinkSync(avtPath2);
      fs.unlinkSync(posterPath);
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Error: " + err.message, event.threadID);
  }
};
