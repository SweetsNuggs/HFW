const Event = require('../../Tools/Structures/Event')
const MessageSchema = require('../../Database/Models/SirMessages');
const MaleToSir = require('../../Database/Models/MaleToSir');


class GuildMemberRemove extends Event {
    constructor(...args){
        super(...args, {
            dirname: __dirname,
        });
    }
    async run(client, member){
        const guild = member.guild
        const Messages = await MessageSchema.findOne({
            guildId: guild.id,
            id: member.id
        })
        if(Messages){
           await Messages.delete()
        }
        const MaleSir = await MaleToSir.findOne({
            guildId: guild.id
        })
        if(MaleSir.members.includes(member.id)){
            const male = MaleSir.members.find(r => r.id === member.id)
            MaleSir.members.splice(male, 1)
            await MaleSir.save() 
        }
        return
    }
}

module.exports = GuildMemberRemove