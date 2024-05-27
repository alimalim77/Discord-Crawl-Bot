const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Model created instead client.db ad client .collection could be used
const User = require("./model/user.model.js");

dotenv.config();

const startBot = async () => {
  try {
    const res = await User.find({});

    //  On starting up, the event is fired
    client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
      console.log(`Data is ${res}`);
    });

    // When a member enters the server, it is triggered immediately
    client.on("guildMemberAdd", async (member) => {
      const username = `${member.user.username}`;
      console.log(`User: ${username}`);
    });

    // client.on("messageCreate", async (msg) => {
    //   if (msg.author.bot) return;
    //   console.log(msg.guild.members);
    //   if (verifiedUsers.has(msg.author.id)) {
    //     msg.channel.send("You are already verified.");
    //     return;
    //   }

    //   const userEmail = data.find((entry) => entry.Email === msg.content);
    //   if (userEmail) {
    //     msg.channel.send("User is Verified ✔️😀");
    //     verifiedUsers.add(msg.author.id);
    //   } else {
    //     if (msg.content.includes("@")) {
    //       msg.channel.send("You are not verified in server😞");
    //     }
    //     try {
    //       await msg.guild.members.ban(msg.author.id, {
    //         reason: "Unverified email provided",
    //       });
    //       console.log(`Banned ${msg.author.tag} for unverified email`);
    //     } catch (error) {
    //       console.error(`Failed to ban ${msg.author.tag}:`, error);
    //     }
    //   }
    // });

    client.login(process.env.TOKEN);
  } catch (err) {
    console.error("Error occurred:", err);
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected TO MONGODB");
    startBot();
  })
  .catch((err) => console.error("Error occurred:", err));
