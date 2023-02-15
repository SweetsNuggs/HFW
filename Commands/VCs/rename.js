const VCSchema = require('../../Database/Models/CustomVC')

module.exports = {
    name: 'rename',
    usage: ['Rename a Custom VC', '```{prefix}rename <new Name>```'],
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
        let {channelId, textChannelId, ownerId} = VC
        if(ownerId !== message.author.id){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`I'm Sorry Sir... But This doesn't seem to be your channel to rename`)
            } else {
                return message.channel.send(`Sorry you can't rename this VC!`)
            }
        }
        const textchannel = await message.guild.channels.fetch(textChannelId)
        const vcchannel = await message.guild.channels.fetch(channelId)
        const newname = `${VC.settings}${args.join('-')}`
        await textchannel.edit({name: `${newname}`})
        await vcchannel.edit({name: `${newname}`})

        await VC.updateOne({
            channelName: args.join('-')
        })
        return message.react('✅')
    }
}