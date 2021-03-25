const { prefix } = process.env.BOT_PREFIX;
const { token }= process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');
const Canvas = require('canvas');

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}


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
        registerFont('./resources/font/Poppins-Light.ttf', { family: 'poppins' })
        const canvas = createCanvas(1000, 1000);
        const ctx = canvas.getContext('2d');
        loadImage('./resources/images/background.jpg').then((bg) =>
        {
          ctx.drawImage(bg, 50, 0,canvas.width, canvas.height);

          ctx.fillStyle = '#0B132B';
          ctx.strokeStyle="#5BC0BE";
          roundRect(ctx, 50, 0, canvas.width-50, 100, {
            bl: 50,
            br: 50
          }, true);

          ctx.font = '60px poppins';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Leaderboard',300, 75);

          let j=0;
          let k=1;
          for (var i = 0; i < results.length; i++)
          {
            if (k === 16 )
            {
              break;
            }
            else {
              if (i===0 )
              {
                ctx.strokeStyle = "#d4ae15";

              }
              else if (i === 1   )
              {
                ctx.strokeStyle = "#949494";
              }
              else if (i === 2)
              {
                ctx.strokeStyle = "#9e5a00";
              }

              else
              {
                ctx.strokeStyle = "#000";
              }

              ctx.fillStyle = "rgba(58, 80, 107, 0.5)";
              //x,y,widht,height
              roundRect(ctx, 255, 160+j, 490, 50, {
                tl: 50,
                br: 25
              }, true);

              ctx.font = '30px poppins';
              ctx.fillStyle = '#ffffff';
              ctx.fillText("#"+k+" -", 275, 200+j);

              ctx.font = '30px poppins';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(tag[i], 350, 200+j);

              ctx.font = '30px Smash';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(rank[i], 650, 200+j);
              k+=1;
              j+=53;
            }
            }

          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "leaderboard.png");
          message.channel.send(attachment);
        })

      }
    });

  },





};
