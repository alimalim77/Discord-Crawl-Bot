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
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected TO MONGODB");
    startBot();
  })
  .catch((err) => console.error("Error occurred:", err));

// Initially create a role and assign
// As a follow-up, store roles in DB, fetch and assign them matching username
const roleCreation = async (guild) => {
  console.log("Role Creation");
  const newRole = guild.roles.cache.find((role) => role.name === "MERN-2");
  if (!newRole) {
    const newRole = await guild.roles.create({
      name: "MERN-2",
      color: 2067276,
      permissions: [],
    });
    return newRole;
  }
  return newRole;
};

const startBot = async () => {
  try {
    const res = await User.find({});

    //  On starting up, the event is fired
    client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
      // client.guilds.cache.forEach((guild) => {
      //   console.log(`Guild: ${guild.name}`);
      //   guild.roles.cache.forEach((role) => {
      //     console.log(`- Role: ${role.name} (ID: ${role.id})`);
      //   });
      // });
    });

    // When a member enters the server, it is triggered immediately
    client.on("guildMemberAdd", async (member) => {
      const username = `${member.user.username}`;
      const role = await roleCreation(member.guild);
      await member.roles.add(role);
      console.log(`Assigned 'MERN-2' role to ${username}`);
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
