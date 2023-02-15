const {kissP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'kiss', 
    usage: ['Give a cute smoochin', '```{prefix}kiss <member mention>```'],
    enabled: true,
    aliases: ['smooch'],
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
        const kiss = kissP[Math.round(Math.random() * kissP.length)]

        const embed = {
            title: `${message.member.displayName} and ${member.displayName} are kissing!`,
            description: `\`Oh Love must be in the air! ${member.displayName} is kissing with ${message.member.displayName}!!\``,
            url: kiss,
            image: {
                url: kiss
            }
        }

        return client.embed.image(message, embed)
    }
}