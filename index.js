  const Discord = require('discord.js');
  const fs = require("fs");
  const Enmap = require("enmap");
  const DBL = require('dblapi.js');
 
  const client = new Discord.Client();
  client.dbl = new DBL("", { webhookPort: 5000, webhookAuth: '' });
  client.function = require("./functions.js")
  client.config = require("./config.js")
  client.settings = new Enmap({ name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true });
  client.wl = new Enmap({ name: "wl", cloneLevel: "deep", fetchAll: true, autoFetch: true });
  client.vanity = new Enmap({ name: "vanity", cloneLevel: "deep", fetchAll: true, autoFetch: true });
  client.commands = new Enmap();

  fs.readdirSync("./commands/").forEach(dir => {
    const commands = fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

    commands.forEach(file => {
      let pull = require(`./commands/${dir}/${file}`);
        if (pull.name) {
          client.commands.set(pull.name, pull)
        } else {
          console.log(`Command ${file} can't be loaded.`)
        }
    });
  });

  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });

  client.stat = new Enmap({ name: "stats", cloneLevel: "deep", fetchAll: true, autoFetch: true });
  client.stats = (type) => {
    var s = client.stat.get(type)
    if(!s || isNaN(s)) return client.stat.set(type, 1)
    client.stat.set(type, s + 1)
  };


  client.login(client.config.token);
