const { handle } = require("blapi")
const { WebhookClient } = require('discord.js')
module.exports = (client) => {

require("../dashboard.js")(client)

client.user.setActivity('📲 Bot was restarted.')
setTimeout(() => {
    setInterval(function(){ 
        client.user.setActivity(`${client.config.prefix}help | AntiAlt.xyz`, { type: 'LISTENING' });
        setTimeout(function(){ 
            client.user.setActivity(`${client.config.prefix}help | Servers: ${client.guilds.cache.size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} `, { type: 'WATCHING' });
        }, 10000);
    }, 20000);
}, 20000)


if(client.user.id == "715619574778822667") {
    handle(client, client.config.apiKeys, 5);
    client.dbl.webhook.on('vote', vote => {
        var number = Math.floor(Math.random() * 6) + 1
        if(number == 1) var emoji = "<a:twitch6:769863948815564831>"
        if(number == 2) var emoji = "<a:twitch5:769863944578924555>"
        if(number == 3) var emoji = "<a:twitch4:769863916083085322>"
        if(number == 4) var emoji = "<a:twitch3:769863920864854047>"
        if(number == 5) var emoji = "<a:twitch2:769863937574961174>"
        if(number == 6) var emoji = "<a:twitch1:769863925172797441>"
        let votes = client.settings.get("votes", vote.user)
        if(!votes || isNaN(Number(votes))) {
            if(vote.isWeekend) votes = 2
            else votes = 1
            client.settings.set("votes", votes, vote.user)
        } else {
            if(vote.isWeekend) votes = Number(votes) + 2
            else votes = Number(votes) + 1
            client.settings.set("votes", votes, vote.user)
            votes = Number(votes) + 1
        }
        if(client.users.cache.get(vote.user)) var user = `<@${vote.user}> (**\`${client.users.cache.get(vote.user).tag}\`**)`
        else var user = `<@${vote.user}>`
        if(vote.isWeekend) {
            new WebhookClient('773232242808979516', 'zDWXnBRip4mPXTkrprImgVRv19K7VvzUSBvgflcsVN-xzn14SfCkL0xr1Vfkvdf9JsIV').send(`${emoji} ${user} just **voted** for AntiAlt on **[top.gg](<https://top.gg/bot/715619574778822667/vote>)**! (**${Number(votes)}** votes) :star:`, {
                username: '⭐ Votes (Multiplier x2)'
            })
        } else {
            new WebhookClient('773232242808979516', 'zDWXnBRip4mPXTkrprImgVRv19K7VvzUSBvgflcsVN-xzn14SfCkL0xr1Vfkvdf9JsIV').send(`${emoji} ${user} just **voted** for AntiAlt on **[top.gg](<https://top.gg/bot/715619574778822667/vote>)**! (**${Number(votes)}** votes)`)
        }
        nadaj("773472980562214923", vote.user);
        if(votes >= 2) nadaj("773543541741846528", vote.user)
        if(votes >= 3) nadaj("773543542291169290", vote.user)
        if(votes >= 5) nadaj("773543543041163307", vote.user)
        if(votes >= 7) nadaj("773543543851319326", vote.user)
        if(votes >= 10) nadaj("773543544764891146", vote.user)
        if(votes >= 15) nadaj("773543547009105940", vote.user)
        if(votes >= 20) nadaj("773543547692515338", vote.user)
        if(votes >= 30) nadaj("773543548153888769", vote.user)    
        
		if(votes < 2) usun("773543541741846528", vote.user)
        if(votes < 3) usun("773543542291169290", vote.user)
        if(votes < 5) usun("773543543041163307", vote.user)
        if(votes < 7) usun("773543543851319326", vote.user)
        if(votes < 10) usun("773543544764891146", vote.user)
        if(votes < 15) usun("773543547009105940", vote.user)
        if(votes < 20) usun("773543547692515338", vote.user)
        if(votes < 30) usun("773543548153888769", vote.user)

        function nadaj(rola, user) {
            if(!client.guilds.cache.get("718492945510039622").members.cache.get(user)) return;
            client.guilds.cache.get("718492945510039622").members.cache.get(user).roles.add(rola)
        }

        function usun(rola, user) {
            if(!client.guilds.cache.get("718492945510039622").members.cache.get(user)) return;
            client.guilds.cache.get("718492945510039622").members.cache.get(user).roles.remove(rola)
        }
    });
}




console.log(`-  Logged in as ${client.user.tag}`);
};