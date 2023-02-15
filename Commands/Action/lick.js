const {lickP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'lick',
    usage: ['Lick Someone', '```{prefix}lick <member mention>```'],
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
        const lick = lickP[Math.round(Math.random() * lickP.length)]
        
        const embed = {
            title: `${member.displayName} was just licked!`,
            description: `\`${message.member.displayName} licked ${member.displayName}! Yucky!\``,
            url: lick, 
            image: {
                url: lick
            }
        }

        return client.embed.image(message, embed)
    }
}