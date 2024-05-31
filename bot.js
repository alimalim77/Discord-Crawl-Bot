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
const colors = [5763719, 2123412, 2123412, 10038562, 16776960];
const pickColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

// Initially create a role and assign
// As a follow-up, store roles in DB, fetch and assign them matching username
const roleCreation = async (guild, roles) => {
  // Promise.all takes an array of promises and returns a single promise that resolves
  //when all the promises in the array have resolved.
  const newRoles = await Promise.all(
    roles.map(async (item) => {
      let newRole = guild.roles.cache.find((role) => role.name === item);
      if (!newRole) {
        newRole = await guild.roles.create({
          name: item,
          color: pickColor(),
          permissions: [],
        });
      }
      return newRole;
    })
  );
  return newRoles;
};

// Preapproving if they are already present in the DB
const preApproveUser = async (user) => {
  const res = await User.findOne({ username: user });
  if (!res) return null;
  const result = res.toObject();
  return {
    username: result.username,
    roles: result.roles,
  };
};

const startBot = async () => {
  try {
    const res = await User.find({});

    //  On starting up, the event is fired
    client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    // When a member enters the server, it is triggered immediately
    client.on("guildMemberAdd", async (member) => {
      const username = `${member.user.username}`;
      const verified = await preApproveUser(username);

      if (verified) {
        const role = await roleCreation(member.guild, verified.roles);
        role.forEach(async (sprint) => {
          await member.roles.add(sprint);
        });
      }
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
