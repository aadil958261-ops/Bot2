const fs = require('fs-extra');
const path = require('path');

const activeTargets = new Map();

// 📁 file SAME folder ke andar
const filePath = path.join(__dirname, 'galiyan.json2');

function getMessages() {
  try {
    if (!fs.existsSync(filePath)) {
      return ['Message file missing 😅'];
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // JSON support
    try {
      const json = JSON.parse(content);
      if (Array.isArray(json)) {
        return json.filter(x => typeof x === 'string' && x.trim());
      }
    } catch {}

    // TXT support
    return content
      .split('\n')
      .map(x => x.trim())
      .filter(x => x.length > 0);

  } catch (err) {
    console.error('File read error:', err.message);
    return ['Error reading file 😅'];
  }
}

function getRandomMessage() {
  const msgs = getMessages();
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// 🚀 START SYSTEM (MULTI USER + AUTO STOP)
async function startTagging(api, threadID, targets, duration = 60) {
  const key = threadID;

  if (activeTargets.has(key)) return false;

  const interval = setInterval(async () => {
    try {
      for (let t of targets) {
        const tag = `@${t.name}`;

        await api.sendMessage({
          body: `${tag} ${getRandomMessage()}`,
          mentions: [{
            tag,
            id: t.id
          }]
        }, threadID);
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }, 4000);

  // ⏱ AUTO STOP
  const timeout = setTimeout(() => {
    clearInterval(interval);
    activeTargets.delete(key);

    api.sendMessage(
      `⏱ Auto stopped after ${duration} seconds`,
      threadID
    );
  }, duration * 1000);

  activeTargets.set(key, { interval, timeout });

  return true;
}

// 🛑 STOP SYSTEM
function stopTagging(threadID) {
  if (!activeTargets.has(threadID)) return false;

  const { interval, timeout } = activeTargets.get(threadID);

  clearInterval(interval);
  clearTimeout(timeout);

  activeTargets.delete(threadID);
  return true;
}

module.exports = {
  config: {
    credits: "SARDAR RDX",
    name: 'fyt',
    aliases: ['tagger'],
    description: 'Multi user tagging system with file support',
    usage: 'fyt on @user [time] | fyt off',
    category: 'Group',
    prefix: true
  },

  async run({ api, event, args, send }) {
    const { threadID, mentions } = event;

    const action = (args[0] || '').toLowerCase();

    if (!action) {
      return send.reply(
`Usage:
fyt on @user [time]
fyt off`
      );
    }

    // 🛑 STOP
    if (action === 'off') {
      const stopped = stopTagging(threadID);

      return send.reply(
        stopped ? 'Stopped ✅' : 'Nothing running'
      );
    }

    if (action !== 'on') {
      return send.reply('Use: on / off');
    }

    // ⏱ duration
    let duration = parseInt(args[args.length - 1]);
    if (isNaN(duration)) duration = 60;

    // 🎯 TARGET BUILD
    let targets = [];

    const mentionIDs = Object.keys(mentions || {});

    // 1️⃣ mention support
    if (mentionIDs.length > 0) {
      for (let id of mentionIDs) {
        targets.push({
          id,
          name: (mentions[id] || 'User').replace('@', '')
        });
      }
    }

    // 2️⃣ fallback (optional name search)
    else {
      const nameQuery = args.slice(1).join(' ').toLowerCase();

      try {
        const info = await api.getThreadInfo(threadID);

        info.userInfo.forEach(u => {
          if (u.name && u.name.toLowerCase().includes(nameQuery)) {
            targets.push({
              id: u.id,
              name: u.name
            });
          }
        });
      } catch {}
    }

    if (!targets.length) {
      return send.reply('No users found 😅');
    }

    const started = await startTagging(api, threadID, targets, duration);

    if (!started) {
      return send.reply('Already running ⚠️');
    }

    return send.reply(
`Started ✅
Targets: ${targets.length}
Duration: ${duration}s`
    );
  }
};
