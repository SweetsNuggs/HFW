const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'approve-sir', 
    usage: ['Approve a Sir for Verification', '```{prefix}approve-sir <member mention/ID>```'],
    enabled: true,
    aliases: ['approvesir', 'sir', 'Sir', 'approve-Sir', 'verify-sir'],
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
        await member.roles.add(client.config.verifiedsirrole)
        await member.roles.add(client.config.processingrole)
        await member.roles.add(client.config.icebreakerrole)

        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`Hello, ${member} . Your Verification is now complete. There are three (3) more steps for you to complete before you are allowed into the main area of the server.
        \n\nFirst, Please complete your <#880143986780692501> and be sure to follow the template provided including your hard limits, soft limits, and about me sections. Afterwards, please be sure to pick up the appropriate <#952905713255088168> .
        \n\nOnce you have completed this, head over to <#893145893828722749> and ping <@&880981817849684029> . There a <@&928336072126111745> will be along to assist you!
        \n\nOur lovely cunts do look forward to serving you in the server!`)
        .setFooter({text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
    }
}