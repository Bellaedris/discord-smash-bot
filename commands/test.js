const { prefix } = process.env.BOT_PREFIX;
const { token }= process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');
const file = new Discord.MessageAttachment('./resources/images/background.jpg');
const Canvas = require('canvas');

module.exports = {
  name: 'test',
  description: 'test',
  cooldown: 2,
  aliases: ['test'],
  execute(message, args, db)
  {
    const data = [];

    const exampleEmbed = {
      image: {
        url: 'attachment://background.jpg',
      },
    };

    message.channel.send({ files: [file], embed: exampleEmbed });




  },
};
