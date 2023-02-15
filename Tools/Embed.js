const {EmbedBuilder} = require("discord.js")
const config = require('../config.json')


module.exports.cunt = async function(message, embed){
    let newEmbed = new EmbedBuilder()
    .setColor(config.color)
    .setDescription(`You have some additional steps you still need to complete. Please be sure to pick up the appropriate <#952905713255088168> and fill out your <#880144005885722734> and be sure to follow the template provided including your hard limits, soft limits, and about me sections so the Sirs know best how to use you.
    \n\nOnce you have completed this, head over to <#893145893828722749> and ping <@&880713914449559603>. There a <@&880713914449559603> will be along soon to help get you started!`)
    .setFooter({text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
    .setTimestamp()

    embed = {...newEmbed, ...embed}

    return message.channel.send({embeds: [embed]})
}

module.exports.usage = async function(message, data){
    let cmd = data.cmd;
    let aliases = (cmd.aliases.length < 1) ? "None" : cmd.aliases.join('\n')
    let usageDesc = await cmd.usage.join('\n').replace(/{prefix}/g, data.guild.prefix)
    let newEmbed = new EmbedBuilder()
    .setColor('Red')
    .setFooter({text: `${message.guild.name}`})
    .setAuthor({name: `Uh-Oh`, iconURL: message.client.user.displayAvatarURL({dynamic: true})})
    .setDescription("Missing Arguments for Command. Please provide the Correct Arguments")
    .addFields(
        {name: `__Aliases__`, value: `${aliases}`, inline: false},
        {name: '__Usage__', value: `${usageDesc}`, inline: false}
        )
    .setTimestamp()

    return message.channel.send({embeds: [newEmbed]})
}

module.exports.sirusage = async function(message, data){
    let cmd = data.cmd
    let aliases = (cmd.aliases.length < 1) ? "None" : cmd.aliases.join('\n')
    let usageDesc = await cmd.usage.join('\n').replace(/{prefix}/g, data.guild.prefix)

    let newEmbed = new EmbedBuilder()
    .setColor('Red')
    .setFooter({text: `${message.guild.name}`})
    .setAuthor({name: `Oh-No Sir!`, iconURL: message.client.user.displayAvatarURL({dynamic: true})})
    .setDescription(`Sir, it looks like you are Missing Arguments for this Command! Please do provide the Correct Arguments!`)
    .addFields(
        {name: `__Aliases__`, value: `${aliases}`, inline: false},
        {name: `__Usage__`, value: `${usageDesc}`, inline: false}
    )
    .setTimestamp()

    return message.channel.send({embeds: [newEmbed]})
}

module.exports.image = async function(message, embed){
    let newEmbed = EmbedBuilder.from(embed)
    newEmbed.setFooter({text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
    .setColor(config.color)
    .setTimestamp()

    return message.channel.send({embeds: [newEmbed]})
}
