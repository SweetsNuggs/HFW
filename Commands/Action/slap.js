const {slapP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'slap', 
    usage: ['Slap someone', '```{prefix}slap <member mention>```'],
    enabled: true,
    aliases: [],
    category: 'Action',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        if(message.channel.id !== client.config.actionchannel){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.actionsir}`)
            } else 
            return message.channel.send(`${client.custom.actioncunt}`)
        }
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            } else 
            return client.embed.usage(message, data)
        }
        const member = message.mentions.members.first()
        if (!member){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            } else return message.channel.send(`${client.custom.membercunt}`)
        }
        if(member.user.bot) return message.channel.send(`${client.custom.actionbot}`)
        if (member.id === message.author.id) return message.channel.send(`${client.custom.actionself}`);
        const slap = slapP[Math.round(Math.random() * slapP.length)]

        const embed = {
            title: `Ouch! ${member.displayName} just got slapped!`,
            description: `\`${message.member.displayName} just slapped ${member.displayName}! Thats so Rude!!\``,
            url: slap,
            image: {
                url: slap
            }
        }
        return client.embed.image(message, embed)
    }
}