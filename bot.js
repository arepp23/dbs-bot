const Discord = require('discord.js');
const client = new Discord.Client();
var token;
const fs = require('fs');
var MsgHandler = require('./Handlers/Message');
var EventHandler = require('./Handlers/Events');
var guildMemberHandler = require('./Handlers/guildMember');
var commands;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Make call to retrieve all the json for commands and events
  let rawdata = fs.readFileSync('./Bot/BotData/commands/commands.json');
  commands = JSON.parse(rawdata);
});

client.on('message', msg => {
  if(msg.author.bot) return;
  //client.emit("guildMemberAdd", msg.member);




  var prefixlength = settings.prefix.length;
  var prefixstring = msg.content.substring(0, prefixlength);
  if (prefixstring != settings.prefix)  return;

  msg.content = msg.content.substring(prefixlength, msg.content.length);

  MsgHandler.Message_Handle(client, msg, commands);

  
});

client.on("guildMemberAdd", (member) => {
  guildMemberHandler.guildMemberAdd_Handle(client, member, events);
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

let rawdata = fs.readFileSync('./Bot/BotData/Settings/settings.json');  
let settings = JSON.parse(rawdata);  
token = process.env.TOKEN;

let eventdata = fs.readFileSync('./Bot/BotData/commands/events.json'); 
let events = JSON.parse(eventdata); 

client.login(token);