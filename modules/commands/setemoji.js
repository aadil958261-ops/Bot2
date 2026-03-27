module.exports = {
  config: {
    credits: "SARDAR RDX",
    name: 'setemoji',
    aliases: ['emoji', 'groupemoji'],
    description: 'Change the group emoji',
    usage: 'setemoji [emoji]',
    category: 'Group',
    groupOnly: true,
    prefix: true
  },

  run: async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(a => a.id);

      // bot admin check (safe fallback)
      const botAdmins = global.config?.ADMINBOT || [];

      const isGroupAdmin = adminIDs.includes(senderID);
      const isBotAdmin = botAdmins.includes(senderID);

      if (!isGroupAdmin && !isBotAdmin) {
        return api.sendMessage(
          "❌ Only group admins can change the group emoji.",
          threadID
        );
      }

      const emoji = args[0];

      if (!emoji) {
        return api.sendMessage(
          "⚠️ Please provide an emoji.\nExample: setemoji 😎",
          threadID
        );
      }

      await api.changeThreadEmoji(emoji, threadID);

      return api.sendMessage(
        `✅ Group emoji changed to: ${emoji}`,
        threadID
      );

    } catch (error) {
      console.log("setemoji error:", error);
      return api.sendMessage(
        "❌ Failed to change group emoji.",
        threadID
      );
    }
  }
};
