const { prefix } = process.env.BOT_PREFIX;
const { token }= process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');
const Canvas = require('canvas');


module.exports = {
  name: 'leaderboard',
  description: 'Show the leaderboard!',
  guildOnly: true,
  cooldown: 2,
  aliases: ['l', 'lead', 'ranking'],
  execute(message, args, db)
  {
    const data = [];
    var sql = "Select discordTag, rating from users order by rating DESC;";

    db.query(sql, function(err, result) {

      if(err) throw err;
      else
      {
        let results=JSON.parse(JSON.stringify(result));
        var tag=[];
        var rank=[];
        for(let i=0; i<results.length;i++)
        {
          tag.push(results[i].discordTag);
          rank.push(results[i].rating);
        }

        const { createCanvas, loadImage, registerFont } = require('canvas');
        registerFont('./resources/font/smashFont.ttf', { family: 'Smash' })
        const canvas = createCanvas(900, 700);
        const ctx = canvas.getContext('2d');
        loadImage('./resources/images/background.jpg').then((image) => {
        ctx.drawImage(image, 50, 0,canvas.width, canvas.height)


          // Write "Awesome!"
          ctx.font = '60px Smash';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Leaderboard', 230, 50);
          let j=0;
          let k=1;
          for (var i = 0; i < results.length; i++)
          {
            ctx.font = '25px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("#"+k+" -", 225, 100+j);

            ctx.font = '25px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(tag[i], 300, 100+j);

            ctx.font = '25px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(rank[i], 600, 100+j);
            k+=1;
            j+=50;
          }


          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "leaderboard.png");

          message.channel.send(attachment);
        })

      }
    });

  },
};
