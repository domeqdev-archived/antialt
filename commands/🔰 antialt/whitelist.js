 module.exports = {
	name: 'whitelist',
    description: 'Bypass one member for fulling AntiAlt requirements!',
    usage: '< id >',
    permissions: "Ban Members",
    category: "antialt",
	execute(client, message, args) {
        if(message.author.id !== client.config.ownerID && !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`${client.config.emoji.error} You must have \`${module.exports.permissions}\` permission in order to use this command.`);
        if(!args[0]) return message.channel.send(`${client.config.emoji.error} Invalid command usage! Try: \`${client.config.prefix}${module.exports.name} ${module.exports.usage}\``);
        if(isNaN(Number(args[0])) || args[0].length != 18) return message.channel.send(`${client.config.emoji.error} Invalid command usage! You need to provide correct user ID. http://docs.antialt.xyz/guide/id`);

        if (!client.wl.has(message.guild.id)) client.wl.set(message.guild.id, [])
            
        client.wl.push(message.guild.id, args[0])
        message.react(client.config.emoji.yes).then(message.delete({ timeout: 3500 }))

    }};