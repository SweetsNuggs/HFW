const {EmbedBuilder} = require('discord.js')

module.exports = {
    name: 'roll',
    usage: ['Roll Some Dice', '```{prefix}roll'],
    enabled: true,
    aliases: ['dice'],
    category: 'Other',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false,
    cooldown: 50,

    async execute(client, message, args, data){
        if(message.member.roles.cache.has(client.config.malerole)){
            const array = [1, 1, 2, 3, 2, 3, 4, 4, 4, 5, 5, 6, 6, 6, 5, 5, 6, 6, 6, 5, 4, 5, 6]
            const number = array[Math.round(Math.random() * array.length)]
            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setDescription(`🎲🎲 Dice Rolled \`${number}\``)
            .setFooter({text: `${message.guild.name}`})
            .setTimestamp()

            return message.channel.send({embeds: [embed]})
        }
        const array = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 4, 5, 6, 5, 6]
        const number = array[Math.round(Math.random() * array.length)]
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`🎲🎲 Dice Rolled \`${number}\``)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
    }
}