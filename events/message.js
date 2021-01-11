module.exports = (client, message) => {
    if (message.author.bot || !message.guild) return;
    if(!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    if (message.content.startsWith('<@') && message.content.endsWith('>') && message.mentions.has(client.user, { ignoreRoles: true, ignoreEveryone: true })) message.channel.send(`Hi! My command prefix is \` ${client.config.prefix} \`\nTo get started type \` ${client.config.prefix}help \``);

	if (!message.content.startsWith(client.config.prefix)) return;

	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

	if (client.commands.has(command.toLowerCase())) {
        var cmd = client.commands.get(command.toLowerCase())
            if(cmd.cooldown) {
                if (message.author.cooldown > Date.now()) {
                    const seconds = Math.ceil((message.author.cooldown - Date.now()) / 1000);
                    return message.channel.send(`${client.config.emoji.error} **STOP!** You're on ${seconds} seconds cooldown.`);
                } else {
                    message.author.cooldown = Date.now() + cmd.cooldown * 1000;
                }
            }
        try {
            cmd.execute(client, message, args);
            client.stats("command")

        } catch (error) {
            message.channel.send(`${client.config.emoji.error} Something goes wrong... (\`${error.message}\`)`)
        }
    } 

};