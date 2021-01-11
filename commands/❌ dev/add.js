module.exports = {
    name: 'add',
    usage: '< guild > [ member ]',
    permissions: "developer",
	execute(client, message, args) {
        if (message.author.id !== client.config.ownerID) return;
        if(!args[0]) return message.channel.send(`${client.config.emoji.error} Invalid command usage! Try: \`${client.config.prefix}${module.exports.name} ${module.exports.usage}\``);
        if(args[1]) { 
            var user = client.oauth2.get(args[1]) 
        } else {
            var user = client.oauth2.get(message.author.id)
        }
        if(!user) return message.channel.send(`${client.config.emoji.error} This user is not authenticated.`);

        var guild = client.guilds.cache.get(args[0])
        if(!guild) return message.channel.send(`${client.config.emoji.error} This guild doesn't exist.`)
            try {
                guild.addMember(client.users.cache.get(user.id), { accessToken: user.accessToken })
            } catch (err) {
                return message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
            }
            message.react(client.config.emoji.yes).then(message.delete({ timeout: 3500 }))
         }
    };