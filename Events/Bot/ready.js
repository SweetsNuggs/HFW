const Event = require('../../Tools/Structures/Event')
const GuildSchema = require('../../Database/Schemas/Guild')
const Discord = require('discord.js');
const MemberSchema = require('../../Database/Schemas/Member')
const MaleSirSchema = require('../../Database/Models/MaleToSir')
const MessageSchema = require('../../Database/Models/SirMessages')
const {EmbedBuilder} = require('discord.js')
const cron = require('cron')
const moment = require('moment')

class Ready extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
            once: true,
        });
    }

    async run(client) {
    
    client.user.setPresence({status: 'online'})
    client.user.setActivity( 'With Myself', {type: Discord.ActivityType.Playing})
    
    const data = await GuildSchema.find({});
    if(data.length > client.guilds.cache.size) {
        const guildCount = [];
        for (let i = 0; i < client.guilds.cache.size; i++) {
            guildCount.push([...client.guilds.cache.values()][i].id);
        }
        for (const guild of data) {
            if(!guildCount.includes(guild.guildID)) {
                client.emit('guildDelete', {id: guild.guildID, name: guild.guildName });
            }
        }
    }
    let WeeklyMessage = new cron.CronJob(`00 00 00 * * Sun`, async () => {
        const guild = client.guilds.cache.get(client.config.guild)
        const channel = guild.channels.cache.get(client.config.staffchannel)

    const memberinfo = []
    const SirInfo = await MaleSirSchema.findOne({
        guildId: client.config.guild
    })
    if(SirInfo){
    SirInfo.members.forEach((m) => {
        memberinfo.push(`● ${guild.members.cache.get(m.id)} (${m.id})\n Added to List On: ${moment(m.dateAdded).format('dddd, MMMM, Do YYYY')}`)
    })
}
    const malemembers = guild.members.cache
    await malemembers.forEach((m) => {
        const msgs = MessageSchema.findOne({
            id: m.id
        })
        msgs.messageCount = 0 
        msgs.save();
    })
    const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
    .setTitle(`Male Members Who have reached over 30 acceptable Messages this Week`)
    .setDescription(`${memberinfo.join('\n')}`)

    await channel.send({embeds: [embed]})

    await SirInfo.delete(); 
    return
    })
    WeeklyMessage.start()
    client.logger.ready('All guilds have been initalized');
    }
}

module.exports = Ready