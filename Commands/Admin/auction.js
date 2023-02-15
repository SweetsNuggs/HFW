const {Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const AuctionSchema = require('../../Database/Models/Auction')
const {cash, end, bid} = require('../../Tools/jsons/emojis.json')

module.exports = {
    name: 'auction', 
    usage: ['Starts a Cunt Auction', '```{prefix}auction <mention actioned cunt/ID>```'],
    enabled: true,
    aliases: [],
    category: 'Admin',
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
        const cunt = await client.tools.resolveMember(args[0], message.guild)
        if(!cunt){
            if(message.member.roles.cache.has(client.config.malerole)){
                return message.channel.send(`${client.custom.membersir}`)
            }
            return message.channel.send(`${client.custom.membercunt}`)
        }
        const guild = message.guild
        const bidmsg = await message.channel.send(`Please Send One at a Time Each Particpating Member. When you are finished state \`'done'\``)
        const filter = (m) => message.author.id === m.author.id
        const collector = await message.channel.createMessageCollector({
            filter, 
            time: 60000
        })
        await collector.on('collect', m => {
            if(m.content.toLowerCase() === 'done'){
                collector.stop()
                bidmsg.delete()
            }
            else m.react('✅')
        })
        await collector.on('end', async m => {
            const male = []
            const allmales = []
            m.sweep(x => x.content.toLowerCase() === 'done')
            await m.forEach(async c => {
            if(c.content.startsWith(`<@`) && c.content.endsWith(`>`)){
                c = c.content.slice(2, -1)
            } else
            if(c.content.startsWith(`<@!`) && c.content.endsWith(`>`)){
                c = c.content.slice(3, -1)
            }
            male.push(await guild.members.cache.find(m => m.id === c))
            allmales.push(c)
        })
        const currency = await MaleCurrency(male, guild)        
            
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`Auction of ${cunt.user.tag} (${cunt.displayName})`)
        .setDescription(`Bidders:\n${currency}`)
        .setThumbnail(cunt.displayAvatarURL({dynamic: true}))
        .setFooter({text: `If this is correct, please state 'ready'. If incorrect, state 'cancel' and restart`})

        const startmsg = await message.channel.send({embeds: [embed]})
        
        let beginmsg 
        try{
            beginmsg = await message.channel.awaitMessages({
                filter,
                time: 60000,
                max: 1,
                errors: ['time']
            })
        } catch(e){
            return
        }
        if(beginmsg.first().content.toLowerCase() === 'cancel'){
            return startmsg.delete()
        }
        if(beginmsg.first().content.toLowerCase() === 'ready'){
           const auctionembed = new EmbedBuilder()
           .setColor(client.config.color)
           .setTitle(`Auction of ${cunt.user.tag} (${cunt.displayName})`)
           .setDescription(`Current Bid: $0 ${cash}\nCurrent Bidder: \`None\``)
           .setFooter({text: `${message.guild.name}`})
           .setTimestamp()

           let currentbid = 0 
           let currentbidder = null
           const row = new ActionRowBuilder()
           .addComponents(
            new ButtonBuilder()
            .setCustomId('bid25')
            .setStyle(ButtonStyle.Success)
            .setEmoji(`${bid}`)
            .setLabel(`Bid $25`)
            )
           .addComponents(
            new ButtonBuilder()
            .setCustomId('bid50')
            .setEmoji(`${bid}`)
            .setLabel(`Bid $50`)
            .setStyle(ButtonStyle.Success)
           )
           .addComponents(
            new ButtonBuilder()
            .setCustomId(`bid75`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`${bid}`)
            .setLabel(`Bid $75`)
           )
           .addComponents(
            new ButtonBuilder()
            .setCustomId(`bid100`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`${bid}`)
            .setLabel(`Bid $100`)
           )
           .addComponents(
            new ButtonBuilder()
            .setCustomId(`End`)
            .setLabel(`End Auction`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`${end}`)
           )

           await startmsg.delete()
           let reply = Message | undefined
           let auctioncollector;
           const filter2 = x => {return allmales.some(i => i.id === x.user.id)}
           const time2 = 1000 * 60 * 5
           if(message){
            reply = await message.channel.send({embeds: [auctionembed], components: [row]})
            
            auctioncollector = reply.createMessageComponentCollector({filter2, time2})
        }
        auctioncollector.on('collect', async (bntInt) => {
            if(!bntInt){
                return
            }
            bntInt.deferUpdate()
            if(bntInt.customId === 'bid25' && bntInt.user.id !== currentbidder){
                const maleguy = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: bntInt.user.id
                })
                maleguy.currentbid = maleguy.currentbid + 25
                if(maleguy.currency >= maleguy.currentbid){
                const newauctionembed = EmbedBuilder.from(auctionembed).setDescription(`Current Bid: $${currentbid + 25} ${cash}\nCurrent Bidder: \`${bntInt.user.username} (${bntInt.member.displayName})\``)
                currentbid = currentbid + 25
                currentbidder = bntInt.user.id
                await maleguy.save();
                reply.edit({embeds: [newauctionembed], components: [row]})}
            }
            if(bntInt.customId === 'bid50' && bntInt.user.id !== currentbidder){
                const maleguy = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: bntInt.user.id
                })
                maleguy.currentbid = maleguy.currentbid + 50
                if(maleguy.currency >= maleguy.currentbid){
                const newauctionembed = EmbedBuilder.from(auctionembed).setDescription(`Current Bid: $${currentbid + 50} ${cash}\nCurrent Bidder: \`${bntInt.user.username} (${bntInt.member.displayName})\``)
                currentbid = currentbid + 50
                currentbidder = bntInt.user.id
                await maleguy.save();
                reply.edit({embeds: [newauctionembed], components: [row]})}
            }
            if(bntInt.customId === 'bid75' && bntInt.user.id !== currentbidder){
                const maleguy = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: bntInt.user.id
                })
                maleguy.currentbid = maleguy.currentbid + 75 
                if(maleguy.currency >= maleguy.currentbid){
                const newauctionembed = EmbedBuilder.from(auctionembed).setDescription(`Current Bid: $${currentbid + 75} ${cash}\nCurrent Bidder: \`${bntInt.user.username} (${bntInt.member.displayName})\``)
                currentbid = currentbid + 75
                currentbidder = bntInt.user.id
                await maleguy.save();
                reply.edit({embeds: [newauctionembed], components: [row]})}
            }
            if(bntInt.customId === 'bid100' && bntInt.user.id !== currentbidder){
                const maleguy = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: bntInt.user.id
                })
                maleguy.currentbid = maleguy.currentbid + 100
                if(maleguy.currency >= maleguy.currentbid){
                const newauctionembed = EmbedBuilder.from(auctionembed).setDescription(`Current Bid: $${currentbid + 100} ${cash}\nCurrent Bidder: \`${bntInt.user.username} (${bntInt.member.displayName})\``)
                currentbid = currentbid + 100
                currentbidder = bntInt.user.id
                await maleguy.save();
                reply.edit({embeds: [newauctionembed], components: [row]})}
            }
            if(bntInt.customId === 'End' && bntInt.user.id === client.config.whisperId){
                await MaleReset(male, guild)
                const finalembed = EmbedBuilder.from(auctionembed).setColor('Red').setDescription(`⛔ Auction Has Ended ⛔\n\nWinner: ${await client.tools.resolveMember(currentbidder, guild)}\n\nAmount Sold For: $${currentbid} ${cash}`).setThumbnail(cunt.user.displayAvatarURL({dynamic: true}))
                return reply.edit({embeds: [finalembed]})
            }
        })
        } else {return}

        async function MaleReset(male, guild){
            for (let i = 0; i < (male).length; i += 1){
                const malemember = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: male[i].id
                })
                malemember.currency = malemember.currency - malemember.currentbid 
                await malemember.save();
                malemember.currentbid = 0 
                await malemember.save();
                return;
            }
            return;
        }
        async function MaleCurrency(male, guild){
            const strings = []
            for (let i = 0; i < (male).length; i +=1){
                const money = await AuctionSchema.findOne({
                    guild: guild.id,
                    id: male[i].id
                })
                if(!money){
                    strings.push(`${male[i]} : $0 ${cash}`)
                } else {
                    strings.push(`${male[i]} : $${money.currency} ${cash}`)
                }
            }
            return strings.join('\n')
        }
    })
    }
}