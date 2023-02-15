require('./Tools/Structures/Event')
const Discord = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const util = require('util')
const config = require('./config.json')
const readdir = util.promisify(fs.readdir)
const path = require('path')
const custommessages = require('./Tools/Utils/messages.json')

client = new Discord.Client({ intents: [Discord.GatewayIntentBits.DirectMessageReactions, 
    Discord.GatewayIntentBits.DirectMessageTyping, Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.GuildBans, Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildScheduledEvents,
    Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent], partials: [Discord.Partials.Channel,
    Discord.Partials.GuildMember, Discord.Partials.GuildScheduledEvent, Discord.Partials.Message, Discord.Partials.Reaction,
    Discord.Partials.ThreadMember, Discord.Partials.User]})

client.aliases = new Discord.Collection();
client.event = new Discord.Collection();
client.commands = new Discord.Collection();
client.config = config;
client.custom = custommessages;
client.Database = require('./Database/Mongoose')
client.tools = require('./Tools/Tools')
client.logger = require('./Tools/Logger')
client.embed = require('./Tools/Embed')
client.schemas = {
    guild: require('./Database/Schemas/Guild'),
    user: require('./Database/Schemas/User'),
    member: require('./Database/Schemas/Member')
}
client.usersMap = new Map();

async function init(){
    const evtFolder = fs.readdirSync('./Events/');
    evtFolder.forEach(async folder => {
        const folders = await readdir('./Events/' + folder + '/');
        folders.forEach(async file => {
            delete require.cache[file];
            const { name } = path.parse(file);
            let event = new (require(`./Events/${folder}/${file}`))(client, name);
            client.logger.log(`Loading Event: ${name}`)
            client.on(name, (...args) => event.run(client, ...args));
        })
    })

    let folders = await readdir("./Commands/");
    folders.forEach(direct =>{
    const commandFiles = fs.readdirSync('./Commands/' + direct + "/").filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Commands/${direct}/${file}`);
        client.commands.set(command.name, command);
    }
    })
    mongoose.connect(config.mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true
    }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Unable to connect to MongoDB Database.\nError: ' + err)
    })
    await client.login(config.token)
}

init();

process.on('unhandledRejection', err =>{
    console.log('Unknown error occured:\n')
    console.log(err)
})