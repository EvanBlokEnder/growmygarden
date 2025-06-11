require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const nodemailer = require('nodemailer');

// Initialize Discord client with necessary intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// When the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Handle new messages
client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Prepare email content
  let emailContent = `
Message from ${message.author.tag} in ${message.guild.name} (#${message.channel.name}):
${message.content}

Embeds:
${message.embeds.length > 0 ? message.embeds.map(embed => JSON.stringify(embed, null, 2)).join('\n') : 'No embeds'}
  `;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Discord Message from ${message.author.tag}`,
    text: emailContent,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for message ID: ${message.id}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
