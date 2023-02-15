const {EmbedBuilder} = require('discord.js')
const VCSchema = require('../../Database/Models/CustomVC')

module.exports = {
    name: 'allow', 
    usage: ['Allow someone to Enter the VC', '```{prefix}allow <member Mention/ID>```'],
    enabled: true,
    aliases: [],
    category: 'VC', 
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks', 'ManageChannels'],
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
        const VC = await VCSchema.findOne({
            textChannelId: message.channel.id
        })
        let {channelId, ownerId} = VC
        if(ownerId !== message.author.id){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`I'm Sorry Sir but you do not have the permissions to allow people into this voice channel`)
            } else {
                return message.channel.send(`Sorry but you do not have the right permissions to allow people into this voice channel`)
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
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`${member} , you are now allowed to join`)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        const channel = message.guild.channels.cache.get(channelId)
        channel.permissionOverwrites.edit(member.id, {ViewChannel: true, Connect: true, Speak: true})

        return message.channel.send({embeds: [embed]})
    }
}