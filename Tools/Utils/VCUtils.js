const {EmbedBuilder, ChannelType, PermissionsBitField} = require("discord.js")
const VCSchema = require('../../Database/Models/CustomVC')

async function NewVc(client, channel, member) {
            //MAKE SURE TO ADD THE STAFF ROLE INTO ALLOWING PERMISSIONS 
    const createembed = new EmbedBuilder()
    .setColor(client.config.color)
    .setAuthor({name: `Set Up Your Custom VC`, iconURL: client.user.displayAvatarURL({dynamic: true})})
    .addFields([
        {name: `__Options__`, value: `💛 - On Theme (Misogyny, use Honorifics, can be sexual conversations or sexual acts - What comes, goes) \n\n💙 - Off Theme (Remember, only for events or if staff makes exceptions)\n\n❓ - Ask to Join (Type \`${client.config.prefix}ask\` to request)\n\n📸 - Event (used for Server/Member Events)\n\n🔪 - Extreme (No Censorship in this VC, Extreme Kinks)\n\n🎵 - Music (Use this Channel for Music Bot)`, inline: false},
        {name: `__Naming__`, value: `Once the Channel Purpose Reactions have been set, the next message in this channel from ${member} will finalize the set up and name the channel`, inline: false},
        {name: `__Owner__`, value: `${member}`, inline: false}
    ])
    .setFooter({text: `${channel.guild.name}`})
    .setTimestamp()

    const guild = channel.guild
    const askchannel = await guild.channels.create({
        name: `custom-vc`, 
        type: ChannelType.GuildText,
        topic: member.id,
        parent: '1013855374429933593',
        permissionOverwrites: [
            {
                id: member.id,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.config.verifiedcuntrole,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.config.malerole,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
            }
        ]
    })

    const askmessage = await askchannel.send({content: `${member}`, embeds: [createembed]})
    askmessage.react('💛')
        .then(() => askmessage.react('💙'))
        .then(() => askmessage.react('❓'))
        .then(() => askmessage.react('📸'))
        .then(() => askmessage.react('🔪'))
        .then(() => askmessage.react('🎵'))
        const filter = (reaction, user) => {
            return ['💛', '💙', '❓', '📸', '🔪', '🎵'].includes(reaction.emoji.name) && user.id === member.id
        }
        const namefilter = m => m.user.id === member.user.id
        const emoji = []
        let open = true
        const collector = askmessage.createReactionCollector({filter, max: 5, time: 600000})
        const namecollector = askmessage.channel.createMessageCollector({namefilter, max: 1, time: 600000})
        collector.on('collect', (reaction, user) => {
            emoji.push(reaction.emoji)
            if(reaction.emoji.name === '❓'){
                return open = false
            }
        })
        let customname
        namecollector.on('collect', m => {
            customname = m.content.toLowerCase()
        })

        namecollector.on('end', async (collected, reaction) => {
            console.log(`collected ${collected.toString()}`)
            await askchannel.edit({name: `${emoji.join('-')}-${customname}`})
            const newvc = channel.clone()
            if(open === true){
            channel.edit({name: `${emoji.join('-')}-${customname}`, 
            topic: member.id,
            permissionOverwrites: [
            {
                id: member.id,
                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.config.verifiedcuntrole,
                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.config.malerole,
                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
            }
            ]})
        } else 
            if(open === false ){
                channel.edit({
                    name: `${askchannel.name}`,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: client.user.id,
                            allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: client.config.verifiedcuntrole,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                        },
                        {
                            id: client.config.malerole,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                           deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                        },
                        {
                            id: guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                })
            }
            askmessage.delete()
            const optionsDesc = []
            if(emoji.find( emoji => emoji.name === '💛')){
                optionsDesc.push(`💛 - On Theme (Misogyny, Use Honorifics, can be sexual conversations or sexual acts - What comes, goes)`)
            }
            if(emoji.find(emoji => emoji.name ==='💙')){
                optionsDesc.push(`💙 - Off Theme (Remember, only for Events or if staff makes exceptions)`)
            }
            if(emoji.find(emoji => emoji.name ==='❓')){
                optionsDesc.push(`❓ - Ask to Join (Type \`${client.config.prefix}ask\` to Request)`)
            }
            if(emoji.find(emoji => emoji.name === '📸')){
                optionsDesc.push(`📸 - Event (Used for Server/Member Events)`)
            }
            if(emoji.find(emoji => emoji.name === '🔪')){
                optionsDesc.push(`🔪 - Extreme (No Censorship in this VC, Extreme Kinks)`)
            }
            if(emoji.find(emoji => emoji.name === '🎵')){
                optionsDesc.push(`🎵 - Music (Use this Channel for Music Bot)`)
            }
            const doneembed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({name: `${customname}`, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setDescription(`This Voice Channel has the Following Options Enabled:\n${optionsDesc.join('\n\n')}`)
            .addFields({
                name: `__Owner__`, value: `${member}\n\n\`You can change ownership with ${client.config.prefix}giveowner @member\``
            })
            .setFooter({text: `${guild.name}`})
            .setTimestamp()

            
       
        const VCDB = new VCSchema({
            ownerId: member.id,
            guildId: guild.id,
            channelId: channel.id,
            channelName: customname,
            settings: emoji.join('-'),
            deputies: null,
            textChannelId: askchannel.id,
        })

        await VCDB.save();
        return askchannel.send({embeds: [doneembed]})
    })
}

async function deleteVC(channel, textchannel){
    const VC = await VCSchema.findOne({
        channelId: channel.id,
        textChannelId: textchannel.id
    })
    if(VC){
        if(channel.members.size === 0){
            channel.delete()
            textchannel.delete()
            await VCSchema.findOneAndDelete({
                channelId: channel.id,
                textChannelId: textchannel.id
            })
        }
    } else 
    return;
}

module.exports = {
    NewVc,
    deleteVC
}