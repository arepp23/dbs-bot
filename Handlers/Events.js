const Discord = require("discord.js");

module.exports.Event_Handle = function(client, member, events, type) {
    console.log(type);
    console.log(events);
    switch(type) {
        case 'guildMemberAdd':
            
            break;
    }
}
