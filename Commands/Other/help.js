const {EmbedBuilder} = require('discord.js')

module.exports = {
    name: "help",
    usage: ["Get a list of the currently available commands ```{prefix}help```", "Get information about a specific command```{prefix}help <command>```"],
    enabled: true,
    aliases: [],
    category: "Other",
    memberPermissions: [],
    botPermissions: [ "SendMessages", "EmbedLinks" ],
    //Settings for command
    nsfw: false,
    cooldown: 20,

    // Execute contains content for the command
    async execute(client, message, args, data){
        try{
            let cmd = args[0] ? (await client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()))) : null;
            if(cmd){
                let aliaseList = (cmd.aliases.length < 1) ? "None" : cmd.aliases.join("\n")
                let cmdnsfw = (!cmd.nsfw) ? 'False' : 'True'

                const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle(`${cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)} Command`)
                .setAuthor({name: `${client.user.username}'s Help Menu`, iconURL: message.client.user.displayAvatarURL({dynamic: true})})
                .setDescription(`*__Please Note:__\n<> = required arguments.\n[] = optional arguments*`)
                .addFields(
                    {name: `__Aliases__`, value: `${aliaseList}`},
                    {name: `__NSFW__`, value: `${cmdnsfw}`, inline: false},
                    {name: `__Cooldown__`, value: `${cmd.cooldown / 1000} seconds`},
                    {name: `__Usage__`, value: `${cmd.usage.map(x => x.replace(/{prefix}/g, data.guild.prefix)).join("\n")}`}
                )
                .setFooter({text: `${message.guild.name}`})
                .setTimestamp()

                return message.channel.send({embeds: [embed]})
            }
            let categories = await client.commands.map(x => x.category).filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            });
            let cmdArr = []
            for(let i=0; i < categories.length; i++){
                let category = categories[i];
                let commands = await client.commands.filter(x => x.category === category).map(x => x.name);
                let cmdText = commands.length < 1 ? "None" : commands.join(", ");
                let obj = {
                    name: `__${category}__`,
                    value: `\`\`\`${cmdText}\`\`\``
                }
                cmdArr.push(obj);
            }
            const embed = new EmbedBuilder()
            .setAuthor({name: `${client.user.username}'s Help Menu`, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setColor(client.config.color)
            .setDescription(`Type \`${data.guild.prefix}help [command]\` for more help.\n For example, ${data.guild.prefix}help configuration.\n`)
            .addFields(cmdArr)
            .setFooter({text: `${message.guild.name}`})

            return message.channel.send({embeds: [embed]})
        }catch(err){
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            return client.embed.send(message, {
                description: `An issue has occured while running the command. If this error keeps occuring please contact our development team.`,
                color: `RED`,
                author: {
                    name: `Uh Oh!`,
                    icon_url: `${message.author.displayAvatarURL()}`,
                    url: "",
                }
            });
        }
    }
}