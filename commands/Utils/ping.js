const discord = require('discord.js');

module.exports = {
    name: "ping",
    aliases: ["Ping"],
    guildOnly: true, //or false
    args: false, //or false
    description: 'Ping command',
    permissions: [], // i.e "ADMINISTRATOR", "...", "..."
    clientpermissions: [], // i.e "ADMINISTRATOR", "...", "..."
    async execute(client, message, args) {
        await message.channel.send({ content: "**PONG!**"})
}
}