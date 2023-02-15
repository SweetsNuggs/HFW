const {Message, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js')

module.exports = {
    name: 'cmds',
    usage: ['View All Commands Sorted by Category', '```{prefix}cmds```'],
    enabled: true,
    aliases: [],
    category: 'Other',
    memberPermissions: [],
    botPermissions: ['SendMessages', 'EmbedLinks'],
    nsfw: false, 
    cooldown: 50,

    async execute(client, message, args, data){
        const main = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`${client.user.username}'s Help Menu`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Arguments*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        let page = 1
        const row = new ActionRowBuilder()
        row.addComponents(
            new ButtonBuilder()
            .setCustomId('first')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⏮️')
        )
        row.addComponents(
            new ButtonBuilder()
            .setCustomId('prev')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('◀️')
        )
        row.addComponents(
            new ButtonBuilder()
            .setCustomId('next')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('▶️')
        )
        row.addComponents(
            new ButtonBuilder()
            .setCustomId('last')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⏭️')
        )

        const actcmds = []
        const act = await client.commands.filter(x => x.category === 'Action')
        .forEach((cmd) => actcmds.push({name: `__${cmd.name}__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join("\n")}`}))
        const pg2 = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`🎬 Actions`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Arguments*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .addFields(actcmds)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        const admcmds = []
        const adm = await client.commands.filter(x => x.category === 'Admin')
        .forEach((cmd) => admcmds.push({name: `__${cmd.name}__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join("\n")}`}))
        const pg3 = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`🤠 Admin`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Arguments*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .addFields(admcmds)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        const confcmds = []
        const conf = await client.commands.filter(x => x.category === 'Configuration')
        .forEach((cmd) => confcmds.push({name: `__${cmd.name}__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join("\n")}`}))
        const pg4 = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`✏️ Configuration`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Arguments*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .addFields(confcmds)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        const infocmds = []
        const info = await client.commands.filter(x => x.category === 'Info')
        .forEach((cmd) => infocmds.push({name: `__${cmd.name}__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join("\n")}`}))
        const pg5 = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`❔ Info`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Arguments*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .addFields(infocmds)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        const vccmds = []
        const vc = await client.commands.filter(x => x.category === 'VC')
        .forEach((cmd) => vccmds.push({name: `__${cmd.name}__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join('\n')}`}))
        const pg6 = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`🎤 VC`)
        .setDescription(`Please Use the Arrows Below to Navigate Through the Different Command Categories.\n*Note:\n<> = Required Arguments\n[] = Optional Argument*\n\nTo View a Command More in Depth, Simply use the command \`${data.guild.prefix}help [command]\``)
        .addFields(vccmds)
        .setFooter({text: `${message.guild.name}`})
        .setTimestamp()

        let reply = Message | undefined
        let collector;
        const filter = (x) => x.user.id === message.author.id
        const time = 1000 * 60 * 5
        if(message){
            reply = await message.channel.send({embeds: [main], components: [row]})

            collector = reply.createMessageComponentCollector({filter, time})
        }

        collector.on('collect', (bntInt) => {
            if(!bntInt){
                return
            }
            bntInt.deferUpdate()
            if(bntInt.customId === 'first'){
                page = 1
                reply.edit({embeds: [main], components: [row]})
            }
            if(bntInt.customId === 'next'){
                page++
                if(page === 2){
                reply.edit({embeds: [pg2], components: [row]})
                }
                if(page === 3){
                    reply.edit({embeds: [pg3], components: [row]})
                }
                if(page === 4){
                    reply.edit({embeds: [pg4], components: [row]})
                }
                if(page === 5){
                    reply.edit({embeds: [pg5], components: [row]})
                }
                if(page === 6){
                    reply.edit({embeds: [pg6], components: [row]})
                }
            }
            if(bntInt.customId === 'prev'){
                page--
                if(page === 1){
                    reply.edit({embeds: [main], components: [row]})
                }
                if(page === 2){
                    reply.edit({embeds: [pg2], components: [row]})
                }
                if(page === 3){
                    reply.edit({embeds: [pg3], components: [row]})
                }
                if(page === 4){
                    reply.edit({embeds: [pg4], components: [row]})
                }
                if(page === 5){
                    reply.edit({embeds: [pg5], components: [row]})
                }
                if(page === 6){
                    reply.edit({embeds: [pg6], components: [row]})
                }
            }
            if(bntInt.customId === 'last'){
                page = 6
                reply.edit({embeds: [pg6], components: [row]})
            }
        })
    }
}