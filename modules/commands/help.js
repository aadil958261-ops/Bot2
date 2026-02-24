
module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Detailed command list with usage",
  commandCategory: "Command List",
  usages: "[Module Name]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "≿━━━━༺❀༻━━━━≾\n📜 𝐌𝐨𝐝𝐮𝐥𝐞: %1\n📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: %2\n\n» 👑 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: %7\n» 📄 𝐔𝐬𝐚𝐠𝐞: %3\n» 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %4\n» ⏱ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: %5 𝐬𝐞𝐜𝐨𝐧𝐝(𝐬)\n» 👥 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %6\n≿━━━━༺❀༻━━━━≾\n💥 𝐎𝐩𝐞𝐫𝐚𝐭𝐞𝐝 𝐛𝐲 𝐀𝐓𝐓𝐀𝐔𝐋𝐋𝐀𝐇 𝐊𝐇𝐔𝐇𝐀𝐑𝐎 💥",
    "helpList": "༻﹡﹡﹡﹡﹡﹡﹡༺\n🤖 𝐓𝐡𝐢𝐬 𝐛𝐨𝐭 𝐜𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲 𝐡𝐚𝐬 %1 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬.\n🌟 𝐔𝐬𝐞: \"%2help2 <command>\" 𝐭𝐨 𝐤𝐧𝐨𝐰 𝐝𝐞𝐭𝐚𝐢𝐥𝐬.\n⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐝𝐨 𝐧𝐨𝐭 𝐬𝐩𝐚𝐦 𝐨𝐫 𝐚𝐛𝐮𝐬𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭.\n༻﹡﹡﹡﹡﹡﹡﹡༺",
    "user": "User",
    "adminGroup": "Group Administrator",
    "adminBot": "Bot Administrator"
  },
  "vi": {
    "moduleInfo": "≿━━━━༺❀༻━━━━≾\n📜 𝐌𝐨𝐝𝐮𝐥𝐞: %1\n📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: %2\n\n» 👑 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: %7\n» 📄 𝐔𝐬𝐚𝐠𝐞: %3\n» 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %4\n» ⏱ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: %5 𝐬𝐞𝐜𝐨𝐧𝐝(𝐬)\n» 👥 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %6\n≿━━━━༺❀༻━━━━≾\n💥 𝐎𝐩𝐞𝐫𝐚𝐭𝐞𝐝 𝐛𝐲 𝐀𝐓𝐓𝐀𝐔𝐋𝐋𝐀𝐇 𝐊𝐇𝐔𝐇𝐀𝐑𝐎 💥",
    "helpList": "༻﹡﹡﹡﹡﹡﹡﹡༺\n🤖 𝐓𝐡𝐢𝐬 𝐛𝐨𝐭 𝐜𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲 𝐡𝐚𝐬 %1 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬.\n🌟 𝐔𝐬𝐞: \"%2help2 <command>\" 𝐭𝐨 𝐤𝐧𝐨𝐰 𝐝𝐞𝐭𝐚𝐢𝐥𝐬.\n⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐝𝐨 𝐧𝐨𝐭 𝐬𝐩𝐚𝐦 𝐨𝐫 𝐚𝐛𝐮𝐬𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭.\n༻﹡﹡﹡﹡﹡﹡﹡༺",
    "user": "User",
    "adminGroup": "Group Administrator",
    "adminBot": "Bot Administrator"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help2") != 0) return;
  const splitBody = body.slice(body.indexOf("help2")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 8;
    let i = 0;
    let msg = "⚝──⭒─⭑─⭒──⚝\n📖 𝐃𝐞𝐭𝐚𝐢𝐥𝐞𝐝 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭:\n\n";

    for (var [name, value] of (commands)) {
      const usage = value.config.usages ? ` ${value.config.usages}` : "";
      const commandInfo = `╰┈➤${name}\n⪼ 𝐔𝐬𝐚𝐠𝐞: ${prefix}${name}${usage}\n⪼ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${value.config.commandCategory}\n⪼ 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${value.config.description}\n⪼ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: ${value.config.cooldowns}s\n⪼ 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${((value.config.hasPermssion == 0) ? getText("user") : (value.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot"))}`;
      arrayInfo.push(commandInfo);
    }

    arrayInfo.sort((a, b) => a.data - b.data);

    const startSlice = numberOfOnePage*page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (let item of returnArray) msg += `⟬${++i}⟭\n${item}\n\n`;
    const text = `≿━━━━༺❀༻━━━━≾\n⊶ 𝐏𝐚𝐠𝐞 (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)})\n⊶ 𝐔𝐬𝐞: "${prefix}help2 <command>" 𝐟𝐨𝐫 𝐝𝐞𝐭𝐚𝐢𝐥𝐬.\n⊶ 𝐓𝐨𝐭𝐚𝐥: ${arrayInfo.length} 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬.\n⊶ 𝐔𝐬𝐞 ${prefix}help2 <page number>`;
    return api.sendMessage(msg + text, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 60000));
        return api.unsendMessage(info.messageID);
      } else return;
    });
  }

  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
