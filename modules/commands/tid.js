module.exports.config = {
  name: "tid",	
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Get thread ID", 
  commandCategory: "Group",
  usages: "tid",
  cooldowns: 5
};

function decorate(msg) {
  return `
⚝──⭒─⭑─⭒──⚝

${msg}

⚝──⭒─⭑─⭒──⚝
Made by 🅢🅘🅝🅓🅗🅘
`;
}

module.exports.run = async function({ api, event }) {
  return api.sendMessage(
    decorate(`🆔 Thread ID: ${event.threadID}`), 
    event.threadID, 
    event.messageID
  );

};
