const {cryP} = require('../../Tools/jsons/actions.json')

module.exports = {
    name: 'cry',
    usage: ['Sends a crying Gif', '```{prefix}cry```'],
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
        
        const cry = cryP[Math.round(Math.random() * cryP.length)]
   
        const embed = {
            title: `${message.member.displayName} began to cry!`,
            description: `\`Oh Poor Little ${message.member.displayName} is Crying! Whats Wrong Friend?\``,
            url: cry,
            image: {
                url: cry 
            }
        }

        return client.embed.image(message, embed)
    }
}
