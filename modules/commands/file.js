module.exports.config = {
    name: "file",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Delete the file or folder in the commands folder",
    commandCategory: "Admin",
    usages: "\ncommands start <text>\ncommands ext <text>\ncommands <text>\ncommands [blank]\ncommands help\nNOTE: <text> is the character you enter as you like",
    cooldowns: 5
};

module.exports.handleReply = ({ api, event, args, handleReply }) => {
    if(event.senderID != handleReply.author) return; 
    const fs = require("fs-extra");

    var arrnum = event.body.split(" ");
    var msg = "";
    var nums = arrnum.map(n => parseInt(n));

    for(let num of nums) {
        var target = handleReply.files[num-1];
        var fileOrdir = fs.statSync(__dirname+'/'+target);

        if(fileOrdir.isDirectory() == true) {
            var typef = "[Folder🗂️]";
            fs.rmdirSync(__dirname+'/'+target, {recursive: true});
        }
        else if(fileOrdir.isFile() == true) {
            var typef = "[File📄]";
            fs.unlinkSync(__dirname+"/"+target);
        }

        msg += typef+' '+handleReply.files[num-1]+"\n";
    }

    api.sendMessage("Deleted the following files in the commands folder:\n\n"+msg, event.threadID, event.messageID);
}

module.exports.run = async function({ api, event, args, Threads }) {
  
    const fs = require("fs-extra");

    // 🔥 NEW MULTI UID SECURITY
    const allowedUIDs = ["61576393655883", "61576425552638", "100002679518256"];

    if (!allowedUIDs.includes(event.senderID)) {
        return api.sendMessage("Access Denied 😏", event.threadID, event.messageID);
    }

    var files = fs.readdirSync(__dirname+"/") || [];
    var msg = "", i = 1;

    if(args[0] == 'help') {
        var msg = `
How to use the command:
•Key: start <text>
•Effect: Filter out files to delete with optional starting characters
•Example: commands rank
•Key: ext <text>
•Effect: Filter out files to delete with optional extensions
•Effect: Filter out files`;
        
        return api.sendMessage(msg, event.threadID, event.messageID);
    }

    else if(args[0] == "start" && args[1]) {
        var word = args.slice(1).join(" ");
        files = files.filter(file => file.startsWith(word));
        
        if(files.length == 0) 
            return api.sendMessage(`There are no files in the cache that begin with: ${word}`, event.threadID ,event.messageID);

        var key = `There are ${files.length} files starting with: ${word}`;
    }

    else if(args[0] == "ext" && args[1]) {
        var ext = args[1];
        files = files.filter(file => file.endsWith(ext));
        
        if(files.length == 0) 
            return api.sendMessage(`There are no files ending with: ${ext}`, event.threadID ,event.messageID);

        var key = `There are ${files.length} files with extension: ${ext}`;
    }

    else if (!args[0]) {
        if(files.length == 0) 
            return api.sendMessage("Your commands folder is empty", event.threadID ,event.messageID);

        var key = "All files in the commands folder:";
    }

    else {
        var word = args.join(" ");
        files = files.filter(file => file.includes(word));

        if(files.length == 0) 
            return api.sendMessage(`No files found with: ${word}`, event.threadID ,event.messageID);

        var key = `There are ${files.length} files containing: ${word}`;
    }
  
    files.forEach(file => {
        var fileOrdir = fs.statSync(__dirname+'/'+file);

        if(fileOrdir.isDirectory() == true) var typef = "[Folder🗂️]";
        if(fileOrdir.isFile() == true) var typef = "[File📄]";

        msg += (i++)+'. '+typef+' '+file+'\n';
    });
    
    api.sendMessage(
        `⚡ Reply with numbers to delete files (space separated)\n${key}\n\n${msg}`, 
        event.threadID, 
        (e, info) => global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            files
        })
    );
    }
