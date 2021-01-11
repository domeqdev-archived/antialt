const { MessageEmbed } = require("discord.js");


module.exports = (client, guild) => {
    client.users.cache.get(guild.ownerID).send(new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }), "https://antialt.xyz/")
    .setColor("RANDOM")
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Hi! Thank you for adding me to **${guild.name}**! Some tips for start:\n:one: Move **AntiAlt.xyz** role to highest place.\n:two: Setup bot using [dashboard](https://antialt.xyz/dashboard).\n:three: If you need help join [Support Server](https://discord.gg/8jQP52j).`)
    ).catch( () => {})
}
