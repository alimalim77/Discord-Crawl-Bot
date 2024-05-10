const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const dotenv = require("dotenv");
const parser = require("./parsing-csv");

dotenv.config();

const startBot = async () => {
  try {
    const data = await parser();

    client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
      client.channels.cache.forEach((channel) => {
        if (channel.name === "general") {
          channel.send("Please provide your email");
        }
      });
    });

    client.on("messageCreate", (msg) => {
      console.log("Received Data is", data);
      if (msg.author.bot) return;
      data.some((data) => msg.content === data.Email)
        ? msg.channel.send("User is Verified ✔️😀")
        : msg.channel.send("You are not one among the beavers😞");
    });
    client.login(process.env.TOKEN);
  } catch (err) {
    console.error("Error occurred:", err);
  }
};

startBot();
