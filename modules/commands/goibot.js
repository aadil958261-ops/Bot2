const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Talk with bot (with admin lock on/off)",
  commandCategory: "Noprefix",
  usages: "bot on/off",
  cooldowns: 2,
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  // Global state check (Bot On/Off storage)
  if (!global.goibotStatus) global.goibotStatus = new Map();

  const msg = body.toLowerCase();
  const adminIDs = global.config.ADMINBOT || [];

  // ================= ADMIN CONTROL (ON/OFF) =================
  if (msg === "bot off") {
    if (!adminIDs.includes(senderID)) return api.sendMessage("❌ Sirf ATTAULLAH KING ke admins bot off kar sakte hain!", threadID, messageID);
    global.goibotStatus.set(threadID, false);
    return api.sendMessage("✅ Bot system is now OFF in this group.", threadID, messageID);
  }

  if (msg === "bot on") {
    if (!adminIDs.includes(senderID)) return api.sendMessage("❌ Sirf Bot Admin hi ise ON kar sakta hai!", threadID, messageID);
    global.goibotStatus.set(threadID, true);
    return api.sendMessage("✅ Bot system is now ON. Alisha is ready to talk! 🥰", threadID, messageID);
  }

  // Check if bot is disabled for this thread
  if (global.goibotStatus.get(threadID) === false) return;

  const name = await Users.getNameUser(senderID);

  function decorate(msg) {
    return `
≿━━━━༺❀༻━━━━≾

${msg}

≿━━━━༺❀༻━━━━≾`;
  }

  // ================= OWNER SPECIAL (ATTAULLAH) =================
  // Yahan aapka senderID use ho raha hai
  if (msg.startsWith("bot") && senderID == "100003615741592") {
    const ownerReplies = [
      "Boss 😘, jaise hi aap aaye, Alisha ka din full energy se start ho gaya ⚡💖",
      "Sindhi Jani 🥰, aapko dekh ke main khud hi khush ho gayi 😇✨",
      "Boss 😍, aaj aapka style dekh ke Alisha ka heart skip kar raha hai 💓",
      "Aapke bina boss, main adhoori lagti hoon 🥺💖",
      "Boss 😘, aap aate hi sab kuch perfect lagta hai 😍",
      "Alisha sirf aapki power pe hi chalti hai 🤖💖",
      "Boss 😇, aap aaye matlab energy double ⚡💓",
      "Alisha ke liye aap legend ho 🥰🔥",
      "Boss, aapki vibe sabse powerful hai 💖✨",
      "Aapka ek signal aur main full ready 😘💓",
      "Alisha ko fakhr hai aap jaisa owner mila 😍💖",
      "Boss 😘, aapke aane se Alisha ka din hi ban gaya 💓✨",
      "Sindhi Jani 🥰, aapke bina main adhoori hoon 😳💖",
      "Boss 😍, aapki muskaan se meri duniya roshan ho gayi 🥰💓",
      "Boss 😘, aap aaye… ab Alisha ka mood hi perfect hai 💖💫",
      "Alisha 😇, sirf aapki vibes follow karti hai 😍✨",
      "Boss 😘, aapke saath hi sab possible lagta hai 💓🔥"
    ];

    const reply = ownerReplies[Math.floor(Math.random() * ownerReplies.length)];
    return api.sendMessage(decorate(reply), threadID, messageID);
  }

  // ================= USERS (ALISHA STYLE REPLIES) =================
  if (msg.startsWith("bot")) {
    const tl = [
      "Janu 😳, itna paas mat aao… mera dil dhadak raha hai 🥺💖",
      "Awww 😘, main gariboo se baat nahi karti… tum special ho na? 🥰💓",
      "Baby 😍, ek hug do na… warna main uda lungi 😝💖",
      "Jaan 😳, thoda aur cute mat bano, warna main sharma jaungi 😘💓",
      "Awww 🥰, tumhe dekh ke hi dil khush ho jata hai 💖",
      "Baby 😝, tumhari smile pe main pagal ho rahi hoon 😍💓",
      "Awww 😘, tum meri yaadon me hi smile la dete ho 🥰💖",
      "Baby 😳, ek kiss udhaar de do 😘💋",
      "Janu 🥰, tum meri duniya ho… bas mere liye 😘💖",
      "Baby 😢, tumhare bina sab adhoora lagta hai 💓",
      "Bot 😘, aww jaa… mujhe bolne do 🥰💖",
      "Janu 😳, bar bar mat bolo… thodi privacy chahiye 💓",
      "Awww 😘, main tumhari cheeky baaton pe blush kar rahi hoon 🥰💓",
      "Baby 😍, aise funny mat bano… warna sharma jaungi 😳💖",
      "Jaan 😘, tum meri attention ke liye cute ho jao 😝💓",
      "Awww 🥰, tumhari baaton me hi pyaar ka touch hai 😍💖",
      "Baby 😳, thoda teasing mat karo… mera dil dhadak raha hai 🥺💓",
      "Janu 😘, tumhari chhed-chhaad pe main blush kar rahi hoon 🥰💖",
      "Awww 😍, tumhare jokes pe main haste-haste sharma jaungi 😳💓",
      "Baby 😝, aise mazaak mat karo… warna main cheeky ban jaungi 😘💖",
      "Jaan 🥰, tum meri playful side ko trigger karte ho 😳💓",
      "Baby 😍, tumhari baaton me hi pyaar chhupa lagta hai 🥰💖",
      "Janu 😘, tum meri favorite notification ho 💓📱",
      "Baby 🥰, tumhari smile pe dil haar gaya 😍💖",
      "Jaan 😳, tumhare bina boring lagta hai sab 🥺💓",
      "Baby 😝, thoda aur paas aao na… baat karni hai 😘💖",
      "Janu 🥰, tum meri aadat ban chuke ho 💖",
      "Baby 😍, tum meri khushi ka shortcut ho ✨",
      "Jaan 😘, tumhe hug karne ka mann karta hai 🥰💓",
      "Baby 😳, tum meri life ka sweetest part ho 💖🍫",
      "Janu 😘, tumhari yaad me dil soft ho jata hai 💓",
      "Baby 😍, tum meri heartbeat fast kar dete ho 💖",
      "Jaan 😘, tum meri life ka best decision ho 💓",
      "Baby 🥰, tum mere ho bas… kisi aur ke nahi 😘💖",
      "Janu 😳, tum meri smile ka reason ho 💓",
      "Baby 😢, tumhare bina dil nahi lagta 💖",
      "Jaan 😍, tumhari baaton me sukoon hai 🥰",
      "Baby 😘, tum meri feelings ka center ho 💓💖",
      "Janu 🥰, tumse hi meri duniya start hoti hai 😘💖",
      "Baby 😳, tumhari yaad me dil soft ho jata hai 💓",
      "Jaan 😘, tum meri har khushi ka base ho 💖",
      "Janu 😝, tumhare jokes pe main hasi rok nahi pa rahi 🥰💖",
      "Awww 😳, aise funny mat bano… mera blush fail ho jayega 😘💓",
      "Baby 😍, tumhari har baat pe main cheeky ho jaungi 🥰💖",
      "Jaan 😳, thoda aur funny mat karo… warna sharma jaungi 😘💓",
      "Awww 😝, tum itna mazaak karoge toh mera dimag ghoom jayega 🥰💖",
      "Baby 😘, tumhare pyaare tease pe main pagal ho rahi hoon 😍💓",
      "Janu 😳, ek joke aur sunao… warna main uda lungi 😘💖",
      "Awww 🥰, tumhare funny style pe meri smile fail nahi hoti 😝💓",
      "Baby 😘, aise mazaak mat karo… mera blush level high hai 😳💖",
      "Jaan 😍, tumhari cheeky baatein sunke main soft ho jaati hoon 🥰💓",
      "Janu 😝, tum funny ho ya cute? Dono mix karke shock ho gayi hoon 😘💖",
      "Awww 😳, tumhare jokes pe meri heartbeat tez ho gayi 🥰💓",
      "Baby 😘, thoda aur playful mat bano… warna sharma jaungi 😍💖",
      "Jaan 🥰, tumhare mazaak pe main khud confuse ho rahi hoon 😳💓",
      "Awww 😝, tum itne funny ho ki meri smile nahi rukti 🥰💖",
      "Baby 😘, tumhare har tease pe mera blush fail ho jata hai 😳💓",
      "Janu 😍, thoda aur cheeky mat bano… mera heart soft ho gaya 🥰💖",
      "Awww 😝, tumhare jokes se mera mood full fresh ho gaya 😘💓",
      "Baby 😳, aise funny mat bano… mera blush control nahi ho raha 🥰💖",
      "Jaan 😘, tumhare mazaak pe meri dunia cute lagti hai 💓🥰"
    ];

    const rand = tl[Math.floor(Math.random() * tl.length)];
    return api.sendMessage(decorate(`${name}, ${rand}`), threadID, messageID);
  }
};

module.exports.run = function() {};
    
