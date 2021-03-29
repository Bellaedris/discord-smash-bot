const { prefix } = process.env.BOT_PREFIX;
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    name: 'add-player',
    description: 'Register to the bot!',
    guildOnly: true,
    cooldown: 2,
    aliases: ['inscription', 'i'],
    execute(message, args, db) {
        const data = [];

        // -- SENSIBLE TO CODE INJECTIONS --
   /*     if (args.length > 1) {
            return message.channel.send("The correct usage is !inscription @votreCompte");
        }*/
        var sql = "Select count(discordId) as count from users where discordId ='"+message.author.id+"';";
        db.query(sql, function(err, result) {
            if(err) throw err;
            let results=JSON.parse(JSON.stringify(result));
            if (results[0].count == 1)
            {
                return message.channel.send("You're already registered.");
            }
            else {

             var sql = "insert into users values('" +
             message.author.id + "','" +
             message.author.tag+"',"+
             1000 + "," +
             1000 + "," +
             0 +","+
             0 +","+
             "NOW()," +
             "NOW())";

             db.query(sql, function(err, result) {
                if(err) throw err;
                else return message.channel.send("You've been registered to the bot! You can start a new match using the !match command");
            });
         }


     });




    },
};
