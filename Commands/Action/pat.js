const {patP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'pat', 
    usage: ['Give someone a headpat', '```{prefix}pat <member mention>```'],
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
        const pat = patP[Math.round(Math.random() * patP.length)]

        const embed = {
            title: `${member.displayName} got a headpat!`,
            description: `\`Hurray! ${member.displayName} got a headpat from ${message.member.displayName}!!\``,
            url: pat,
            image: {
                url: pat
            }
        }
        return client.embed.image(message, embed)
    }
}