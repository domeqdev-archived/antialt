const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'check',
    description: 'Check if user is not alt.',
    usage: '< @mention | id >',
    category: "antialt",
	execute(client, message, args) {
        if(client.settings.get(message.guild.id, "status") !== "on") return message.channel.send(`${client.config.emoji.error} AntiAlt is disabled on this server. Ask admin for help.`)
       
        let infoMem;
        if(message.mentions.members.first()) {
            infoMem = client.users.cache.get(message.mentions.members.first().id)
        } else if(args[0]) {
            infoMem = client.users.cache.get(args[0])
        } else {
            return message.channel.send(`${client.config.emoji.error} Invalid command usage! Try: \`${client.config.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        if(!infoMem || infoMem.bot || !message.guild.member(infoMem.id)) return message.channel.send(`${client.config.emoji.error} This __member__ doesn't exist. Try in few seconds... (this can be cache problem)`) && message.guild.members.fetch(client.function.mention(args[0]));
    
        
        if(client.function.check(infoMem, client.settings.get(message.guild.id, "days"))) {
            
            client.wl.ensure(message.guild.id, [])
            if(client.wl.get(message.guild.id).includes(infoMem.id)) return;
            infoMem.send(client.config.alts.embedContent, new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }) || "", "https://antialt.xyz/").setFooter("© AntiAlt.xyz", client.user.displayAvatarURL({ dynamic: true })).setTimestamp().setColor("#FF0000").setDescription(`Hey ${infoMem}!\nYour account was flagged as alt. To join this server without any restrictions your account must has **${client.settings.get(message.guild.id, "days")} days**.`)).catch( () => {})
            
            if(client.settings.get(message.guild.id, "action") === "ban") {
                message.guild.member(infoMem).ban().catch( () => {});
            } else if(client.settings.get(message.guild.id, "action") === "kick") {
                message.guild.member(infoMem).kick().catch( () => {});
            } else if(client.settings.get(message.guild.id, "action") === "role") {
                message.guild.member(infoMem).roles.add(client.settings.get(message.guild.id, "arole")).catch( () => {});
            }
     
            if(client.channels.cache.get(client.settings.get(message.guild.id, "logs"))) {
                client.channels.cache.get(client.settings.get(message.guild.id, "logs")).send("<:ShinyHunter:755082819369173052> **New Alt Caught**", new MessageEmbed().setAuthor(`${infoMem.tag} [${infoMem.id}]`, infoMem.displayAvatarURL({ dynamic: true })).setColor("#FF0000").setDescription(`<:dot:738030536785657917> **Account was created** __${ms(message.guild.member(infoMem.id).joinedTimestamp - infoMem.createdTimestamp, {long:true})}__ before joining to server.\n<:dot:738030536785657917> Alt catched by ${message.author}`).setTimestamp()).catch( () => {})
            }
            // ❌ END OF ANTIALT 
            message.react(client.config.emoji.yes);
        } else message.react(client.config.emoji.no);
        message.reply(":x: meaning that is normal user.").then(msg => msg.delete({ timeout: 2000 }))
    
    }};