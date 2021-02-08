const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'time-left',
    description: 'Time left before the end of the season!',
    cooldown: 2,
    aliases: ['tl', 'time', 'timeleft'],
    execute(message, args, db) {
        const data = [];
           
        var sql = "Select count(discordId) as count from users where discordId ='"+message.author.id+"';";
        db.query(sql, function(err, result) {
            if(err) throw err;
            let results=JSON.parse(JSON.stringify(result));
            if (results[0].count == 1)  
            {
             var sql = "Select min(created_at) as first from users";

             db.query(sql, function(err, result) {
                if(err) throw err;
                else
                {
                    let results=JSON.parse(JSON.stringify(result));
                    return message.channel.send("Temps restant: "+results[0].first);
                }
            });
         }

         
     });

        

        
    },
};