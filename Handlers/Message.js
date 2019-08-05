const Discord = require("discord.js");

module.exports.Message_Handle = function(client, msg, commands) {
    for (var i = 0; i < commands.command.length; i++) {
        if (commands.command[i].name == msg.content.split(" ")[0]) {
            for (var j = 0; j < commands.command[i].actions.length; j++) {
                switch (commands.command[i].actions[j].type) {
                    case "Send Message":
                        this.SendMessage_Handle(
                            msg,
                            client,
                            commands.command[i].actions[j]
                        );
                        break;
                    case "Send Image":
                        this.SendImage_Handle(
                            msg,
                            client,
                            commands.command[i].actions[j]
                        );
                        break;
                    case "Send Embed":
                        this.SendEmbed_Handle(
                            msg,
                            client,
                            commands.command[i].actions[j]
                        );
                        break;
                    case "Add Role to User":
                        this.AddRoleToUser_Handle(
                            msg,
                            client,
                            commands.command[i].actions[j]
                        );
                        break;
                    case "Send Random Image":
                        this.SendRandomImage_Handle(
                            msg, client, commands.command[i].actions[j]
                        );
                        break;
                    case "Kick User":
                        this.KickUser_Handle(msg, client, commands.command[i].actions[j]);
                        break;
                    case "Role Reaction Menu":
                        this.RoleReactionMenu_Handle(msg, client, commands.command[i].actions[j]);
                        break;
                }
            }
            break;
        }
    }
};

module.exports.SendMessage_Handle = function(msg, client, action) {
    const chan = client.channels.find(ch => ch.name === action.channelname);
    // Validate channel name
    if (!chan && action.channelname != '') {
        console.log('ERROR: No channel found with name: ' + action.channelname + '. Action name: ' + action.name)
    } 
    else if (action.channelname == '' && msg != '') {
        msg.channel.send(eval("`" + action.messagetext + "`"));
    }
    else {
        chan.send(eval("`" + action.messagetext + "`"));
    }
}

module.exports.SendImage_Handle = function(msg, client, action) {
    const chan = client.channels.find(ch => ch.name === action.channelname);
    // Validate channel
    if (!chan && action.channelname != '') {
        console.log('ERROR: No channel found with name: ' + action.channelname + '. Action name: ' + action.name)
    } 
    else if (action.channelname == '' && msg != '') {
        msg.channel.send({files: [action.url]});
    }
    else {
        chan.send({files: [action.url]});
    }
}

module.exports.SendEmbed_Handle = function(msg, client, action) {
    const Embed = new Discord.RichEmbed()
	.setColor(action.color)
	.setTitle(action.title)
	.setURL(action.url)
	.setAuthor(action.authorname, action.authorimageurl, action.authorlink)
	.setDescription(action.description)
	.setThumbnail(action.thumbnail)
	.setImage(action.image)
    .setFooter(action.footer);
    if (action.timestamp == "true") {
        Embed.setTimestamp();
    }

    const chan = client.channels.find(ch => ch.name === action.channelname);
    // Validate channel
    if (!chan && action.channelname != '') {
        console.log('ERROR: No channel found with name: ' + action.channelname + '. Action name: ' + action.name)
    } 
    else if (action.channelname == '' && msg != '') {
        msg.channel.send(Embed);
    }
    else {
        chan.send(Embed);
    }

}

function AddRoleToUser_Handle(msg, client, action) {
        var bot;
        var roleImport = []; 
        msg.guild.members.forEach(mem => {
            if (mem.user.tag == client.user.tag) {
                bot = mem;
            }
        });
        bot.roles.forEach(element => {
            roleImport.push(element.position);
        });

        var usertag = msg.content.split(" ")[1];
        var botRole = Math.max.apply(Math, roleImport)

        //Make sure user who sent command has high enough role
        var rolel = msg.guild.roles.find(role => role.name == action.rolename);
        if (rolel.position >= botRole) {
            console.log('ERROR: The bot must have a role higher than the one it is assigning');
        }
        else {
            if (!rolel) {
                console.log('ERROR: The Role: ' + action.rolename + ' does not exist');
            }
            else {
                if (!usertag) {
                    msg.member.addRole(rolel);
                }
                else {
                    let mem = msg.guild.members.find(gm => gm.user.tag == usertag);
                    if (mem) {
                        mem.addRole(rolel);
                    }
                    else {
                        console.log('ERROR: Could not find user with tag: ' + usertag);
                    }
                }
            }
        }
}

module.exports.SendRandomImage_Handle = function(msg, client, action)
{
    var count = action.urls.length;
    var rand = Math.floor(Math.random() * count);
    console.log(rand);
    var channel = action.channelname;
    var chan = client.channels.find(ch => ch.name === channel);
    if (!chan && channel != '') {
        console.log('ERROR: No channel found with name: ' + channel)
    } 
    else if (channel == '' && msg != '') {
        msg.channel.send({files: [action.urls[rand]]});

    }
    else {
        chan.send({files: [action.urls[rand]]});
    }
}

module.exports.KickUser_Handle = function(msg, client, action) {
    var member = msg.mentions.members.first();

    // Get the reason string
    var reason = msg.content.split(' ');
    var re = reason.slice(2).join(' ');
    if (!re) re = '';

    if (member) {
        member.kick(re).then((member) => {
            // Success
        }).catch(() => {
             // Failmessage
            console.log('ERROR: Failed to kick user. Invalid message format or lack of permissions.');
        });
    }
    else {
        console.log('ERROR: Member to be kicked not found');
    }
}

module.exports.RoleReactionMenu_Handle = function(msg, client, action) {
    console.log('role menu');

    const Embed = new Discord.RichEmbed()
	.setColor(action.color)
	.setTitle(action.title)
    .setDescription(action.description);
    
    action.roles.forEach(role => {
        const emo = client.emojis.find(emoji => emoji.name === role.emoji);
        if (emo) {
            Embed.addField(role.role, `${emo}`);
        }
        else {
            Embed.addField(role.role, role.emoji);
        }
    });

    const chan = client.channels.find(ch => ch.name === action.channelname);
    // Validate channel
    if (!chan && action.channelname != '') {
        console.log('ERROR: No channel found with name: ' + action.channelname + '. Action name: ' + action.name)
    } 
    else if (action.channelname == '' && msg != '') {
        msg.channel.send(Embed).then(embedmsg => {
            action.roles.forEach(role => {
                embedmsg.react(getEmoji(client, role.emoji));
            });
            setCollector(embedmsg, action);
        });
    }
    else {
        chan.send(Embed).then(embedmsg => {
            action.roles.forEach(role => {
                embedmsg.react(getEmoji(client, role.emoji));
            });
            setCollector(embedmsg, action);
        });
    }


    
}

function setCollector(msg, action) {
    const filter = (reaction, user) => {
        return user.id !== msg.author.id;
      };
      const collector = msg.createReactionCollector(filter, { time: 60000 });
      
      collector.on('collect', (reaction, reactionCollector) => {
        console.log(reaction.emoji);
        var role = action.roles.find(rl => rl.emoji == reaction.emoji.name);
        if (role) {
            console.log(role);
            reaction.users.forEach(user => {
                if (!user.bot) {
                    var ReactedMember = msg.guild.members.find(mem => mem.user.id == user.id);
                    var RoleToGive = msg.guild.roles.find(rl => rl.name == role.role);
                    console.log(ReactedMember + ' ' + RoleToGive.name);
                    if (ReactedMember && RoleToGive) {
                        ReactedMember.addRole(RoleToGive);
                    }
                    else {
                        console.log('ERROR: Could not find role or member to give');
                    }
                } 
            });
        }
        else {
            console.log('ERROR: Role not found for this reaction');
        }
      });
      
      collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
      });
}

function getEmoji(client, emojifield) {
    const emo = client.emojis.find(emoji => emoji.name === emojifield);
        if (emo) {
            console.log(emo.id);
            return `${emo.id}`;
        }
        else {
            console.log(emojifield);
            return emojifield;
        }
}
