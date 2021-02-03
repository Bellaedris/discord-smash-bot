const { prefix } = process.env.BOT_PREFIX;
const fighters = require('../resources/fighters.json');

module.exports = {
    name: 'match',
	description: 'Fight another player',
    args: true,
    usage: '<@user> <@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['m', 'f'],
	execute(message, args, db) {
        const data = [];
        
        if (args.length > 2) {
            return message.channel.send("The correct usage is !match @<P1> @<P2>");
        }

        //check both players are subscribed
        args.forEach(playerTag => {
            playerTag = playerTag.slice(3, playerTag.length - 1);
            db.execute("SELECT * FROM users WHERE discordId = ?", [playerTag], function (err, result, fields) {
                if (err) throw err;
                if (!result.length)
                    return message.channel.send(playerTag + "must register to the bot first!");
            });
        })

        //pick characters with validation for each pick
        message.channel.send(args[0] + ", pick your character.")
        let p1Pick;
        let p2Pick;
        const filter = m => {
            let ret = false;
            if ("<@" + m.author.id + ">" != args[0])
                return false;
            
            fighters.forEach(fighter => {
                if (fighter.aliases.toLowerCase().includes(m.content.toLowerCase())) 
                    ret = true;
            });
            return ret;
        }
        const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000});

        collector.on('collect', m => {
            console.log('character picked: ' + m.content);
        });

        collector.on('end', collected => {
            console.log('collected ' + collected.length + " items");
        });

        //message.channel.send(args[1] + ", pick your character.");

        //pick stage (reaction)

        //await for a reaction to know the winner

        //return message.channel.send("ongoing match");
    },
};