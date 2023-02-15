const {EmbedBuilder} = require('discord.js')
const VCSchema = require('../../Database/Models/CustomVC')
module.exports = {
    name: 'giveowner',
    usage: ['Change the Ownership of a Custom VC Channel', '```{prefix}giveowner <member mention/ID>```'],
    enabled: true,
    aliases: ['owner'],
    category: 'VC',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks', 'ManageChannels'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        const channel = message.channel
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            } else 
            return client.embed.usage(message, data)
        }
        const VC = await VCSchema.findOne({
            textChannelId: channel.id,
            guildId: message.guild.id
        })
        if(VC.ownerId !== message.author.id){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`I'm very sorry Sir... But it looks like you do not hold ownership of this channel!`)
            } else 
            return message.channel.send(`Sorry but you dont own this channel in the first place.`)
        }
        const member = await client.tools.resolveMember(args[0], message.guild)
        if(!member){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            } else 
            return message.channel.send(`${client.custom.membercunt}`)
        }
        await channel.edit({ topic: `${member.id}`})
        message.react('✅')
        const emojiDesc = []
        if(channel.name.includes('💛')){
            emojiDesc.push(`💛 - On Theme (Misogyny, Use Honorifics, can be sexual conversations or sexual acts - What comes, goes)`)
        }
        if(channel.name.includes('💙')){
            emojiDesc.push(`💙 - Off Theme (Remember, only for Events or if staff makes exceptions)`)
        }
        if(channel.name.includes('❓')){
            emojiDesc.push(`❓ - Ask to Join (Type \`${data.guild.prefix}ask\` to Request)`)
        }
        if(channel.name.includes('📸')){
            emojiDesc.push(`📸 - Event (Used for Server/Member Events)`)
        }
        if(channel.name.includes('🔪')){
            emojiDesc.push('🔪 - Extreme (No Censorship in this VC, Extreme Kinks)')
        }
        if(channel.name.includes('🎵')){
            emojiDesc.push('🎵 - Music (Use this Channel for Music Bot)')
        }
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: `${VC.channelName}`, iconURL: client.user.displayAvatarURL({dyanmic: true})})
        .setDescription(`This Voice Channel has the Following Options Enabled:\n${emojiDesc.join('\n\n')}`)
        .addFields([
            {name: `__Owner__`, value: `${member}\n\n\`You can change ownership with \`${data.guild.prefix}giveowner @member\``, inline: false}
        ])
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        await VC.updateOne({
            ownerId: member.id
        })
        return message.channel.send({embeds: [embed]})
    }
}