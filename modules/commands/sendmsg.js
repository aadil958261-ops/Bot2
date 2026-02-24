let axios = require('axios')
let fs = require('fs')
let cc = require('moment-timezone')
module.exports.config = {
  name: "sendmsg",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Send a message to all groups",
  commandCategory: "Admin",
  usages: "sendmsg ID + message",
  cooldowns: 5,
  dependencies: {
    "fs": "",
    "axios": "",
    "moment-timezone": ""
  }
}

let gio = cc.tz('Asia/Karachi').format('HH:mm:ss - DD/MM/YYYY')

module.exports.run = async ({ api, event, handleReply, Users, args }) => {
  if (event.senderID != 100003615741592) return api.sendMessage(
    `⚝──⭒─⭑─⭒──⚝\n\n𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝!\n\n⚝──⭒─⭑─⭒──⚝`,
    event.threadID,
    event.messageID
  )
  let { threadID, messageID, senderID, type, messageReply } = event;
  let name = await Users.getNameUser(senderID)
  let threadInfo = await api.getThreadInfo(args[0])
  let NameText = threadInfo.threadName || await Users.getNameUser(args[0])
  let lydo = args.splice(1).join(" ")
  if (type == "message_reply") {
    if (messageReply.attachments[0].type == "audio") {
      path = __dirname + `/cache/snoti.m4a` ||  __dirname + `/cache/snoti.mp3`
    }
    if (messageReply.attachments[0].type == "photo") {
      path = __dirname + `/cache/snoti.jpg`
    }
    if (messageReply.attachments[0].type == "video") {
      path = __dirname + `/cache/snoti.mp4`
    }
    if (messageReply.attachments[0].type == "animated_image") {
      path = __dirname + `/cache/snoti.gif`
    }
    let abc = messageReply.attachments[0].url;
    let getdata = (await axios.get(`${abc}`, {
      responseType: 'arraybuffer'
    })).data
    fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
    api.sendMessage({
      body: `≿━━━━༺❀༻━━━━≾\n\n𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐫𝐨𝐦 𝐀𝐝𝐦𝐢𝐧: ${lydo}\n[🌐]→ 𝐓𝐢𝐦𝐞: ${gio}\n[📝]→ 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐝!\n\n≿━━━━༺❀༻━━━━≾`,
      attachment: fs.createReadStream(path)
    }, args[0], (e, info) => {
      global.client.handleReply.push({
        type: "callad",
        name: this.config.name,
        author: threadID,
        ID: messageID,
        messageID: info.messageID
      })
    })
    api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐨 ${NameText}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
      threadID
    )
  } else {
    api.sendMessage({
      body: `≿━━━━༺❀༻━━━━≾\n\n𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐫𝐨𝐦 𝐀𝐝𝐦𝐢𝐧: ${lydo}\n[🌐]→ 𝐓𝐢𝐦𝐞: ${gio}\n[📝]→ 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐝!\n\n≿━━━━༺❀༻━━━━≾`
    }, args[0], (e, info) => {
      global.client.handleReply.push({
        type: "callad",
        name: this.config.name,
        author: threadID,
        ID: messageID,
        messageID: info.messageID
      })
    })
    api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝\n\n𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐨 ${NameText}\n\n⚝──⭒─⭑─⭒──⚝`,
      threadID
    )
  }
}

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
  let { body, threadID, senderID, messageID } = event;
  let index = body.split(" ")
  let gio = cc.tz("Asia/Karachi").format("DD/MM/YYYY - HH:mm:ss")
  let threadInfo = await api.getThreadInfo(threadID)
  let threadName = threadInfo.threadName || await Users.getNameUser(senderID)
  switch(handleReply.type) {
    case "callad": {
      let name = await Users.getNameUser(senderID)
      if (event.attachments.length != 0) {
        if (event.attachments[0].type == "audio") {
          path = __dirname + `/cache/snoti.m4a` ||  __dirname + `/cache/snoti.mp3`
        }
        if (event.attachments[0].type == "photo") {
          path = __dirname + `/cache/snoti.jpg`
        }
        if (event.attachments[0].type == "video") {
          path = __dirname + `/cache/snoti.mp4`
        }
        if (event.attachments[0].type == "animated_image") {
          path = __dirname + `/cache/snoti.gif`
        }
        let abc = event.attachments[0].url;
        let getdata = (await axios.get(`${abc}`, {
          responseType: 'arraybuffer'
        })).data
        fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
        api.sendMessage({
          body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐟𝐫𝐨𝐦 𝐆𝐫𝐨𝐮𝐩: ${threadName}\n[🔎]→ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐍𝐚𝐦𝐞: ${name}\n[❗]→ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${index.join(" ")}\n[🌐]→ 𝐓𝐢𝐦𝐞: ${gio}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
          attachment: fs.createReadStream(path)
        }, handleReply.author, (e, info) => {
          global.client.handleReply.push({
            type: "callad",
            name: this.config.name,
            author: threadID,
            ID: messageID,
            messageID: info.messageID
          })
        }, handleReply.ID)
      } else if (index.length != 0) {
        api.sendMessage({
          body: `⚝──⭒─⭑─⭒──⚝\n\n𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐟𝐫𝐨𝐦 𝐆𝐫𝐨𝐮𝐩: ${threadName}\n[🔎]→ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐍𝐚𝐦𝐞: ${name}\n[❗]→ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${index.join(" ")}\n[🌐]→ 𝐓𝐢𝐦𝐞: ${gio}\n\n⚝──⭒─⭑─⭒──⚝`
        }, handleReply.author, (e, info) => {
          global.client.handleReply.push({
            type: "callad",
            name: this.config.name,
            author: threadID,
            ID: messageID,
            messageID: info.messageID
          })
        }, handleReply.ID)
      }
    }
  }
}
