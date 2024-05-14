module.exports = {
    name: 'ready',
    async execute(client, message) {
        await new Promise(r=>setTimeout(r,3500))
        
        client.user.setPresence({ activities: [{ name: "Hello world!", type: "PLAYING" }], status: 'online' });
        console.log(`${client.user.tag} is online!`)
    }
}