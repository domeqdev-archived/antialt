const { MessageEmbed } = require('discord.js')
let os = require('os');

module.exports = {
	name: 'stats',
    description: 'Check how many servers or users have bot',
    category: 'bot',
	execute(client, message, args) {
        let shards;
        client.ws.shards.forEach(shard => {
            if(shard.ping <= 200) {
                var znak = `+`
            } else {
                var znak = `-`
            }
            if(message.guild.shardID == shard.id) var ye = ` (This guild)`
            shards += `${znak}  Shard ${shard.id} : ${shard.ping}ms${ye || ``}\n`;
        })
        var uptime = process.uptime();
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        if(days != 0) {
            var uptime = `${days} days`
        } else if(hours != 0) {
            var uptime = `${hours} hours`
        } else if(minutes != 0) {
            var uptime = `${minutes} minutes`
        } else if(seconds != 0) {
            var uptime = `${seconds} seconds`
        } else {
            var uptime = "0 seconds"
        }
        message.channel.send(new MessageEmbed()
        .setAuthor(client.user.username + ` - Stats`, client.user.displayAvatarURL({ dynamic: true }), `https://antialt.xyz/`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`RANDOM`)
        .setDescription(`<:dot:738030536785657917> **Latency:** ${Math.floor(client.ws.ping)}ms
        <:dot:738030536785657917> **Uptime:** ${uptime}
        <:dot:738030536785657917> **RAM Usage:** ${Math.floor(os.freemem() / os.totalmem() * 100) + "%"}
        
        <:dot2:768901865097396294> **Servers:** ${client.guilds.cache.size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`)}
        <:dot2:768901865097396294> **Users:** ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`)}
        <:dot2:768901865097396294> **Channels:** ${client.channels.cache.size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`)}
       
        <:dot:738030536785657917> **Commands Used:** ${client.stat.get('command').toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`)}
        <:dot:738030536785657917> **Catched Alts:** ${client.stat.get('alt').toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`)}
        
        ** **`)
        .addField('<:dot2:768901865097396294> Sharding', "```diff\n" + shards.replace(`undefined`, ``) + "```")
        );
    }};