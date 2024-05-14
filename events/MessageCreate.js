const Discord = require('discord.js')
const config = require('../config.json')
const { Collection } = require('discord.js')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
        };

      const attachment = message.attachments?.first()
          
      const prefix = config.prefix;

      if (!prefix){
        return { executed: false, reason: 'PREFIX'};
      };

      if(message.author.bot || !message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).split(/ +/g);
      if (!args.length) return message.channel.send({ content: `You didn't pass any command to reload, ${message.author}!`});
      const commandName = args.shift().toLowerCase();
  
      const cmd = client.commands.get(commandName)
          //+ aliases: [""],
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
  
          if(commandName.length < 1) return { executed: false, reason: 'NOT_FOUND' };
          if (!cmd) return message.channel.send({ content: `I can't find \`${commandName}\` in my commands!`});
  
          try{

              // Permissions: To check for default permissions in the guild
              if (message.guild){
                  if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                    return { executed: false, reason: 'PERMISSION_SEND'};
                  } else {
                    // Do nothing..
                  };
                  if (!message.channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL')){
                    return { executed: false, reason: 'PERMISSION_VIEW_CHANNEL'};
                  } else {
                    // Do nothing..
                  };
                  if (!message.channel.permissionsFor(message.guild.me).has('READ_MESSAGE_HISTORY')){
                    return message.channel.send({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
                  } else {
                    // Do nothing..
                  };
                  if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                    return message.channel.send({ content: '\"Missing Permissions\", the bot is missing the \`EMBED_LINKS\` permission please enable it!'})
                  } else {
                    // Do nothing..
                  };
                };
  
  
              //+ args: true/false,
          if (cmd.args && !args.length) {
              let desc = `You didn't provide any arguments`;
      
              return message.channel.send({ content: NoArgs });
          }
  
                   //+ permissions: [""],
                   if (cmd.permissions) {
                       if (message.guild) {
                         const authorPerms = message.channel.permissionsFor(message.author);
                         if (!authorPerms || !authorPerms.has(cmd.permissions)) {
                              const PermsEmbed = new Discord.MessageEmbed()
                              .setColor(`RED`)
                              .setDescription(`<a:pp802:768864899543466006> You don't have \`${text.joinArray(cmd.permissions)}\` permission(s) to use ${cmd.name} command.`)
                              return message.channel.send({ embeds: [PermsEmbed] })
                           }
                        }
                       }
  
                   //+ clientpermissions: [""],
                   if (cmd.clientpermissions) {
                      if (message.guild) {
                      const clientPerms = message.channel.permissionsFor(message.guild.me);
                      if (!clientPerms || !clientPerms.has(cmd.clientpermissions)) {
                          const ClientPermsEmbed = new Discord.MessageEmbed()
                          .setColor(`RED`)
                          .setDescription(`<a:pp802:768864899543466006> The bot is missing \`${text.joinArray(cmd.clientpermissions)}\` permission(s)`)
                          return message.channel.send({ embeds: [ClientPermsEmbed] })
                      }
                     }
                  }
  
                  //+ guildOnly: true/false,
                  if (cmd.guildOnly && message.channel.type === 'DM') {
                      const NoDmEmbed = new Discord.MessageEmbed()
                      .setColor(`RED`)
                      .setDescription(`<a:pp802:768864899543466006> I can\'t execute that command inside DMs!`)
                      return message.reply({ embeds: [NoDmEmbed] })
                  }
  
                  if(cmd.OwnerOnly) {
                      if(!client.owners.includes(message.author.id)) {
                          const DevOnlyEmbed = new Discord.MessageEmbed()
                          .setColor(`RED`)
                          .setDescription(`<a:pp802:768864899543466006> **${message.author.username}**, the command \`${cmd.name}\` is limited for developers only!`)
                          return message.channel.send({ embeds: [DevOnlyEmbed] })
  
                      }
                  }
          cmd.execute(client, message, args, { executed: true });
      } catch(err){
          message.reply(`There was an error in the console.\n\`Please report this with a screenshot to \`Joeᵉ#5559\``);
          console.log(err);
      }
    }
}