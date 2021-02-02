const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'quit',
    description: 'Leave the ranking!',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['q', 'leave', 'i'],
    execute(message, args, db) {
        const data = [];
        
        // -- SENSIBLE TO CODE INJECTIONS --
        if (args.length > 1) {
            return message.channel.send("The correct usage is !inscription @votreCompte");
        }
        

        var sql = "Delete from users where discordId = '"+args[0]+"';";

        db.query(sql, function(err, result) {
            if(err) throw err;
            else return message.channel.send("You leaved the ranking. Thank you for coming !");
        });
    }

};