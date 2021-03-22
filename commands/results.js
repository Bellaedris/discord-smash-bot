const { prefix } = process.env.BOT_PREFIX;
const fighters = require('../resources/fighters.json');
const stages = require('../resources/stages.json');
const EloRating = require('elo-rating');

module.exports = {
    name: 'results',
	description: 'Enter the results of a match',
    args: true,
    usage: '<@user> <@user>',
    guildOnly: true,
    cooldown: 120,
    aliases: ['res', 'r'],
	execute(message, args, db) {
        const data = [];
        
        if (args.length > 2) {
            return message.channel.send("Une utilisation correcte est !res @<P1> @<P2>");
        }

        //check that an ongoing match between the two players exists
        playerTags = new Array();
        args.forEach(playerTag => {
            playerTag = playerTag.slice(3, playerTag.length - 1);
            playerTags.push(playerTag);
        });

        db.execute("SELECT * FROM games WHERE ((player_one_id = ? AND player_two_id = ?) OR (player_one_id = ? AND player_two_id = ?)) AND winner_id IS NULL", 
                   [playerTags[1], playerTags[0], playerTags[0], playerTags[1]], function (err, result, fields) {
            if (!result.length)
                return message.channel.send("Aucun match n'est en cours entre les deux joueurs.");
            if (err) throw err;
            
            //wait for a react to identify the winner
            let winner;
            let looser;
            message.channel.send("Réagissez avec 1 si " + args[0] + " est le gagnant, avec 2 si " + args[1] + " est le gagnant.").then(msg => {
                msg.react('1️⃣');
                msg.react('2️⃣');

                const filter = (reaction, user) => {
                    return user.id === playerTags[0] || user.id === playerTags[1];
                };
                
                const collector = msg.createReactionCollector(filter, { time: 120000 });
                
                collector.on('collect', (reaction, user) => {
                    let ret = false;
                    if (reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣') {
                        ret = true;
                    }
                    if (ret) {
                        //if the user input is correct, pick the character
                        winner = reaction.emoji.name == '1️⃣' ? playerTags[0] : playerTags[1];
                        looser = reaction.emoji.name == '2️⃣' ? playerTags[1] : playerTags[0];
                        collector.stop();
                    }
                });
                
                collector.on('end', collected => {
                    if (!winner) {
                        return message.channel.send("Vous n'avez pas sélectionné de gagnant dans le temps imparti. Relancez la commande.");
                    }
                    //insert the match data
                    db.execute("UPDATE games SET winner_id = ? WHERE (player_one_id = ? AND player_two_id = ?) OR (player_one_id = ? AND player_two_id = ?) AND winner_id = NULL", 
                    [winner, playerTags[1], playerTags[0], playerTags[0], playerTags[1]], function (err, result, fields) {
                        if (err) {
                            throw err;
                            return message.channel.send("Erreur lors de la mise à jour des données du match.");
                        }
                    });
                    
                    var winnerRatings;
                    var looserRatings;
                    db.execute("SELECT rating, previous_rating FROM users WHERE discordId = ?", 
                    [winner], function (err, result, fields) {
                        if (err) throw err;
                        winnerRatings = JSON.parse(JSON.stringify(result[0].rating));
                        db.execute("SELECT rating, previous_rating FROM users WHERE discordId = ?", 
                        [looser], function (err, result, fields) {
                            if (err) throw err;
                            looserRatings = JSON.parse(JSON.stringify(result[0].rating));
                            //UPDATE PLAYERS MMR
                            let newElo = EloRating.calculate(winnerRatings, looserRatings);

                            db.execute("UPDATE users SET rating = ?, previous_rating = ? WHERE discordId = ?", 
                            [newElo.playerRating, winnerRatings, winner], function (err, result, fields) {
                                if (err) throw err;
                            });

                            db.execute("UPDATE users SET rating = ?, previous_rating = ? WHERE discordId = ?", 
                            [newElo.opponentRating, looserRatings, looser], function (err, result, fields) {
                                if (err) throw err;
                            });

                            return message.channel.send("Les données du match on bien été mises à jour.");
                        });
                    });
                });
            });
        })  
    },
};