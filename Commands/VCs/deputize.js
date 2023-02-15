const {EmbedBuilder} = require('discord.js')
const VCSchema = require('../../Database/Models/CustomVC')

module.exports = {
    name: 'deputize',
    usage: ['GIve someone Deputy Permissions to Assist with the VC', '```{prefix}deputize <member Mention/ID>```'],
    enabled: true,
    aliases: [],
    category: 'VC',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            } else {
                return client.embed.usage(message, data)
            }
        }
        const member = await client.tools.resolveMember(args[0], message.guild)
        if(!member){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            } else {
                return message.channel.send(`${client.custom.membercunt}`)
            }
        }
        const VC = await VCSchema.findOne({
            textChannelId: message.channel.id
        })
        let {ownerId, deputies} = VC
        if(message.author.id !== ownerId){
            return message.channel.send(`Sorry But you Dont have the Permissions to Do this!`)
        }
        if(!VC.deputies){
            VC.deputies = member.id
        }else {
        VC.deputies.push(member.id)}
        await VC.save()

        const channel = message.channel
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
        const depts = []
        if((VC.deputies).length === 1){
            depts.push(`${member}`)
        } else {
        for (let i = 0; i < (VC.deputies).length; i+=1){
            const member = await message.guild.members.cache.get(VC.deputies[i])
            depts.push(`${member}`)
        }
    }
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: `${VC.channelName}`, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`This Voice Channel has the Following Options Enabled:\n${emojiDesc.join('\n\n')}`)
        .addFields([
            {
                name: `__Owner__`, value: `<@!${VC.ownerId}>`, inline: true
            },
            {
                name: `__Deputies__`, value: `${depts.join(' ')}\n\nYou can change ownership with \`${data.guild.prefix}giveowner @member\``, inline: false
            }
        ])
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
    }
}