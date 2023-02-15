const {EmbedBuilder} = require('discord.js')

module.exports = {
    name: 'approve-cunt',
    usage: ['Approve a Cunt for Verification', '```{prefix}approve-cunt <member mention/ID>```'],
    enabled: true,
    aliases: ['cunt', 'approvecunt', 'Cunt', 'approve-Cunt', 'verify-cunt'],
    category: 'Admin', 
    memberPermissions: ['Administrator'],
    botPermissions: ['SendMessages', 'EmbedLinks', 'ManageRoles'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            } else 
            return client.embed.usage(message, data)
        }
        const member = await client.tools.resolveMember(args[0], message.guild)
        if(!member) {
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            } else return message.channel.send(`${client.custom.membercunt}`)
        }
        
        await member.roles.remove(client.config.newmemberrole) 
        await member.roles.add(client.config.verifiedcuntrole)
        await member.roles.add(client.config.processingrole)
        await member.roles.add(client.config.icebreakerrole)

        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`Congrats on completing your verification ${member} . Are you ready to be amongst the other cunts serving the men in **${message.guild.name}**?
        \n\nYou have some additional steps to complete first. Select your appropriate roles in <#952905713255088168> , and make sure to fill out your <#880144005885722734> . Do be sure to follow the template provided including your hard limits, soft limits, and about me sections! This is so the Sirs know how best to use you!!
        \n\nOnce you have completed this, head over to <#893145893828722749> , ping <@&880981817849684029> and a <@&880713914449559603> will be along soon to help get you settled!`)
        .setFooter({text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
    }
}