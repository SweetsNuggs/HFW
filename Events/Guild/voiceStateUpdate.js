const {ChannelType} = require('discord.js');
const Event = require('../../Tools/Structures/Event')
const {NewVc, deleteVC} = require('../../Tools/Utils/VCUtils')

class VoiceStateUpdate extends Event {
    constructor(...args){
        super(...args, {
            dirname: __dirname,
        });
    }

    async run(client, oldState, newState){
        const newMember = newState.member 
        const createchannel = newState.guild.channels.cache.find((x) => x.name === 'Join to Create')
        const guild = newState.guild
        if(newState.channelId === createchannel.id){
            NewVc(client, createchannel, newMember)
        }
        if(oldState.channelId !== null){
            const textchannel = await guild.channels.cache.find(x => x.name === oldState.channel.name && x.type === ChannelType.GuildText)
            const channel = guild.channels.cache.get(oldState.channel?.id ?? oldState.channelId)
            deleteVC(channel, textchannel)
        }
    }
}

module.exports = VoiceStateUpdate