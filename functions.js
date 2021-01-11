module.exports.mention = function(mention) {
        if (!mention) return false;

	    if (mention.startsWith('<@') && mention.endsWith('>')) {
		    mention = mention.slice(2, -1);

		    if (mention.startsWith('!')) {
			    mention = mention.slice(1);
		    }

		    return mention;
	    } else if(!isNaN(mention)) {
			return mention;
		} else {
			return false;
		}    
};


module.exports.check = function(user, days) {
    if(!user || !days) return false;

    var joined = user.joinedTimestamp
    var created = user.user.createdTimestamp

    var time = Math.floor(Math.abs(created - joined) / 1000 / 86400)


    if(time < Number(days)) return true;
    else return false;
};

const Jimp = require('jimp');

/**
 * Signifies an automatic width or
 * height value when resizing an image.
 */
module.exports.AUTO = Jimp.AUTO;

/**
 * Opens an image from an URL,
 * resizes it and returns it.
 *
 * @param {String} url
 * @param {Number} w
 * @param {Number} h
 */
module.exports.open = async function (url, w, h) {
    return (await Jimp.read(url)).resize(w, h);
};

/**
 * Converts an integer color into
 * an RGBA color object.
 *
 * @param {Number} color
 */
module.exports.toRGBA = function (color) {
    return Jimp.intToRGBA(color);
};

/**
 * Computes the average pixel color of an
 * image from an URL and returns it.
 *
 * @param {String} url
 */
module.exports.averageColor = async function (url) {
    const image = await module.exports.open(url, 1, 1);
    const pixel = module.exports.toRGBA(image.getPixelColor(0, 0));
    const alpha = pixel.a / 255;
    return {
        r: Math.round(pixel.r * alpha + 54 * (1 - alpha)),
        g: Math.round(pixel.g * alpha + 57 * (1 - alpha)),
        b: Math.round(pixel.b * alpha + 63 * (1 - alpha))
    };
};

// List of default emojis
module.exports.list = require('./emojis.json');

// The default emoji for
// transparent backgrounds.
module.exports.BLANK = '<:transparent:770309180309110834>';

/**
 * Find one emoji that matches
 * the given parameters.
 *
 * @param {object} params
 */
module.exports.findOne = function (params) {
    const entries = Object.entries(params);
    for (const emoji of module.exports.list) {
        for (const entry of entries) {
            if (emoji[entry[0]] !== entry[1]) {
                break;
            }
            return emoji;
        }
    }
    return null;
};

/**
 * Find all emojis that match
 * the given parameters.
 *
 * @param {object} params
 */
module.exports.findAll = function (params) {
    const entries = Object.entries(params);
    const result = [];
    for (const emoji of module.exports.list) {
        for (const entry of entries) {
            if (emoji[entry[0]] !== entry[1]) {
                break;
            }
            result.push(emoji);
        }
    }
    return result;
};

/**
 * Parses a given string into a
 * default or guild emoji.
 *
 * @param {String} text
 */
module.exports.parse = function (text) {
    const match = text.match(/(?:<(a)?:)?([\w_]{2,32}):(\d+)>?/);
    if (match) {
        let emoji = {};
        emoji.animated = Boolean(match[1]);
        emoji.name = match[2];
        emoji.id = match[3];
        emoji.imageUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.png`;
        return emoji;
    }
    return module.exports.findOne({surrogates: text});
};

/**
 * Given an RGB(A) color, find the emoji with the closest
 * average color and return its identifier.
 *
 * @param {object} color
 */
module.exports.closest = function (color) {
    if (!color.a) return module.exports.BLANK;
    const opacity = color.a / 255;
    const target = {
        r: Math.round(color.r * opacity + 54 * (1 - opacity)),
        g: Math.round(color.g * opacity + 57 * (1 - opacity)),
        b: Math.round(color.b * opacity + 63 * (1 - opacity))
    };
    let result;
    let distance;
    let minimum = Infinity;
    for (const emoji of module.exports.list.filter(e => e.usable)) {
        distance = Math.sqrt(
            Math.pow(target.r - emoji.color.r, 2) +
            Math.pow(target.g - emoji.color.g, 2) +
            Math.pow(target.b - emoji.color.b, 2)
        );
        if (distance < minimum) {
            result = `:${emoji.names[0]}:`;
            minimum = distance;
        }
    }
    return result;
};