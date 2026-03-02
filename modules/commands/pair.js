module.exports.config = {
  name: "pair",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Rose-Gold Edition by You",
  description: "HD Rose-Gold Couple Poster with Blurred Cover & Glow",
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
    const love = Math.floor(Math.random() * 101);

    // Select partner
    let partnerID;
    if (Object.keys(event.mentions).length > 0) {
      partnerID = Object.keys(event.mentions)[0];
    } else if (event.messageReply) {
      partnerID = event.messageReply.senderID;
    } else {
      const list = participants.filter(
        id => id !== botID && id !== event.senderID
      );
      if (list.length === 0)
        return api.sendMessage("❌ Koi aur member nahi mila!", event.threadID);
      partnerID = list[Math.floor(Math.random() * list.length)];
    }

    if (partnerID === event.senderID)
      return api.sendMessage("❌ Apne saath pairing nahi hoti 😅", event.threadID);

    // User info
    const senderInfo = await api.getUserInfo(event.senderID);
    const partnerInfo = await api.getUserInfo(partnerID);

    const senderName = senderInfo[event.senderID]?.name || "User";
    const partnerName = partnerInfo[partnerID]?.name || "User";

    const mentions = [
      { id: event.senderID, tag: senderName },
      { id: partnerID, tag: partnerName }
    ];

    // Cache
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const avt1 = path.join(cacheDir, "avt1.png");
    const avt2 = path.join(cacheDir, "avt2.png");
    const out = path.join(cacheDir, "pair.png");

    // Download avatars
    const a1 = await axios.get(
      `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`,
      { responseType: "arraybuffer" }
    );
    const a2 = await axios.get(
      `https://graph.facebook.com/${partnerID}/picture?width=512&height=512`,
      { responseType: "arraybuffer" }
    );

    fs.writeFileSync(avt1, Buffer.from(a1.data));
    fs.writeFileSync(avt2, Buffer.from(a2.data));

    // Get cover
    async function getCover(uid) {
      try {
        const res = await axios.get(
          `https://graph.facebook.com/${uid}?fields=cover&access_token=${api.getAccessToken()}`
        );
        return res.data.cover?.source || null;
      } catch {
        return null;
      }
    }

    // Canvas
    const canvas = Canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    // 🌫 Blurred cover background
    const coverURL = await getCover(event.senderID);
    if (coverURL) {
      const cover = await axios.get(coverURL, { responseType: "arraybuffer" });
      const img = await Canvas.loadImage(Buffer.from(cover.data));

      ctx.filter = "blur(18px)";
      ctx.drawImage(img, 0, 0, 1080, 1080);
      ctx.filter = "none";

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, 1080, 1080);
    } else {
      ctx.fillStyle = "#1b1b1b";
      ctx.fillRect(0, 0, 1080, 1080);
    }

    // 🌹 Rose-Gold overlay
    const roseGlow = ctx.createRadialGradient(540, 420, 200, 540, 420, 700);
    roseGlow.addColorStop(0, "rgba(230,161,180,0.45)");
    roseGlow.addColorStop(1, "rgba(230,161,180,0)");
    ctx.fillStyle = roseGlow;
    ctx.fillRect(0, 0, 1080, 1080);

    // Load avatars
    const img1 = await Canvas.loadImage(avt1);
    const img2 = await Canvas.loadImage(avt2);

    // Rose-Gold DP circle
    function drawCircleRose(image, x, y, size) {
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2 + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#E6A1B4";
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
    }

    drawCircleRose(img1, 150, 300, 350);
    drawCircleRose(img2, 580, 300, 350);

    // 💖 Rose-Gold heart glow
    ctx.font = "180px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "#E6A1B4";
    ctx.shadowBlur = 35;
    ctx.fillStyle = "#FFD1DC";
    ctx.fillText("💖", 540, 520);

    ctx.shadowBlur = 10;
    ctx.fillStyle = "#FF4D6D";
    ctx.fillText("💖", 540, 520);

    ctx.shadowBlur = 0;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    // Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 70px Arial";
    ctx.shadowColor = "#E6A1B4";
    ctx.shadowBlur = 10;

    ctx.fillText(senderName, 150, 760);
    ctx.fillText(partnerName, 580, 760);

    ctx.font = "bold 90px Arial";
    ctx.fillText(`Love: ${love}%`, 350, 920);

    ctx.shadowBlur = 0;

    // Save
    fs.writeFileSync(out, canvas.toBuffer());

    return api.sendMessage({
      body: `💖 ROSE-GOLD COUPLE 💖\n\n${senderName} ❤️ ${partnerName}\nLove Level: ${love}%`,
      mentions,
      attachment: fs.createReadStream(out)
    }, event.threadID, () => {
      fs.unlinkSync(avt1);
      fs.unlinkSync(avt2);
      fs.unlinkSync(out);
    });

  } catch (e) {
    console.error(e);
    api.sendMessage("⚠️ Error: " + e.message, event.threadID);
  }
};
