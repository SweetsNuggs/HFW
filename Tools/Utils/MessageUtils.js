const {EmbedBuilder} = require('discord.js')
const config = require('../../config.json')
const {confessioncolors} = require('../../Tools/colors.json')
const CountingSchema = require('../../Database/Models/Counting')

async function Confess(message, client){
    const channel = await client.channels.cache.get(client.config.confessionchannel)
    let guildData = await client.Database.fetchGuild(channel.guild.id)
    guildData.confessions++
    await guildData.save();

    const color = await confessioncolors[Math.round(Math.random() * confessioncolors.length)]

    const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`Confession #${guildData.confessions}`)
    .setDescription(`${message.content}`)
    .setTimestamp()
    
    const logchannel = await client.channels.cache.get(client.config.confessionlogchannel)

    const logembed = new EmbedBuilder()
    .setColor(client.config.color)
    .setAuthor({name: `Log For Confession #${guildData.confessions}`})
    .setDescription(`"${message.content}"`)
    .addFields([
        {name: `__User__`, value: `||${message.author.tag}||`, inline: false},
        {name: `__ID__`, value: `||${message.author.id}||`, inline: false}
    ])
    .setTimestamp()

    await logchannel.send({embeds: [logembed]})
    return channel.send({embeds: [embed]})
}

async function handleCount(message, content, author, client){
    const CS = await CountingSchema.findOne({
        guildId: message.guild.id,
        channelId: message.channel.id
    })
    if(!CS){
        return;
    }

    const matches = content.match(/^\d+/)
    if(!matches){
        return;
    }

    number = matches[0]

    number = parseInt(number)
    

    if(author.id === CS.counterId){
        await message.react('❌')
        await message.channel.send(`${message.member} Counted Twice! FAIL! Restart at 0`)
        const channel = await message.guild.channels.cache.get(CS.failChannelId)
        await channel.send(`${message.member} Counted Twice! FAIL! Restart at 0`)

        CS.currentNumber = 0 
        CS.counterId = null
        await CS.save()
        return
    }

    if(number !== (CS.currentNumber + 1)){
        await message.react('❌')
        await message.channel.send(`${message.member} Messed up the Count at ${CS.currentNumber}! The Next Number was ${CS.currentNumber + 1}! Restart at 0`)
        const channel = await message.guild.channels.cache.get(CS.failChannelId)
        if(!message.member.roles.cache.has(client.config.malerole)){
        await channel.send(`${message.member} Messed up the Count at ${CS.currentNumber}! The Next Number was ${CS.currentNumber + 1}! Restart at 0`)
        }
        CS.currentNumber = 0
        CS.counterId = null
        await CS.save()
        return;
    }
    await message.react('✅')
    CS.currentNumber = CS.currentNumber + 1
    CS.counterId = author.id 
    await CS.save();

    return

}
module.exports = {
    Confess,
    handleCount
}