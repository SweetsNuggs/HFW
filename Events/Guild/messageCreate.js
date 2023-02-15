const config = require('../../config.json')
const cmdCooldown = {}
const Event = require('../../Tools/Structures/Event')
let uCooldown = {}
const wait = require('node:timers/promises').setTimeout
const {Confess, handleCount}= require('../../Tools/Utils/MessageUtils')
const CoutningSchema = require('../../Database/Models/Counting')
const {SirMessage} = require('../../Tools/Utils/SirUtils')

class MessageCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }

    async run(client, message){
        client.messagesSent++
        if(!message.guild){
            return Confess(message, client)
        }
        if(message.member.roles.cache.has(client.config.malerole)){
            if(!message.member.roles.cache.has(client.config.sirrole)){
            SirMessage(message, message.author)
            }
        }
        if(message.channel.id === client.config.flashchannel){
            await wait(120000)
            await message.delete()
        } 
        const CS = await CoutningSchema.findOne({
            guildId: message.guild.id
        })
        if(CS){
            if(message.channel.id === CS.channelId){
                handleCount(message, message.content, message.author, client)
            }
        }
        if (message.author.bot) return;
        if(message.author.id === client.user.id) return;
    
        if(message.content === 'PEACE'){
            return message.channel.send(`${client.custom.safeword}`)
        }
        let guildData;
        if(!message.guild.prefix){
            guildData = await client.Database.fetchGuild(message.guild.id)
            message.guild.prefix = guildData.prefix
        }
        const prefix = message.guild.prefix;

        if(message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`){
            return message.reply({ content: `Uh-Oh! You forgot the prefix? It's \`${prefix}\``, allowedMentions: { repliedUser: true }});
        }
        if(!message.content.toLowerCase().startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if(!cmd) return;
        if(!message.channel.nsfw && cmd.nsfw){
            return message.channel.send(`Sorry you can only usse that command in a NSFW Channel!`)
        }
        let userPerms = []
        cmd.memberPermissions.forEach((perm) => {
            if(!message.channel.permissionsFor(message.author).has(perm)){
                userPerms.push(perm)
            }
        })
        if(userPerms.length > 0){
            client.logger.cmd(`${message.author.tag} used ${cmd.name} - Missing Permissions `)
            return message.channel.send(`Looks like you are missing the following permissons:\n${userPerms.map((p) => `\`${p}\``).join(', ')}`)
        }
        let clientPerms = []
        cmd.botPermissions.forEach((perm) => {
            if(!message.channel.permissionsFor(message.guild.members.me).has(perm)){
                clientPerms.push(perm);
                }
            });
          
            if(clientPerms.length > 0){
                client.logger.cmd(`${message.author.tag} used ${cmd.name} - Missing permissions`);
                return message.channel.send(`Looks like I'm missing the following permissions:\n` +clientPerms.map((p) => `\`${p}\``).join(", "));
            }
        
            let userCooldown = cmdCooldown[message.author.id];
        
            if(!userCooldown){
                cmdCooldown[message.author.id] = {}
                uCooldown = cmdCooldown[message.author.id];
            }
        
            let time = uCooldown[cmd.name] || 0;
            
            if(time && (time > Date.now())){
                let timeLeft = Math.ceil((time-Date.now())/1000);
                return message.channel.send(`${erroricon} Command is on cooldown. You need to wait ${timeLeft} seconds`)//Error message
            }
        
            cmdCooldown[message.author.id][cmd.name] = Date.now() + cmd.cooldown;
        
            let userData = await client.Database.fetchUser(message.author.id);
            let memberData = await client.Database.fetchMember(message.author.id, message.guild.id)
            if(!guildData) guildData = await client.Database.fetchGuild(message.guild.id);
            let data = {};
            data.user = userData;
            data.guild = guildData;
            data.cmd = cmd;
            data.config = config;
            data.memberData = memberData;
        
            cmd.execute(client, message, args, data);
            client.logger.cmd(`${message.author.tag} used ${cmd.name}`);
        
            
            client.Database.createLog(message, data);
    }
}

module.exports = MessageCreate