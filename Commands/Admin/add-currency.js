const {EmbedBuilder} = require('discord.js')
const AuctionSchema = require("../../Database/Models/Auction")
const {cash} = require("../../Tools/jsons/emojis.json")

module.exports = {
    name: 'add',
    usage: [`Add Currency to a Sir's Bank`, '```{prefix}add <member mention/ID> <amount>```'],
    enabled: true,
    category: 'Admin',
    aliases: ['add-currency', 'addcurrency', 'addmoney', 'add-money'],
    memberPermissions: ['Administrator'],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,
    
    async execute(client, message, args, data){
        if(!args[0]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            }
            return client.embed.usage(message, data)
        }
        const member = await client.tools.resolveMember(args[0], message.guild)
        if(!member){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            } 
            return message.channel.send(`${client.custom.membercunt}`)
        }
        if(member.user.bot){
            return message.channel.send(`Sorry But Bots Cannot Obtain Currency`)
        }
        if(!member.roles.cache.has(client.config.malerole)){
            return message.channel.send(`Currency is for Sirs only!`)
        }
        if(!args[1]){
            if(message.member.roles.cache.has(client.config.malerole)){
                return client.embed.sirusage(message, data)
            }
            return client.embed.usage(message, data)
        }
        let amount = args[1]
        amount = Math.round(amount)
        if(!amount || isNaN(amount) || amount < 1){
            return client.embed.usage(message, data)
         }
        const male = await AuctionSchema.findOne({
            guild: message.guild.id,
            id: member.id
        })
        if(male){
            male.currency = male.currency + amount 
            await male.save();
            const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`Successfully Deposited $${amount} ${cash} to ${member}\n${member} now has $${male.currency} ${cash}`)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
        } else if (!male) {
            const newMale = new AuctionSchema({
                guild: message.guild.id,
                id: member.id,
                currency: amount
            })
            await newMale.save();
            const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`Successfully Deposited $${amount} ${cash} to ${member}\n${member} now has $${newMale.currency} ${cash}`)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        return message.channel.send({embeds: [embed]})
        }
    }
}