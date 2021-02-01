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

        var sql = "insert into users values('" +
            args[0] + "'," +
            process.env.DEFAULT_MMR + "," +
            process.env.DEFAULT_MMR + "," +
            "NOW()," +
            "NOW())";

        db.query(sql, function(err, result) {
            if(err) throw err;
        });

        return message.channel.send("You've been registered to the bot! You can start a new match using the !match command");
	},
};