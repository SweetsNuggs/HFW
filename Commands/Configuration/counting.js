const {EmbedBuilder} = require('discord.js')
const CountingSchema = require('../../Database/Models/Counting')

module.exports = {
    name: 'counting',
    usage: ['Set the Counting Configurations', 'Set the Counting Channel','```{prefix}counting set <channel Mention/ID>```', 'Set the Fail Channel', '```{prefix}counting fail <channel Mention/ID>```'],
    enabled: true,
    aliases: [],
    category: 'Configuration',
    memberPermissions: ['Administrator'],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            } else {
                return client.embed.usage(message, data)
            }
        }
        if(args[0].toLowerCase() === 'set'){
            const channel = await client.tools.resolveChannel(args[1], message.guild)
            if(!channel){
                if(message.member.roles.cache.has(client.config.malerole)){
                    return message.channel.send(`Sorry Sir.. I am not sure what Channel that is`)
                }
                return message.channel.send(`Unable to find the Specified Channel`)
            }
            const C = await CountingSchema.findOne({
                guildId: message.guild.id
            })
            if(!C){
            const CS = new CountingSchema({
                guildId: message.guild.id,
                channelId: channel.id,
                currentNumber: 0,
            })
        

            await CS.save()
        
            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Successfully Set the Counting Channel to ${channel}`)
            .setFooter({text: `${message.guild.name}`})
            .setTimestamp()
    

            return message.channel.send({embeds: [embed]})
        }
        else C.channelId = channel.id
        await C.save();

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Successfully Set the Counting Channel to ${channel}`)
            .setFooter({text: `${message.guild.name}`})
            .setTimestamp()
    

            return message.channel.send({embeds: [embed]})

        }
        if(args[0].toLowerCase() === 'fail'){
            const channel = await client.tools.resolveChannel(args[1], message.guild)
            if(!channel){
                if(message.member.roles.cache.has(client.config.malerole)){
                    return message.channel.send(`Im Sorry Sir.. But I am unable to find that Channel`)
                }
                return message.channel.send(`Unable to find the Specified Channel`)
            }
            const CS = await CountingSchema.findOne({
                guildId: message.guild.id
            })
            if(!CS){
                return message.channel.send(`Please Set First a Counting Channel Before a Fail Channel. Thank you.`)
            }
            CS.failChannelId = channel.id
            await CS.save()

            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setDescription(`The Fail Message Channel has now been set to ${channel}`)
            .setFooter({text: `${message.guild.name}`})
            .setTimestamp()

            return message.channel.send({embeds: [embed]})
        }
    }
}