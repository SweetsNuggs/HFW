const userSchema = require('./Schemas/User')
const guildSchema = require('./Schemas/Guild')
const memberSchema = require('./Schemas/Member')
const logSchema = require('./Schemas/Log')

module.exports.fetchUser = async function(key){
    let userDB = await userSchema.findOne({id: key});
    if(userDB){
        return userDB;
    } else {
        userDB = new userSchema({
            id: key,
            registeredAt: Date.now()
        })
        await userDB.save().catch(err => console.log(err));
        return userDB;
    }
};

module.exports.fetchGuild = async function(key){
    let guildDB = await guildSchema.findOne({id: key});
    if(guildDB){
        return guildDB;
    } else {
        guildDB = new guildSchema({
            id: key, 
            registeredAt: Date.now()
        })
        await guildDB.save().catch(err => console.log(err));
        return guildDB;
    }
};

module.exports.fetchMember = async function(userID, guildId){
    let memberDB = await memberSchema.findOne({id: userID, guildId: guildId});
    if(memberDB){
        return memberDB
    } else {
        memberDB = new memberSchema({
            id: userID,
            guildId: guildId,
            registeredAt: Date.now()
        })
        await memberDB.save().catch(err => console.log(err));
        return memberDB;
    }
}

module.exports.createLog = async function(message, data){
    let logDB = new logSchema({
        commandName: data.cmd.name,
        author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
        guild: { name: message.guild ? message.guild.name : "dm", id: message.guild ? message.guild.id : "dm", channel: message.channel ? message.channel.id : "unknown" },
        date: Date.now()
    });
    await logDB.save().catch(err => console.log(err));
    return;
}