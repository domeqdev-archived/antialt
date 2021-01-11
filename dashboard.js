const path = require("path");
const Discord = require("discord.js");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const Strategy = require("passport-discord").Strategy;
const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios').default;

module.exports = (client) => {
  // ====================================
  // =            MODULES               =
  // ====================================

  app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => done(null, obj));
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? client.users.cache.get(req.user.id) : null
    };
    if(!baseData.user && req.isAuthenticated()) {
      client.users.fetch(req.user.id) && res.write("UPS! You're not cached user. Refresh page.")
    } else { 
      res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    }
  };

  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: client.config.dashboard.secret,
    callbackURL: client.config.dashboard.callback,
    scope: ["identify", "guilds.join", "email"]
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.use(session({ store: new SQLiteStore({ dir: "./data" }), secret: "jehuwa98!", resave: false, saveUninitialized: false }));
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require("body-parser").json());       
  app.use(require("body-parser").urlencoded({ extended: true })); 

  // ====================================
  // =           General Sites          =
  // ====================================

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs", { err: null });
  });

  app.get("/login", (req, res, next) => {
    next();
  },
  passport.authenticate("discord"));

  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/dashboard");
    }    
  });
  
  app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  // ====================================
  // =         Dashboard Sites          =
  // ====================================

  // Verification
  app.get("/verify/:guildID", checkAuth, (req, res) => {
    let err;
    const guild = client.guilds.cache.get(req.params.guildID);
    
    var style = "style='color: red;'"
    var status = "Error!"

    if(!guild) {
      err = "This guild doesn't exist."
    } else if(!guild.member(req.user.id)) {
      err = "You're not member of this guild."
    } else if(client.settings.get(guild.id + "c", "c_status") !== "on") {
      err = "This guild doesn't have verification enabled."
    } else if(!guild.roles.cache.has(client.settings.get(guild.id + "c", "c_vrole")) && client.settings.get(guild.id + "c", "c_vrole") !== "-") {
      err = "Verified Role was deleted, ask admin for help."
      client.settings.delete(guild.id + "c")
    } else if(!guild.roles.cache.has(client.settings.get(guild.id + "c", "c_arole")) && client.settings.get(guild.id + "c", "c_arole") !== "-") {
      err = "Unverified Role was deleted, ask admin for help."
      client.settings.delete(guild.id + "c")
    } else if(guild.member(req.user.id).roles.cache.has(client.settings.get(guild.id + "c", "c_vrole")) &&  !guild.member(req.user.id).roles.cache.has(client.settings.get(guild.id + "c", "c_arole"))) {
      err = "You're already verified."
    } else if(!req.user.verified) {
      err = "Please verify your email."
    } else {
      if(client.settings.get(guild.id + "c", "c_rules")) {
        style = "style='color: yellow;'"
        status = "Please read rules:"
      } else {
        style = "style='color: lightgreen;'"
        status = "👋 Welcome"
        err = ""
      }
    }
    renderTemplate(res, req, "verify.ejs", {guild, style, status, text: err});
  });

  app.post("/verify/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    client.stats("captcha_verified")
      const member = guild.member(req.user.id)
      member.roles.add(client.settings.get(guild.id + "c", "c_vrole")).catch(() => {})
      member.roles.remove(client.settings.get(guild.id + "c", "c_arole")).catch(() => {})
      client.users.cache.get(req.user.id).send(client.config.alts.embedContent, new Discord.MessageEmbed().setColor("#00ff00").setDescription(`You have successfully verified your account. We hope you have a pleasant stay in **${guild.name}**!`)).catch(() => {})
    
  });

  // Select server
  app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "guild/dashboard.ejs");
  });

  // Overview
  app.get("/dashboard/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    renderTemplate(res, req, "guild/overview.ejs", {guild});
  });

  // AntiAlt settings
  app.get("/dashboard/:guildID/antialt", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    client.settings.ensure(guild.id, {});
    renderTemplate(res, req, "guild/antialt.ejs", {guild});
  });

  // Verification settings
  app.get("/dashboard/:guildID/captcha", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    client.settings.ensure(guild.id + "c", {});
    renderTemplate(res, req, "guild/captcha.ejs", {guild});
  });

  // Vanity link settings 
  app.get("/dashboard/:guildID/vanity", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    renderTemplate(res, req, "guild/vanity.ejs", {guild});
  });


  // Save server settings

  app.post("/dashboard/:guildID/captcha", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    client.settings.set(guild.id + "c", req.body);
  });

  app.post("/dashboard/:guildID/antialt", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    client.settings.set(guild.id, req.body);
  });

  app.post("/dashboard/:guildID/vanity", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    if(client.vanity.has(req.body.link) && client.vanity.get(req.body.link, id) !== guild.id) return;
    if(req.body.desc.length > 200) return;
    const data = {
      id: guild.id,
      color: req.body.color,
      desc: req.body.desc,
      vanity: req.body.link
    }
    client.vanity.set(req.body.link, data);
    client.settings.set(guild.id + "v", req.body.link)
  });

  app.post("/dashboard/:guildID/message", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    checkGuild(guild, req.user, res, req)
    client.channels.cache.get(req.body.channel).send(`${client.config.emoji.success} **Verification**`, new Discord.MessageEmbed().setColor("#00ff00").setDescription(`To verify, please visit [this link](https://antialt.xyz/verify/${guild.id}).`).setFooter("Verification by AntiAlt.xyz", client.user.displayAvatarURL({ dynamic: true }))).catch(() => {})
  });
  
  // checkAuth & checkGuild Settings
  function checkGuild(guild, user, res, req) {
    if (!guild) return renderTemplate(res, req, "index.ejs", { err: "This guild doesn't exist." });
    if(user.id !== client.config.ownerID) {
      const isManaged = guild && !!guild.member(user.id) ? guild.member(user.id).permissions.has("MANAGE_GUILD") : false;
    if (!isManaged) return renderTemplate(res, req, "index.ejs", { err: "This guild doesn't exist." });
    }
  }

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  // ====================================
  // =        Redirects & Errors        =
  // ====================================

  app.get("/invite", (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?permissions=8&redirect_uri=${client.config.dashboard.callback}&response_type=code&scope=identify%20email%20guilds.join%20bot&client_id=${client.user.id}`);
  });

  app.get("/support", (req, res) => {
    res.redirect("https://discord.gg/8jQP52j");
  });

  app.get("/donate", (req, res) => {
    res.redirect("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BUBQDUA88EZKN");
  });

  app.get("/vote", (req, res) => {
    res.redirect("https://top.gg/bot/715619574778822667/vote");
  });

  app.get("/docs", (req, res) => {
    res.redirect("https://docs.antialt.xyz/");
  });
    
  app.use(function (req, res, next) {
    res.redirect("/")
  })

  // ====================================
  // =         Server Launching         =
  // ====================================

  const httpServer = http.createServer(app);
  httpServer.listen(80, () => {
    console.log(`-  Port 80 (http) is ready!`);
  });


};