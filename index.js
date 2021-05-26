const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const config = require('./config.json');

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log('bot is ready !')
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("usage: `&ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("─── ★ ticket !")
            .setDescription("react 🍙 to open a ticket :D")
            .setFooter("Bot by Xolo.")
            
            .setColor("#2f3136")
        );

        sent.react('🍙');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("ticket system setup done !")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("oops, you cannot use that here !")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🍙') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("─── ★ massing .").setDescription("Please wait upto 30mins for our support team to answer!").setColor("#2f3136"))  
                                                                                                                                                  
        })
    }
});

client.on("ready", () => {
  console.log("Loaded up!");
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "help") {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle(`${client.user.username}'s commands`)
      .setDescription(`**Prefix:** ${config.prefix}`)
      .addField(`\`ping\``, `Check your bot's ping`)
      .addField(
        `\`kick\``,
        `Usage: **${config.prefix}kick [@User]**\n**${config.prefix}kick [@User][Reason]**`
      )
      .addField(
        `\`ban\``,
        `Usage: **${config.prefix}ban [@User]**\n**${config.prefix}ban [@User][Reason]**`
      )
      .addField(
        `\`add\``,
        `Adds a role to a user \nUsage: **${config.prefix}add [@User] [Role]**`
      )
      .addField(
        `\`remove\``,
        `Removes a role from a user \nUsage: **${config.prefix}remove [@User] [Role]**`
      )
      .addField(
        `\`purge\``,
        `Clears a number of messages between 2 or 100 \nUsage: **${config.prefix}purge [number]**`
      )
      .addField(`\`rps\``, `Play rock paper scissors`)
      .addField(`\`say\``, `Have the bot say something`)
      .addField(`\`ip\``, `Provides the ip of the server`)
    .addField(`\`mc-status\``, `Provides the current status of mc server which is manually updated by the developer and can be false`)
    .addField(`\`server-info\``, `Provides the name of the guild of the server`)
    .addField(`\`user-info\``, `Provides the information of the user`)
    .addField(`\`bot-info\``, `Provides the information of the developer and owner of bot`)
    .addField(`\`learn\``, `Provides the best website which can easily teaches all types of programming with the help of examples and explanation`)
    .addField(`\`java\``, `Provides the best online java compiler which can be used for java coding purpose`)
    message.channel.send(helpEmbed);
  }

  if (command === "ping") {
    const helpEmbed = new Discord.MessageEmbed()
    message.channel.send(
      `Pong **(${Date.now() - message.createdTimestamp}ms)**`
    );
  }

  if (command === "kick") {
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel
        .send("Insufficient permissions (Requires permission `Kick members`)")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    const member = message.mentions.members.first();
    if (!member)
      return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    if (!member.kickable)
      return message.channel.send("This user is unkickable").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const reason = args.slice(1).join(" ");
    if (member) {
      if (!reason)
        return member.kick().then(member => {
          message.channel.send(
            `${member.user.tag} was kicked, no reason was provided`
          );
        });

      if (reason)
        return member.kick().then(member => {
          message.channel.send(`${member.user.tag} was kicked for ${reason}`);
        });
    }
  }

  if (command === "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel
        .send("Insufficient permissions (Requires permission `Ban members`)")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    const member = message.mentions.members.first();
    if (!member)
      return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    if (!member.bannable)
      return message.channel.send("This user is unbannable").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const reason = args.slice(1).join(" ");
    if (member) {
      if (!reason)
        return member.ban().then(member => {
          message.channel.send(
            `${member.user.tag} was banned, no reason was provided`
          );
        });

      if (reason)
        return member.ban(reason).then(member => {
          message.channel.send(`${member.user.tag} was banned for ${reason}`);
        });
    }
  }

  if (command === "add") {
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel
        .send("Insufficient permissions (Requires permission `Manage roles`)")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    const member = message.mentions.members.first();
    if (!member)
      return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const add = args.slice(1).join(" ");
    if (!add)
      return message.channel.send("You have not specified a role").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const roleAdd = message.guild.roles.cache.find(role => role.name === add);
    if (!roleAdd)
      return message.channel.send("This role does not exist").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    if (member.roles.cache.get(roleAdd.id))
      return message.channel
        .send(`This user already has the ${add} role`)
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    member.roles.add(roleAdd.id).then(member => {
      message.channel.send(`${add} added to ${member.displayName}`);
    });
  }

  if (command === "remove") {
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel
        .send("Insufficient permissions (Requires permission `Manage roles`)")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    const member = message.mentions.members.first();
    if (!member)
      return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const remove = args.slice(1).join(" ");
    if (!remove)
      return message.channel.send("You have not specified a role").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    const roleRemove = message.guild.roles.cache.find(
      role => role.name === remove
    );
    if (!roleRemove)
      return message.channel.send("This role does not exist").then(msg => {
        msg.delete({ timeout: 30000 });
      });
    if (!member.roles.cache.get(roleRemove.id))
      return message.channel
        .send(`This user does not have the ${remove} role`)
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    member.roles.remove(roleRemove.id).then(member => {
      message.channel.send(`${remove} removed from ${member.displayName}`);
    });
  }

  if (command === "say") {
    const text = args.join(" ");
    if (!text)
      return message.channel
        .send("You have not specified something to say")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    message.channel.send(text);
  }

  if (command === "purge") {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel
        .send(
          "Insufficient permissions (requires permission `Manage messages`)"
        )
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    const number = args.join(" ");
    if (!number)
      return message.channel
        .send("You haven't specified a number to purge")
        .then(msg => {
          msg.delete({ timeout: 30000 });
        });
    message.channel.bulkDelete(number).catch(console.error);
  }

  if (command === "rps") {
    const options = [
      "rock :shell: ",
      "paper :newspaper2:",
      "scissors :scissors: "
    ];
    const option = options[Math.floor(Math.random() * options.length)];
    message.channel.send(`You got ${option}`);
    }
  if (command === "ip") {
    message.channel.send("survial server-[de12.falix.gg:26383]    ;    skyblock server-[de13falixgg26169]")
                                           
  }
  
  if (command === "mc-status") {
    message.channel.send("Currently updating spawn.Please note that this message is updated manually by my developer so it might not give the correct information")
  }
  
  
if (command === "server-info") {
message.channel.send(`This server's name is: ${message.guild.name}`);
}

if (command === "user-info") {
message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}  

if (command === "bot-info") {
    message.channel.send("This bot is created and owned by Xolo#0977")
}
 
if (command === "avatar") {
return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
}

const avatarList = message.mentions.users.map(user => {
	return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
});

// Send the entire array of strings as a message
// By default, discord.js will `.join()` the array with `\n`
message.channel.send(avatarList);  
  
  if (command === "learn") {
    message.channel.send("https://www.w3schools.com/html/default.asp")
}
  if (command === "java") {
    message.channel.send("https://www.tutorialspoint.com/compile_java_online.php")
}
 
  
  
  
});


client.login(process.env.TOKEN);
