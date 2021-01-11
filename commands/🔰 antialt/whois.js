const moment = require('moment');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'whois',
    description: 'Show when user create account.',
    usage: '[ @mention | id ]',
    category: "antialt",
	execute(client, message, args) {
        let infoMem;
        if(message.mentions.members.first()) {
            infoMem = client.users.cache.get(message.mentions.members.first().id)
        } else if(args[0]) {
            infoMem = client.users.cache.get(args[0])
        } else {
            infoMem = client.users.cache.get(message.author.id)
        }

        if(!infoMem) return message.channel.send(`${client.config.emoji.error} This user doesn't exist. Try in few seconds (this can be cache problem)`) && client.users.fetch(client.function.mention(args[0]))
        
        if(infoMem.bot) {
            var bot = "<:bot:760564160672694303>"
        } else {
            var bot = ""
        }

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(infoMem.displayAvatarURL({ dynamic: true }))
        .setAuthor(`${infoMem.tag}`, infoMem.displayAvatarURL({ dynamic: true }))
        .setDescription(`${infoMem} ${bot}`)
        .addField("User ID", infoMem.id)
        .addField("Joined Discord", `${moment(infoMem.createdAt).format("MMM Do, YYYY")} (${ms(Date.now()-infoMem.createdTimestamp, {long:true})} ago)`)
        
        if(message.guild.member(infoMem.id)) {
            embed.addField("Joined Server", `${moment(infoMem.joinedAt).format("MMM Do, YYYY")} (${ms(Date.now()-message.guild.member(infoMem.id).joinedTimestamp, {long:true})} ago)`)
            embed.addField("Highest Role", `<@&${message.guild.member(infoMem.id).roles.highest.id}>`)
        }

        message.channel.send(embed)
    
    }};