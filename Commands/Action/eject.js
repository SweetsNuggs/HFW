const {EmbedBuilder} = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'eject', 
    usage: ['Eject someone sus', '```{prefix}eject <member mention>```'],
    enabled: true,
    aliases: ['yeet'],
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
        const imp = [true, false];
        const imposter = imp[Math.floor(Math.random() * imp.length )]
        const crew = [
            "black", "blue", "brown", "cyan", "darkgreen", "lime", "oragne", "pink", "purple", "red", "white", "yellow",
        ]
        const crewmate = crew[Math.floor(Math.random() * crew.length)]
        const picdata = await fetch(
            `https://vacefron.nl/api/ejected?name=${member.displayName}&impostor=${imposter}&crewmate=${crewmate}`
          );
        const embed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setAuthor({name: message.member.displayName, iconURL: message.author.displayAvatarURL({dynamic: true})})
        .setTitle(`${message.member.displayName} decided to eject ${member.displayName}`)
        .setFooter({text: `Tragic. | ${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
        .setImage(picdata.url)
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
    }
}