module.exports = {
    name: 'prefix',
    usage: ['Change the prefix', '```{prefix}prefix <new prefix>```'],
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
            } else return client.embed.usage(message, data)
        }
        let prefix = args.join(" ")
        data.guild.prefix = prefix
        await data.guild.save();
        message.guild.prefix = prefix.toLowerCase();
        return message.channel.send(`Prefix has been updated to \`${prefix}\``)
    }
}