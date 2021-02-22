const { prefix } = process.env.BOT_PREFIX;
const fighters = require('../resources/fighters.json');
const stages = require('../resources/stages.json');

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

        /*if (args[0] == args[1]) {
            return message.channel.send("You cannot fight yourself.")
        }*/

        let playerTags = new Array();
        //check both players are subscribed
        args.forEach(playerTag => {
            playerTag = playerTag.slice(3, playerTag.length - 1);
            playerTags.push(playerTag);
            db.execute("SELECT * FROM users WHERE discordId = ?", [playerTag], function (err, result, fields) {
                if (!result.length)
                    return message.channel.send("<@" + playerTag + "> must register to the bot first!");
                if (err) throw err;
            });
        })

        //pick characters with validation for each pick
        let picks = new Array();
        message.channel.send(args[0] + ", pick your character.")
        const filter = m => m.author.id === playerTags[0] 
        //boucler le collector tant que l'on ne trouve pas de personnage valide?
        const collector = message.channel.createMessageCollector(filter, {time: 60000});

        collector.on('collect', m => {
            let ret = false;
            fighters.forEach(fighter => {
                if (fighter.aliases.toLowerCase().includes(m.content.toLowerCase())) {
                    picks.push(fighter.name)
                    ret = true;
                }
            });
            if (ret) {
                //if the user input is correct, pick the character
                //get the correct character name first
                
                collector.stop();
            } else {
                message.channel.send("Please type a valid character.")
            }
        });

        collector.on('end', collected => {
            //second player pick
            message.channel.send(args[1] + ", pick your character.")
            const filter = m => m.author.id === playerTags[1] 
            //boucler le collector tant que l'on ne trouve pas de personnage valide?
            const collector = message.channel.createMessageCollector(filter, {time: 60000});

            collector.on('collect', m => {
                let ret = false;
                fighters.forEach(fighter => {
                    if (fighter.aliases.toLowerCase().includes(m.content.toLowerCase())) {
                        picks.push(fighter.name)
                        ret = true;
                    }
                });
                if (ret) {
                    //if the user input is correct, pick the character
                    collector.stop();
                } else {
                    message.channel.send("Please type a valid character.")
                }
            });

            collector.on('end', collected => {
                picks.forEach(pick => {
                    console.log(pick + " ");
                });

                //pick stage (reaction)
                PlayerToPick = Math.floor(Math.random()); // either 0 or 1
                selectedStage = ''
                message.channel.send(args[PlayerToPick] + ", pick the stage.").then(msg => {

                    stages.forEach(stage => {
                        msg.react(stage.id);
                    });

                    const filter = (reaction, user) => {
                        return user.id === playerTags[PlayerToPick];
                    };
                    
                    const collector = msg.createReactionCollector(filter, { time: 60000 });
                    
                    collector.on('collect', (reaction, user) => {
                        let ret = false;
                        stages.forEach(stage => {
                            if (stage.emoji == reaction.emoji.name) {
                                selectedStage = stage.name
                                ret = true;
                            }
                        });
                        if (ret) {
                            //if the user input is correct, pick the character
                            collector.stop();
                        }
                    });
                    
                    collector.on('end', collected => {
                        if (!selectedStage.length) {
                            return message.channel.send("Vous n'avez pas sélectionné de stage. Le match est annulé.");
                        }
                        //insert the match data
                        var sql = "insert into games(player_one_id,player_two_id,winner_id,P1_char,P2_char,stage) values('" +
                        playerTags[0] + "','" +
                        playerTags[1] + "'," +
                        "NULL,'" +
                        picks[0] + "','" +
                        picks[1] + "'," +
                        "'" + selectedStage + "');";

                        db.query(sql, function(err, result) {
                            if(err) throw err;
                        });

                        //await for a reaction to know the winner
                        message.channel.send("ongoing match, react to declare the winner");
                    });
                });
            
            })
        });

    },
};