const Discord = require('discord.js')
const config = require('../config.json')
const { MessageActionRow, MessageButton, Collection } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        const slash = client.slashcommands.get(interaction.commandName);
    
        if(!slash) {
          return;
        } else if(interaction.user.bot) {
          return;
        } else {
          // Do nothing..
        }
    
        try {

       //+ permissions: [""],
      if (slash.permissions) {
        if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!sauthorPerms || !sauthorPerms.has(slash.permissions)) {
    
               return;
            }
           }
        }
    //+ clientpermissions: [""],
    if (slash.clientpermissions) {
       if (interaction.guild) {
       const sclientPerms = interaction.channel.permissionsFor(interaction.guild.me);
       if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
           return interaction.reply({ content: `Missing permissions!`, ephemeral: true });
       }
      }
    }  

    if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('SEND_MESSAGES')){
          return { executed: false, reason: 'PERMISSION_SEND'};
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL')){
          return;
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('READ_MESSAGE_HISTORY')){
          return interaction.reply({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
        } else {
          // Do nothing..
        };
      };
            await slash.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(() => interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }));
        }
    }
}