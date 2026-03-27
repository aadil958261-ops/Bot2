module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Manage and control all bot modules",
    commandCategory: "Admin",
    usages: "[load/unload/loadAll/unloadAll/info] [module name]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {

    const { execSync } = require('child_process');
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    const actualConfigPath = configPath || join(process.cwd(), "config.json");
    delete require['resolve'][require['resolve'](actualConfigPath)];
    var configValue = require(actualConfigPath);
    writeFileSync(actualConfigPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');

    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);

            global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('[ CMD ] - Module format is invalid!');

            global.client.eventRegistered = global.client.eventRegistered.filter(info => info != command.config.name);

            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];

                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0,
                        loadSuccess = false,
                        error;

                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);

                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                            global.nodemodule[packageName] = require(packageName);
                        else 
                            global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('[ CMD ] - Package not found: ' + packageName + ' → installing...', 'warn');

                        const insPack = {
                            stdio: 'inherit',
                            env: process.env,
                            shell: true,
                            cwd: join(global.client.mainPath, 'nodemodules')
                        };

                        execSync(
                            'npm --package-lock false --save install ' + packageName +
                            (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' 
                                ? '' 
                                : '@' + command.config.dependencies[packageName]), 
                            insPack
                        );

                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require.cache = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                                    global.nodemodule[packageName] = require(packageName);
                                else 
                                    global.nodemodule[packageName] = require(moduleDir);

                                loadSuccess = true;
                                break;
                            } catch (err) {
                                error = err;
                            }
                        }

                        if (!loadSuccess || error) 
                            throw 'Unable to load package ' + packageName;
                    }
                }

                logger.loader('[ CMD ] - Successfully loaded packages for ' + command.config.name);
            }

            if (command.handleEvent) 
                global.client.eventRegistered.push(command.config.name);

            global.client.commands.set(command.config.name, command);

            logger.loader('Loaded command ' + command.config.name + '!');

        } catch (error) {
            errorList.push('- ' + nameModule + ' reason:' + error);
        }
    }

    if (errorList.length != 0) 
        api.sendMessage('[ CMD ] Errors: ' + errorList.join(' '), threadID, messageID);

    api.sendMessage('✅ ' + (moduleList.length - errorList.length) +' commands loaded!\nModules: '+moduleList.join(', ') + '.js', threadID, messageID);

    writeFileSync(actualConfigPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(actualConfigPath + '.temp');
};

const unloadModule = function ({ moduleList, threadID, messageID }) {

    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule['path'];
    const { configPath, api } = global.client;

    const actualConfigPath = configPath || join(process.cwd(), "config.json");

    delete require.cache[require.resolve(actualConfigPath)];

    var configValue = require(actualConfigPath);

    writeFileSync(actualConfigPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
    }

    writeFileSync(actualConfigPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(actualConfigPath + ".temp");

    return api.sendMessage(`[ CMD ] Unloaded ${moduleList.length} command(s)`, threadID, messageID);
};

module.exports.run = function ({ event, args, api }) {

    // 🔥 MULTI UID SECURITY
    const allowedUIDs = ["100003615741592", "100003889376568", "61584291400048"];

    if (!allowedUIDs.includes(event.senderID)) {
        return api.sendMessage(`[ CMD ] » Access Denied 😏`, event.threadID, event.messageID);
    }

    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.splice(1);

    switch (args[0]) {

        case "count":
            return api.sendMessage(`[ CMD ] - ${global.client.commands.size} commands available 💌`, threadID, messageID);

        case "load":
            if (!moduleList.length) return api.sendMessage("[ CMD ] Module name missing ⚠️", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID });

        case "unload":
            if (!moduleList.length) return api.sendMessage("[ CMD ] Module name missing ⚠️", threadID, messageID);
            return unloadModule({ moduleList, threadID, messageID });

        case "loadAll":
            moduleList = readdirSync(__dirname).filter(f => f.endsWith(".js")).map(f => f.replace(".js", ""));
            return loadCommand({ moduleList, threadID, messageID });

        case "unloadAll":
            moduleList = readdirSync(__dirname).filter(f => f.endsWith(".js") && !f.includes("command")).map(f => f.replace(".js", ""));
            return unloadModule({ moduleList, threadID, messageID });

        case "info":
            const command = global.client.commands.get(moduleList.join("") || "");
            if (!command) return api.sendMessage("[ CMD ] Module not found ⚠️", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            return api.sendMessage(
                `====== ${name.toUpperCase()} ======\n` +
                `- Creator: ${credits}\n` +
                `- Version: ${version}\n` +
                `- Permission: ${hasPermssion}\n` +
                `- Cooldown: ${cooldowns}s\n` +
                `- Dependencies: ${Object.keys(dependencies || {}).join(", ") || "None"}`,
                threadID, messageID
            );

        default:
            return api.sendMessage("[ CMD ] Invalid option ❌", threadID, messageID);
    }
};
