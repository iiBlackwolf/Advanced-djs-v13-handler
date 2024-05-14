const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with bot ping!'),
	async execute(client, interaction) {
		const Guilds = client.guilds.cache.filter(guild => guild.members.cache.get(interaction.member.id));
		let user;
		Guilds.forEach(g => {
			user = g.members.cache.get(interaction.member.id)
			console.log(user)
		});
        interaction.reply({ content: '**Pong!**' })
	},
};