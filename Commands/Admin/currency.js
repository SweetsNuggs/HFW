const {EmbedBuilder} = require('discord.js')
const AuctionSchema = require('../../Database/Models/Auction')
const {cash} = require('../../Tools/jsons/emojis.json')

async function MaleCurrency(m, guild){
    const strings = []
    for (let i = 0; i < (m).length; i += 1){
        const malemember = await AuctionSchema.findOne({
            guild: guild.id,
            id: m[i].id
        })
        if(!malemember){
            strings.push(`${m[i]} : $0 ${cash}`)
        } else {
            strings.push(`${m[i]} : $${malemember.currency} ${cash}`)
        }
    }
    return strings.join('\n')
}
module.exports = {
    name: 'currency',
    usage: ['View all the Currency Standings of Members or of a Specific Member', '```{prefix}currency (member mention/ID)```'],
    enabled: true,
    aliases: ['view', 'bal', 'balance', 'money'],
    category: 'Admin', 
    memberPermissions: ['Administrator'],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        if(args[0]){
            const member = await client.tools.resolveMember(args[0], message.guild)
            if(!member){
                if(message.author.roles.cache.has(client.config.verifiedsirrole)){
                    return message.channel.send(`${client.custom.membersir}`)
                }
                return message.channel.send(`${client.custom.membercunt}`)
            }
            const dude = await AuctionSchema.findOne({
                guild: message.guild.id,
                id: member.id
            })
            const dudemoney = []
            if(!dude){
                dudemoney.push(`$0 ${cash}`)
            } else {
                dudemoney.push(`$${dude.currency} ${cash}`)
            }
            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(`Currency for ${member}\n*Note: To Edit Currency, use ${client.config.prefix}add-currency <member mention/ID> <amount>*\n\n${dudemoney}`)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setFooter({text: `${message.guild.name}`})
            .setTimestamp()

            return message.channel.send({embeds: [embed]})
            
        }
        const guild = message.guild
        const allmales = []
        const male = guild.members.cache.filter((m) => m.roles.cache.has(client.config.verifiedsirrole)).forEach(async m => {
            allmales.push(m)
        })
        const minfo = await MaleCurrency(allmales, guild)
        
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`${minfo}`)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()
        return message.channel.send({embeds: [embed]})

    }
}