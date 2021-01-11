const { MessageEmbed, splitMessage } = require('discord.js');
const config = require('../../config.js');
const Emoji = require('../../functions.js');
const Image = require('../../functions.js');

module.exports = {
	name: 'emojicon',
    description: 'Give me an image to convert into emojis!',
    category: "4fun",
    cooldown: 25,
	execute: async(client, message, args) => {
        let voted = await client.dbl.hasVoted(message.author.id);
        if(!voted && message.author.id !== client.config.ownerID) return message.channel.send(`${client.config.emoji.error} This commands is for **voters only**. <https://antialt.xyz/vote>`);

        const helpMessage = new MessageEmbed()
        .setAuthor("EmojiCon", "https://i.imgur.com/YPonIfk.png", "https://antialt.xyz/")
        .setDescription("Give me an image to convert into emojis!")
        .addField("Examples", `${client.config.prefix}emojicon 🎃\n${client.config.prefix}emojicon <a:pet:766951425754005534> 30 30\n${client.config.prefix}emojicon https://antialt.xyz/public/logo.png 15`)
        .addField("Usage", `\`${client.config.prefix}emojicon < emoji / link / message attachment > [ width ] [ height ]\``)
        .setColor("#65EDE8")

        if (message.channel.lock) return;
        if(!args[0] && !message.attachments.first()) return message.channel.send(helpMessage)

            let url, w, h;
            let large = true;
        
            const attachment = message.attachments.first();
        
            if (attachment) {
                url = attachment.url;
            } else if (args.length > 0) {
                const string = args.shift();
                if (string.match(/^<?https?:/)) {
                    url = string.replace(/^(<)|(>)$/g, '');
                } else {
                    const emoji = Emoji.parse(string);
                    if (emoji) {
                        url = emoji.imageUrl;
                        large = false;
                    } else {
                        return message.channel.send(helpMessage);
                    }
                }
            } else {
                return message.channel.send(helpMessage);
            }
        
            w = parseInt(args.shift());
            h = parseInt(args.shift());
        
            // Check size arguments
            if (w > 50) return message.channel.send(`${client.config.emoji.error} **Too large!** (width ≤ 50)`);
            else if (h > 200) return message.channel.send(`${client.config.emoji.error} **Too tall!** (height ≤ 50)`);
        
            // Set default values
            w = (!w || w < 1) ? (large ? 25 : 18) : w;
            h = (!h || h < 1) ? Image.AUTO : h;
        
            // Image checks
            let image;
            let channel = message.channel;
            try {
        
                // Open the image and resize it
                image = await Image.open(url, w, h);
        
                // Check if height limit is exceeded after resizing
                if (image.bitmap.height > 200) return channel.send(`${client.config.emoji.error} **Too tall!**`);
        
                // Check if response should be sent in private
                if (w > 30 || image.bitmap.height > 50) {
                    channel.send('<:WindowsWarning:747118921987129435> Big one! Sending it directly to you...');
                    channel = message.author;
                }
        
                // Lock the channel to block incoming requests
                channel.lock = true;
        
            } catch (e) {
                if (e.message === 'Could not find MIME for Buffer <null>') {
                    return channel.send(`${client.config.emoji.error} This file type is not suppported.`);
                } else {
                    return channel.send(`${client.config.emoji.error} Unknow error has occured.`) && console.error(e);
                }
            }
        
            /**
             * @see emojis.json
             */
            let res = '';
            let trailingBlanks = new RegExp(`(${Emoji.BLANK})+$`, 'g');
            for (let y = 0; y < image.bitmap.height; ++y) {
                for (let x = 0; x < image.bitmap.width; ++x) {
                    let color = Image.toRGBA(image.getPixelColor(x, y));
                    res += Emoji.closest(color);
                }
                res = res.replace(trailingBlanks, '') + '\u200B\n';
            }
        
            // Send the messages without getting rate-limited
            try {
                const batches = splitMessage(res, {maxLength: 2000});
                if (batches.length < 5) {
                    await channel.send(res, {split: {char: '\n', maxLength: 2000}});
                } else {
                    for (const batch of batches) {
                        await channel.send(batch);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            } catch (e) {
                if (e.code === 50007) {
                    return channel.send(`${client.config.emoji.error} Please allow direct messages from server members.`);
                } else {
                    return channel.send(`${client.config.emoji.error} Unknow error has occured.`) && console.error(e);
                }
            }
        
            channel.lock = false;
                
        
    }};