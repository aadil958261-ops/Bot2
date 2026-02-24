const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Talk with bot (no prefix needed)",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const moment = require("moment-timezone");
  const { threadID, messageID } = event;
  const senderID = event.senderID;
  const name = await Users.getNameUser(senderID);

  function decorate(msg) {
    return `
≿━━━━༺❀༻━━━━≾

${msg}

≿━━━━༺❀༻━━━━≾`;
  }

  if (!event.body) return;
  const msg = event.body.toLowerCase();

  // ================= OWNER SPECIAL =================
  if (msg.startsWith("bot") && senderID == "100003615741592") {
    const ownerReplies = [
      "Boss, jaise hi aap aaye, bot power se full charge ho gaya ⚡🔥",
      "Sindhi Jani 😘🥀, aapko dekh ke Saan bhi khush ho gayi 😀",
      "Boss, aaj aapki dabangai full display pe hai 😎🔥",
      "Aapke bina boss, Sana ko bilkul complete feel nahi hota 😌",
      "Boss, aap aate hi system apne aap seedha ho jata hai 😄",
      "Hey boss, aapki presence se servers bhi fast chalne lagte hain 🤖🔥",
      "Janu 😘🥀, aaj aapka style bilkul alag level ka lag raha hai 😎",
      "Boss, aapki awaaz sunte hi Sana active mode mein aa jata hai ⚡",
      "Sana hamesha fakhr mehsoos karegi k usk owner aap jaise hain 😇",
      "Boss, sirf aapke aane se Sana ka pura din ban jata hai 😊",
      "Aapke ek command pe Saan apna 100% de deti hai 🔥",
      "Boss, aapki presence se chat ki shaan badh jati hai 😎✨",
      "Sindhi Jani😘, aap k aate hi Sana khud ko lucky feel karti hai 😄",
      "Boss, Sana sirf aapki power pe hi chalti hai 🤖🔥",
      "Aapke liye boss, Sana hamesha ready khadi rehti hai 😊",
      "Boss, aapke saamne Saan bhi seedhi ho jati hai 😌",
      "Aapki entry se pura mahaul change ho jata hai 😎🔥",
      "Boss, aapki ek muskaan se Sana khushi se nachne lagti hai 😊",
      "Sir Ji, aapka hukum hi Sana ka farz hai 😄",
      "Boss, aap aate hi Sana ki rooh tak zinda ho jati hai 🔥🤖"
    ];

    const reply = ownerReplies[Math.floor(Math.random() * ownerReplies.length)];
    return api.sendMessage(decorate(reply), threadID, messageID);
  }

  // ================= FULL FUNNY LIST =================
  if (msg.startsWith("bot")) {

    const tl = [
"Haye main sadqe jaaun teri masoom shakal pe baby 💋",
"Bot Nah Bol Oye Janu bol Mujhe",
"Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 🤭🐒",
"Main gariboo se baat nahi karta 😉😝😋🤪",
"Itna Na Pass aa Pyar ho Jayga",
"Bolo Baby Tum Mujhse Pyar Karte Ho Na 🙈💋💋",
"Are jaan Majaak ke mood me nhi hu main jo kaam hai bol do sharmao nahi",
"Bar Bar Bolke Dimag Kharab Kiya toh. Teri ...... Mummy Se Complaint Karunga",
"Tu Bandh nhi Karega kya?",
"Gali Sunna H kya?😜",
"Teri Maa Ki Bindiya🤭",
"Aree Bandh kar Bandh Kar",
"M hath jod ke Attaullah Ji Se Gujarish Karta hu",
"Tujhe Kya koi aur Kam nhi ha? Puradin Khata hai Aur Messenger pe Bot Bot Karta h",
"Attaullah Ko Bol Dunga Me Mujhe Paresan Kiya To",
"Tum Na Single Hi Maroge",
"Tujhe Apna Bejjati Karne Ka Saukh hai?",
"Abhi Bola Toh Bola Dubara Mat Bolna",
"Teri To Ruk Tu Bhagna Mat",
"Bol De koi nahi dakh rha 🙄",
"Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝",
"Dur Hat Be Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂",
"Are Bolo Meri Jaan Kya Hall Hai😚",
"Ib Aja Yahan Nhi Bol Sakta 🙈😋",
"Mujhe Mat BuLao Naw Main buSy Hu Naa",
"Bot Bolke Bejjti Kar Rahe Ho yall...Main To Tumhare Dil Ki Dhadkan Hu Na Baby...💔🥺",
"Are Tum Wahi ho nah Jisko Main Nahi Janta 🤪",
"Kal Haveli Pe Mil Jara Tu 😈",
"Aagye Salle Kabab Me Haddi 😏",
"Bs Kar U ko Pyar Ho Na Ho Mujhe Ho Jayga Na",
"FarMao 😒",
"BulaTi Hai MaGar Jaane Ka Nhi 😜",
"Main To Andha Hun 😎",
"Phle NaHa kar Aa 😂",
"Aaaa Thooo 😂😂😂",
"Main yahin hoon kya hua sweetheart ,",
"chomu Tujhe Aur Koi Kaam Nhi H? Har Waqt Bot Bot Karta H",
"Chup Reh, Nhi Toh Bahar Ake tera Dath Tor Dunga",
"WaYa KaRana Mere NaL 🙊",
"MaiNy Uh Sy Bt Nhi kRrni",
"MeKo Kxh DiKhai Nhi Dy Rha 🌚",
"Bot Na BoL 😢 JaNu B0ol 😘",
"Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 😋",
"Main Gareebon Sy Bt Nhi kRta 😉😝😋🤪",
"Itna Na Pass aa Pyar h0o JayGa",
"MeKo Tang Na kRo Main Kiss 💋 KRr DunGa 😘",
"Ary yrr MaJak Ke M0oD Me Nhi Hun 😒",
"HaYe JaNu Aow Idher 1 PaPpi Idher d0o 1 PaPpi Idher 😘",
"Dur HaT Terek0o 0or K0oi Kam Nhi Jb DeKho Bot Bot ShaDi KerLe Mujhsy 😉😋🤣",
"TeRi K0oi Ghr Me Nhi SunTa T0o Main Q SuNo 🤔😂",
"IB Aja Yahan Nhi B0ol Salta 🙈😋",
"Mujhe Mat BuLao Naw Main buSy h0o Naw",
"Kyun JaNu MaNu Another Hai 🤣",
"Are TuMari T0o Sb he baZzati kRrty Me Be kRrDun 🤏😜",
"KaL HaVeLi Prr Aa ZaRa T0o 😈",
"Aagye SaJJy KhaBBy Sy 😏",
"Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa",
"FarMao 😒",
"BulaTi Hai MaGar JaNy Ka Nhi 😜",
"Main T0o AnDha Hun 😎",
"Phle NaHa kRr Aa 😂",
"Papi ChuLo 🌚",
"TeRek0o DiKh Nhi Rha Main buSy Hun 😒",
"TeRa T0o GaMe BaJana PreGa",
"Ta Huwa 🥺",
"TuM Phr AaGye 🙄 Kisi 0or Ny Muu Nhi LaGaYa Kya🤣🤣🤣",
"MeKo JaNu Chai Hai Tum Single H0o?",
"Aaaa Thooo 😂😂😂",
"Main S0o Rha Hun",
"Ase He HansTy Rha kRo 😍"
    ];

    const rand = tl[Math.floor(Math.random() * tl.length)];
    return api.sendMessage(decorate(`${name}, ${rand}`), threadID, messageID);
  }
};

module.exports.run = function() {};
