const {pokeP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'poke', 
    usage: ['Poke someone!', '```{prefix}poke <member mention>```'],
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
        const poke = pokeP[Math.round(Math.random() * pokeP.length)]

        const embed = {
            title: `${member.displayName} got poked by ${message.member.displayName}!`,
            description: `\`Isnt that rude! ${message.member.displayName} just started poking ${member.displayName}!!\``,
            url: poke,
            image: {
                url: poke
            }
        }

        return client.embed.image(message, embed)
    }
}