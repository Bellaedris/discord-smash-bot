const { prefix } = process.env.BOT_PREFIX;
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('ODAzMzY5OTY4NzMzMTI2NzI2.YA8ylg.83e0dSCuoAKmqbO7NGtmkOzUeNY');
module.exports = {
    name: 'leaderboard',
    description: 'Show the leaderboard!',
    guildOnly: true,
    cooldown: 2,
    aliases: ['l', 'lead', 'ranking'],
    execute(message, args, db) 
    {
        const data = [];
        
        // -- SENSIBLE TO CODE INJECTIONS --
     /*   if (args.length > 1) {
            return message.channel.send("The correct usage is !inscription @votreCompte");
        }*/
        
        var sql = "Select discordTag, rating from users order by rating DESC;";

        db.query(sql, function(err, result) {

            if(err) throw err;
            else
            {
                let results=JSON.parse(JSON.stringify(result));
                const embed = new Discord.MessageEmbed()
                embed.setColor('#8E0012');
                embed.setTitle("Leaderboard");
                embed.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/4/49/Smash_Ball.png');
                let j=1;
                for (let i= 0; i<results.length;i++)
                {
                /*
                    embed.addFields({ name: j, value: results[i].discordTag, inline:true,});
                    embed.addFields({name : "Points", value : results[i].rating+'\b', inline:true, })
                    embed.addField({name: '\u200B',value: '\n', });*/
                    embed.addFields(
                        { name: '\u200B', value:"**#"+j+"** - "+results[i].discordTag+" - "+results[i].rating , inline:false},
                        )
                    j++;
                }
                message.channel.send(embed);
            }
        });
    },
};