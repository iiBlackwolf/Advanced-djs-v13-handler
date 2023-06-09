const { Client, Intents, Collection } = require("discord.js");

// connect us to the config.json file
const config = require("./config.json");

// create a new Discord client
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_BANS,
  ],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

// require the fs module
const fs = require("fs");

const path = require("path");

client.commands = new Collection();
client.slashCommands = new Collection();

const commands = [];

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
  if (commandFiles.length <= 0) {
    console.log("Can't find any commands!");
  }

  commandFiles.forEach((cmd) => {
    // console the loaded cmds
    var commandFiles = require(`./commands/${folder}/${cmd}`);
    console.log(`File ${cmd} was loaded`);
  });
}

function readCommands(dir) {
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const slash = require(filePath);
      client.slashCommands.set(file.split(/.js$/)[0], slash);
      commands.push(slash.data.toJSON());
    }
  }
}

const slashCommandsDir = path.join(__dirname, "./slashCommands");
readCommands(slashCommandsDir);

client.on("ready", async () => {
  client.user.setPresence({
    activities: [{ name: "Online", type: "COMPETING" }],
    status: "online",
  });
  if (config.loadSlashsGlobal) {
    client.application.commands
      .set(commands)
      .then((slashCommandsData) => {
        console.log(
          `(/) ${slashCommandsData.size} slashCommands ${`(With ${
            slashCommandsData.map((d) => d.options).flat().length
          } Subcommands)`} Loaded for ${`All possible Guilds`}`
        );
      })
      .catch((e) => console.log(e));
  } else {
    client.guilds.cache
      .map((g) => g)
      .forEach(async (guild) => {
        try {
          guild.commands
            .set(commands)
            .then((slashCommandsData) => {
              console.log(
                `(/) ${slashCommandsData.size} slashCommands ${`(With ${
                  slashCommandsData.map((d) => d.options).flat().length
                } Subcommands)`} Loaded for: ${`${guild.name}`}`
              );
            })
            .catch((e) => console.log(e));
        } catch (e) {
          console.log(e);
        }
      });
  }
});

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

client.login(config.token);
