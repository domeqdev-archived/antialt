const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = (client, member) => {
    client.users.fetch(member.id);
    member.guild.members.fetch(member.id);

    if(member.user.bot) return;
    client.settings.ensure(member.guild.id + "c", {})
    client.settings.ensure(member.guild.id, {})
    
    const embed = new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }) || "", "https://antialt.xyz/").setFooter("© AntiAlt.xyz", client.user.displayAvatarURL({ dynamic: true })).setTimestamp();
    // AntiAlt 
    if(client.settings.get(member.guild.id, "status") === "on") {
        // Disable AntiAlt if days is not number
        if(isNaN(Number(client.settings.get(member.guild.id, "days")))) return client.settings.delete(member.guild.id)
        
        if(client.function.check(member, client.settings.get(member.guild.id, "days"))) {
            // ✅ START OF ANTIALT
            client.wl.ensure(member.guild.id, [])
            if(client.wl.get(member.guild.id).includes(member.id)) return member.send(client.config.alts.embedContent, embed.setColor("#D0FF00").setDescription(`Hey ${member}!\nYou're whitelisted, so you can join **${member.guild.name}** without any restricionts!`)).catch( () => {}) && member.roles.add(client.settings.get(member.guild.id, "vrole")).catch( () => {}) && client.wl.remove(member.guild.id, member.id)
            member.send(client.config.alts.embedContent, embed.setColor("#FF0000").setDescription(`Hey ${member}!\nYour account was flagged as alt. To join this server without any restrictions your account must has **${client.settings.get(member.guild.id, "days")} days**.`)).catch( () => {}) && member.roles.add(client.settings.get(member.guild.id + "c", "c_vrole")).catch(() => {});
            setTimeout(() => {
                if(client.settings.get(member.guild.id, "action") === "ban") {
                    member.ban().catch( () => {});
                } else if(client.settings.get(member.guild.id, "action") === "kick") {
                    member.kick().catch(() => {})
                } else if(client.settings.get(member.guild.id, "action") === "role") {
                    member.roles.add(client.settings.get(member.guild.id, "arole")).catch( () => {});
                }
            }, 1000)

            client.stats("alt")
     
            if(client.channels.cache.get(client.settings.get(member.guild.id, "logs"))) {
                client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send("<:enter:749941516709003284> **New Alt Caught**", new MessageEmbed().setAuthor(`${member.user.tag} [${member.user.id}]`, member.user.displayAvatarURL({ dynamic: true })).setColor("#FF0000").setDescription(`<:dot:738030536785657917> **Account created:** __${ms(Date.now()-client.users.cache.get(member.user.id).createdTimestamp, { long: true })}__ ago`).setTimestamp()).catch( () => {})
            }
            // ❌ END OF ANTIALT 
            return;
        } else {
            client.stats("normal")
            if(client.settings.get(member.guild.id + "c", "c_status") !== "on") return member.send(client.config.alts.embedContent, embed.setColor("#00ff00").setDescription(`Hey ${member}!\nYour account has more than **${client.settings.get(member.guild.id, "days")} days**, and you can join **${member.guild.name}** without any restrictions.`)).catch( () => {}) && member.roles.add(client.settings.get(member.guild.id, "vrole")).catch( () => {})
        }
    } 

    // Captcha
    if(client.settings.get(member.guild.id + "c", "c_status") === "on") {
        client.stats("captcha_sent")
        member.send(new MessageEmbed().setColor("#FFFC00").setDescription(`**Hello ${member.user.username}**,\nWelcome to **${member.guild.name}**! This server is protected by AntiAlt. To verify your account, please visit https://antialt.xyz/verify/${member.guild.id}.`)).catch( () => {})
        member.roles.add(client.settings.get(member.guild.id + "c", "c_arole")).catch(() => {})
    }
}