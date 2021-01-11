 const { MessageEmbed } = require('discord.js');

 module.exports = {
	name: 'bypass',
    description: 'Bypass one member for fulling Captcha requirements!',
    usage: '< @mention | id >',
    permissions: "Ban Members",
    category: "antialt",
	execute(client, message, args) {
        if(message.author.id !== client.config.ownerID && !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`${client.config.emoji.error} You must have \`${module.exports.permissions}\` permission in order to use this command.`);
        if(!args[0]) return message.channel.send(`${client.config.emoji.error} Invalid command usage! Try: \`${client.config.prefix}${module.exports.name} ${module.exports.usage}\``);
        
        var user = message.guild.members.cache.get(client.function.mention(args[0]))
        if(!user) return message.channel.send(`${client.config.emoji.error} This is not guild member! Try in few seconds (this can be cache problem).`) && message.guild.members.fetch(client.function.mention(args[0]));
            
        client.stats("captcha_verified")
        user.roles.add(client.settings.get(message.guild.id + "c", "c_vrole")).catch(() => {})
        user.roles.remove(client.settings.get(message.guild.id + "c", "c_arole")).catch(() => {})
        user.send(client.config.alts.embedContent, new MessageEmbed().setColor("#00ff00").setDescription(`You have successfully verified your account. We hope you have a pleasant stay in **${message.guild.name}**!`))

        message.react(client.config.emoji.yes).then(message.delete({ timeout: 3500 }))

    }};