const { prefix } = process.env.BOT_PREFIX;
const Discord = require('discord.js');
module.exports = {
    name: 'season',
    description: 'Launch the season with the parameters of your choice !',
    cooldown: 2,
    aliases: ['s'],
    execute(message, args, db) 
    {
        const data = [];
        var sql = "Insert into season (start_season) values (CURDATE());";
        db.query(sql, function(err, result) {
            if(err) throw err;
        });

        message.channel.send("Welcome to the Smash Ladder ! \nChoose how long you want your season to be ! \nA season can last 1 week minimum and 52 weeks maximum.\nWrite the number of weeks you want the season to last.");
        const filter = m => m.author.id === message.author.id;

        const collector = message.channel.createMessageCollector(filter, {max:1, time: 15000 });

        collector.once('collect', m => {
            if (isNumeric(m.content) && m.content >=1 && m.content <= 56)
            {
               // message.channel.send("good   "+m.content);

                var sql = "Select date_format(start_season, '%D %b %Y') as start, date_format (Date_add(start_season, INTERVAL '"+m.content+"' week), '%D %b %Y') as end from season;"
                db.query(sql, function(err, result) {
                    if(err) throw err;
                    else 
                    {
                        let results=JSON.parse(JSON.stringify(result));
                        message.channel.send(results[0].start);
                        message.channel.send(results[0].end);
                    }
                });

                collector.once('end', collected => {});
            }
            else {
                message.channel.send("You didn't put a number between 1 and 56 or waited too long.\nTry again with the command s!s.");
            }
            
        });



        function isNumeric(value) {
            return /^-?\d+$/.test(value);
        }
    }
};