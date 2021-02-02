const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'quit',
    description: 'Leave the ranking!',
    guildOnly: true,
    cooldown: 2,
    aliases: ['q', 'leave', 'i'],
    execute(message, args, db) 
    {
        const data = [];
        
        // -- SENSIBLE TO CODE INJECTIONS --
     /*   if (args.length > 1) {
            return message.channel.send("The correct usage is !inscription @votreCompte");
        }*/
        
        var sql = "Select count(discordId) as count from users where discordId ='"+message.author.id+"';";

        db.query(sql, function(err, result) {

            if(err) throw err;
            let results=JSON.parse(JSON.stringify(result));
            if (results[0].count == 1) 
            {
                var sql = "Delete from users where discordId = '"+message.author.id+"';";
                db.query(sql, function(err, result)
                {
                    if(err) throw err;
                    else return message.channel.send("You leaved the ranking. Thank you for coming !");
                });

            }
            else 
            {
                return message.channel.send("You can't quit, you are not registered.");
            }
            

        });
    },
};