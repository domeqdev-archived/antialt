const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "All bot commands, important links and informations!",
    category: "bot",
    usage: "[ command ]",
    execute(client, message, args) {
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }), "https://antialt.xyz/")
            .setColor("RANDOM")

        if(args[0]) {
            const cmd = client.commands.get(args[0].toLowerCase());
            if(!cmd) return message.channel.send(`${client.config.emoji.error} This command doesn't exist.`)

            let info = "";
            if (cmd.name) embed.setAuthor(client.config.prefix + cmd.name, "https://cdn.discordapp.com/emojis/758361515321065552.png?v=1");
            if (cmd.description) info += `\n**${cmd.description}**\n`;
            if (cmd.permissions) info += `\n> Required Permissions: \`${cmd.permissions}\``;
            if (cmd.usage) {
                info += `\n> Usage: \`${client.config.prefix}${cmd.name} ${cmd.usage}\``;
                embed.setFooter(`Syntax: <> = required, [] = optional`);
            }

            embed.setDescription(info)
        } else {
            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            embed.setDescription("**<:Settings:755082860167168211> [Dashboard](https://antialt.xyz/dashboard) | <:ShinyHunter:755082819369173052> [Invite Bot](https://antialt.xyz/invite) | <:Members:755083031886299227> [Support Server](https://discord.gg/8jQP52j) | <a:twitch5:769863944578924555> [Vote](https://top.gg/bot/715619574778822667/vote)**\n\n** **")
            embed.setFooter(`Use ${client.config.prefix}help < command > for command info.`, "https://cdn.discordapp.com/emojis/758361515321065552.png?v=1")
            embed.addField(`<:PES_TechSupport:769628600361680896> **Bot**`, getCommands(client, "bot"))
            embed.addField(`<a:aPES_YouSerious:769628596171833384> **AntiAlt**`, getCommands(client, "antialt"))
            embed.addField(`<:PES_Clown:769628591368568902> **4FUN**`, getCommands(client, "4fun"))
            if(client.settings.get("global")) embed.addField(`<:announcement:728160427082514433> **Global Announcement**`, client.settings.get("global"))
        }     
        message.channel.send(embed)    
            function getCommands(client, category) {
                var commands = client.commands
                    .filter(cmd => cmd.category === category && !cmd.hide)
                    .map(cmd => `\`${client.config.prefix + cmd.name}\``)
                    .join(" | ");
                if(!commands) commands = "-"
                return commands;
            }

    }};