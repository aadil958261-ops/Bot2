const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

// -----------------------------
// ⚡ CONFIGURATION (Set API Keys Here)
// -----------------------------
const OPENAI_API_KEYS = [
  "csk-efnfrmmkc5k3vjfjpvf6ck9hp6ypcd9xd3hxxmncc3yv3m46",   // Primary key
  "csk-p89krjk8t2xmvv8hm8txhcfp9my8mxfrhf2ed5cc5n5xvj4v"     // Backup key
];

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

module.exports.config = {
  name: "edit4",
  version: "1.7.0",
  hasPermssion: 0,
  credits: "ATTAULLAH",
  description: "Stylish image editing & logo creation with API fallback & button listener",
  commandCategory: "Media",
  usages: "[prompt] - Reply to image\n.logo [prompt] - Generate logo",
  prefix: true,
  cooldowns: 10
};

const styles = ["neon", "graffiti", "vintage", "3D", "cartoon", "minimalist"];

// -----------------------------
// ⚡ HELP MESSAGE
// -----------------------------
async function sendHelp(api, threadID) {
  const helpMessage = `
📌 **Bot Guide for Stylish Editing & Logo Creation (edit4)**

**1️⃣ Stylish Image Edit**
Reply to any image and use command:
.edit4 [prompt]

**Click a style button after sending to apply style.**

**2️⃣ Logo Creation**
Use command:
.logo [prompt]

**Example Commands:**
.edit4 Add "Happy Birthday" in text
.logo Tech startup logo, futuristic font

✨ Powered by ATTAULLAH
`;
  api.sendMessage(helpMessage, threadID);
}

// -----------------------------
// ⚡ API CALL WITH FALLBACK
// -----------------------------
async function callOpenAI(form, endpoint = "edits") {
  for (let i = 0; i < OPENAI_API_KEYS.length; i++) {
    try {
      const url = `https://api.openai.com/v1/images/${endpoint}`;
      const response = await axios.post(url, form, {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${OPENAI_API_KEYS[i]}` },
        timeout: 120000
      });
      if (response.data?.data?.length > 0) return response;
    } catch (err) {
      console.log(`⚠️ API key #${i + 1} failed: ${err.message}`);
      if (i === OPENAI_API_KEYS.length - 1) throw err;
    }
  }
}

// -----------------------------
// ⚡ STYLE SELECTION
// -----------------------------
async function sendStyleSelector(api, threadID, messageID, prompt) {
  let body = `🎨 Choose a style for your image:\nPrompt: ${prompt}`;
  const buttons = styles.map(style => ({
    type: "reply",
    reply: { id: `style_${style}_${Date.now()}`, title: style }
  }));
  buttons.push({ type: "reply", reply: { id: `style_cancel_${Date.now()}`, title: "Cancel" } });
  return api.sendMessage({ body, buttons }, threadID, messageID);
}

// -----------------------------
// ⚡ HANDLE STYLE CLICK
// -----------------------------
async function handleStyleSelection(api, threadID, style, imageUrl, prompt) {
  if (!styles.includes(style)) return;

  const processingMsg = await api.sendMessage(`🎨 Applying ${style} style...\n⏳ Please wait...`, threadID);

  try {
    // Download image
    const imagePath = path.join(CACHE_DIR, `input_${Date.now()}.png`);
    const imgResp = await axios({ url: imageUrl, method: "GET", responseType: "stream" });
    const writer = fs.createWriteStream(imagePath);
    imgResp.data.pipe(writer);
    await new Promise((res, rej) => writer.on("finish", res).on("error", rej));

    // OpenAI edit
    const styledPrompt = `Stylish ${style} edit: ${prompt}. Use vibrant colors, creative fonts, modern aesthetics.`;
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("image", fs.createReadStream(imagePath));
    form.append("prompt", styledPrompt);

    const response = await callOpenAI(form, "edits");
    const resultUrl = response.data?.data[0]?.url;
    if (!resultUrl) throw new Error("No edited image returned");

    // Download edited image
    const editedPath = path.join(CACHE_DIR, `edit4_${Date.now()}.png`);
    const editedResp = await axios({ url: resultUrl, method: "GET", responseType: "stream" });
    const editedWriter = fs.createWriteStream(editedPath);
    editedResp.data.pipe(editedWriter);
    await new Promise((res, rej) => editedWriter.on("finish", res).on("error", rej));

    api.sendMessage(
      { body: `✨ Stylish edit done! Style: ${style}\nPrompt: ${prompt}`, attachment: fs.createReadStream(editedPath) },
      threadID,
      () => {
        fs.promises.unlink(imagePath).catch(() => {});
        fs.promises.unlink(editedPath).catch(() => {});
        api.unsendMessage(processingMsg.messageID);
      }
    );
  } catch (err) {
    api.sendMessage(`❌ Error applying style: ${err.message}`, threadID);
    api.unsendMessage(processingMsg.messageID);
  }
}

// -----------------------------
// ⚡ LOGO GENERATION
// -----------------------------
async function generateLogo(api, threadID, prompt) {
  const processingMsg = await api.sendMessage(`🎨 Generating logo...\n⏳ Please wait...`, threadID);

  try {
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", `Logo design: ${prompt}. Minimalist, vector style, transparent background, high quality`);
    form.append("size", "1024x1024");

    const response = await callOpenAI(form, "generations");
    const resultUrl = response.data?.data[0]?.url;
    if (!resultUrl) throw new Error("No logo image returned");

    const logoPath = path.join(CACHE_DIR, `logo_${Date.now()}.png`);
    const logoResp = await axios({ url: resultUrl, method: "GET", responseType: "stream" });
    const logoWriter = fs.createWriteStream(logoPath);
    logoResp.data.pipe(logoWriter);
    await new Promise((res, rej) => logoWriter.on("finish", res).on("error", rej));

    api.sendMessage(
      { body: `✨ Logo generated!\nPrompt: ${prompt}`, attachment: fs.createReadStream(logoPath) },
      threadID,
      () => {
        fs.promises.unlink(logoPath).catch(() => {});
        api.unsendMessage(processingMsg.messageID);
      }
    );
  } catch (err) {
    api.sendMessage(`❌ Error generating logo: ${err.message}`, threadID);
    api.unsendMessage(processingMsg.messageID);
  }
}

// -----------------------------
// ⚡ BUTTON CLICK LISTENER
// -----------------------------
module.exports.onReply = async ({ api, event, replyIdStore }) => {
  const { messageID, body, senderID } = event;

  // Parse reply id to detect style
  if (!body || !body.startsWith("style_")) return;
  const parts = body.split("_");
  const action = parts[1];

  if (action === "cancel") {
    api.unsendMessage(messageID);
    return;
  }

  const style = action;
  const originalImageUrl = replyIdStore?.[senderID]?.imageUrl;
  const prompt = replyIdStore?.[senderID]?.prompt;

  if (!originalImageUrl || !prompt) return;

  handleStyleSelection(api, event.threadID, style, originalImageUrl, prompt);
  api.unsendMessage(messageID);
};

// -----------------------------
// ⚡ MAIN RUN
// -----------------------------
module.exports.run = async ({ api, event, args, commandName, replyIdStore }) => {
  const { threadID, messageID, messageReply } = event;

  if (commandName === "edit4") {
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) return sendHelp(api, threadID);
    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo") return sendHelp(api, threadID);

    const prompt = args.join(" ").trim();
    if (!prompt) return sendHelp(api, threadID);

    // Store original image & prompt for button listener
    replyIdStore[event.senderID] = { imageUrl: attachment.url, prompt };

    await sendStyleSelector(api, threadID, messageID, prompt);

  } else if (commandName === "logo") {
    const prompt = args.join(" ").trim();
    if (!prompt) return sendHelp(api, threadID);

    await generateLogo(api, threadID, prompt);
  } else {
    sendHelp(api, threadID);
  }
};
