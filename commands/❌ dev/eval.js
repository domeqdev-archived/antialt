const { inspect } = require("util");
const hastebin = require("hastebin-gen");
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'eval',
    description: 'Evalue code in discord.js *v12*',
    usage: '< code >',
    permissions: "developer",
	  execute(client, message, args) {
        if (message.author.id !== client.config.ownerID) return message.channel.send(`${client.config.emoji.error} You must have \`${module.exports.permissions}\` permission in order to use this command.`);
        if(!args[0]) return message.channel.send(`${client.config.emoji.error} Invalid command usage! Try: \`${client.config.prefix}${module.exports.name} ${module.exports.usage}\``);
          try {
            const code = args.join(" ");
            let evaled = eval(code);
           
                if (typeof evaled !== "string")
                  evaled = inspect(evaled);
                  if (evaled.includes(client.token)) return message.reply("ehh");
           
                    if(evaled.length.toString() >= 1950) {
                      return hastebin(evaled).then(link => {
                        message.channel.send(`${client.config.emoji.error} Result has more than 1950 characters. ${link}`);
                    }).catch(error => {
                      message.channel.send(`${client.config.emoji.error} ERR: \`${error.message}\``);
                    });
                    } 

                message.channel.send(`\`\`\`js\n${evaled.toString()}\n\`\`\``);
              } catch (err) {
                message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
              }
         }
    };