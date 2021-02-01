const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'register',
    description: 'Register to the bot!',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['r', 'inscription', 'i'],
    execute(message, args, db) {
        const data = [];
        
        // -- SENSIBLE TO CODE INJECTIONS --
        if (args.length > 1) {
            return message.channel.send("The correct usage is !inscription @votreCompte");
        }
        
        var sql = "Select count(discordId) as count from users where discordId ='"+args[0]+"';";
        db.query(sql, function(err, result) {
            if(err) throw err;
            let results=JSON.parse(JSON.stringify(result))
            console.log(results[0].count);
            if (results[0].count == 1) 
            {
                return message.channel.send("You're already registered.");
            }
            else {


             var sql = "insert into users values('" +
             args[0] + "'," +
             1000 + "," +
             1000 + "," +
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