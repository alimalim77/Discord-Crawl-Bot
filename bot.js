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
const verifiedUsers = new Set();

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

    client.on("messageCreate", async (msg) => {
      if (msg.author.bot) return;
      console.log(msg.guild.members);
      if (verifiedUsers.has(msg.author.id)) {
        msg.channel.send("You are already verified.");
        return;
      }

      const userEmail = data.find((entry) => entry.Email === msg.content);
      if (userEmail) {
        msg.channel.send("User is Verified ✔️😀");
        verifiedUsers.add(msg.author.id);
      } else {
        if (msg.content.includes("@")) {
          msg.channel.send("You are not verified in server😞");
        }
        try {
          await msg.guild.members.ban(msg.author.id, {
            reason: "Unverified email provided",
          });
          console.log(`Banned ${msg.author.tag} for unverified email`);
        } catch (error) {
          console.error(`Failed to ban ${msg.author.tag}:`, error);
        }
      }
    });
    client.login(process.env.TOKEN);
  } catch (err) {
    console.error("Error occurred:", err);
  }
};

startBot();
