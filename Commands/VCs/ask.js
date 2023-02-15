const {EmbedBuilder} = require('discord.js')
const VCSchema = require('../../Database/Models/CustomVC')

module.exports = {
    name: 'ask', 
    usage: ['Ask to join a locked voice channel', '```{prefix}ask```'],
    enabled: true,
    aliases: [],
    category: 'VC',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks', 'ManageChannels'],
    nsfw: false,
    cooldown: 50,

    async execute(client, message, args, data){
        const VC = await VCSchema.findOne({
            textChannelId: message.channel.id,
           })
        let {ownerId, channelId, deputies} = VC
        const vcchannel = await message.guild.channels.cache.get(channelId)
        const dept = []
        for(let i = 0; i < (deputies).length; i+=1){
            const member = await message.guild.members.cache.get(deputies[i])
            dept.push(`${member}`)
        }
        const qembed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`${message.member} wishes to join. Do you accept?\n👍 - Yes\n\n👎 - No`)
        const question = await message.channel.send({content: `<@!${ownerId}> ${dept.join(' ')}`, embeds: [qembed]})
        await question.react('👍')
        .then(() => question.react('👎'))

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === VC.ownerId || user.id !== dept.id
        }
        let response = false
        const collector = question.createReactionCollector({filter, max: 1, time: 15000})
        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '👍'){
                return response = true
            }
        })
        collector.on('end', async collected => {
            if(response === false){
                const denied = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`Sorry ${message.member}, But You have not been given access to join this VC`)
                .setTimestamp()
                .setFooter({text: `${message.guild.name}`})

                await vcchannel.permissionOverwrites.edit(message.author.id, {Connect: false})
                await question.delete()
                return message.channel.send({embeds: [denied]})
            } else if (response === true){
                const approved = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`${message.member} has been Approved to Join`)
                .setFooter({text: `${message.guild.name}`})
                .setTimestamp()

                await question.delete()
                await vcchannel.permissionOverwrites.edit(message.author.id, {ViewChannel: true, Connect: true, Speak: true})
                return message.channel.send({embeds: [approved]})
            }
        })
    }
}
