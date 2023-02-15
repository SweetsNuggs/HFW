const SirMessagesSchema = require('../../Database/Models/SirMessages')
const MaleSirSchema = require('../../Database/Models/MaleToSir')
const cron = require('node-cron')
const { EmbedBuilder } = require('discord.js')

async function SirMessage (message, author){
    const prefix = `?`
    if(message.content.toLowerCase().startsWith(prefix)){
        return
    }
    const Sir = await SirMessagesSchema.findOne({
        id: author.id
    })
    if(!Sir){
        const NewSir = new SirMessagesSchema({
            id: author.id,
            username: author.username,
            messageCount: 1,
            totalMessageCount: 1,
            messages: [
                {
                    content: message.content,
                    date: new Date(),
                    channel: message.channel
                }
            ]
        })
        await NewSir.save();
        return
    }
    Sir.messageCount = Sir.messageCount + 1
    Sir.totalMessageCount = Sir.totalMessageCount + 1
    Sir.messages.push({
        content: message.content,
        date: new Date(),
        channel: message.channel})
    await Sir.save();

    if(Sir.messageCount === 30){
        const Males = await MaleSirSchema.findOne({
            guildId: message.guild.id,
        })
        if(!Males){
            const NewMales = new MaleSirSchema({
                guildId: message.guild.id,
                members: [
                    {
                        id: author.id,
                        username: author.username,
                        dateAdded: new Date()
                    }
                ]
            })
            await NewMales.save();
            return
        }
        const Info = ({id: author.id, username: author.username, dateAdded: new Date()})
        Males.members.push(Info)
        Males.save();
        return
    }
    return
}

async function WeeklySirs(client){
    const guild = client.guilds.cache.get(client.config.guildId)
    const channel = guild.channels.cache.get(client.config.staffchannel)

    const memberinfo = []
    const SirInfo = await MaleSirSchema.findOne({
        guildId: client.config.guildId
    })
    SirInfo.members.forEach((m) => {
        memberinfo.push(`● {m} (${m.id}) : ${m.dateAdded}`)
    })
    const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
    .setTitle(`Male Members Who have reached over 30 acceptable Messages this Week`)
    .setDescription(`*For Exact Info on Each Member, please use \`${client.config.prefix}msgs <mention member/ID>\`*\n\n${memberinfo.join('\n'
    )}`)

    

}

module.exports = {
    SirMessage,
    WeeklySirs
}