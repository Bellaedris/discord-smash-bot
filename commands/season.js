const { prefix } = process.env.BOT_PREFIX;
const Discord = require('discord.js');
module.exports =
{
    name: 'season',
    description: 'Launch the season with the parameters of your choice !',
    cooldown: 2,
    aliases: ['s'],
    execute(message, args, db)
    {
        const data = [];

        function isNumeric(value)
        {
            return /^-?\d+$/.test(value);
        }

        //Check si la table est vide
        var sql="select count(*) as count from season;";
        db.query(sql, function(err, result)
        {
            if(err) throw err;
            else
            {
                let results=JSON.parse(JSON.stringify(result));
                if(results[0].count === 0 )
                {
                    var sql = "Insert into season (start_season) values (CURDATE());"; //Ajoute la date courante dans la table
                    db.query(sql, function(err, result)
                    {
                        if(err) throw err;
                    });

                    message.channel.send("Bienvenue sur Smash Ladder ! \nChoisissez la durée de votre saison ! \nUne saison peut durer 1 semaine minimum et 52 semaines maximum.\nVous avez juste besoin d'écrire le nombre de semaine.");

                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector(filter, {max:1, time: 15000 });

                    collector.on('collect', m =>
                    {
                        if (isNumeric(m.content) && m.content >=1 && m.content <= 56)
                        {
                            var sql = "Select max(id_season) as id, date_format(start_season, '%d/%m/%Y') as start, date_format (Date_add(start_season, INTERVAL '"+m.content+"' week), '%d/%m/%Y') as end from season group by start_season;"
                            db.query(sql, function(err, result)
                            {
                                if(err) throw err;
                                else
                                {
                                    let results=JSON.parse(JSON.stringify(result));
                                    //ajoute fin de saison
                                    var sql = "update season set end_season=Date_add(start_season, INTERVAL '"+m.content+"' week) where id_season='"+results[0].id+"';";
                                    db.query(sql, function(err, result)
                                    {
                                        if(err) throw err;
                                        else return message.channel.send("Bravo ! Votre saison se terminera donc le **"+results[0].end+"**.");

                                    });
                                }
                            });
                        }
                        else return message.channel.send("Vous devez rentrer un chiffre entre 1 et 52.");
                    });


                    collector.on('end', collected =>
                    {
                        if (collected.size === 0 || !isNumeric(collected.map(message => message.content)))
                        {
                            var sql = "delete from season order by id_season desc limit 1;"; //Delete la table créée
                            db.query(sql, function(err, result)
                            {
                                if(err) throw err;
                            });
                        return message.channel.send("Vous n'avez pas entré de chiffre ou attendu trop longtemps.\nEssayez encore avec la commande s!s.");
                        }

                    });
                }
                else
                {
                    var sql = "select date_format(end_season, '%d/%m/%Y') as end, datediff(end_season, start_season) as diff from season where id_season=(select max(id_season) from season);"
                    db.query(sql, function(err, result)
                    {
                        if(err) throw err;
                        else
                        {
                            let results=JSON.parse(JSON.stringify(result));
                            if(results[0].diff != 0 && results[0].end != null)
                            {
                                return message.channel.send("Il y a déjà une saison en cours. Celle-ci se termine le **"+results[0].end+"**.")
                            }
                            else
                            {
                                var sql = "Insert into season (start_season) values (CURDATE());";
                                db.query(sql, function(err, result)
                                {
                                    if(err) throw err;
                                });


                                message.channel.send("Bienvenue sur Smash Ladder ! \nChoisissez la durée de votre saison ! \nUne saison peut durer 1 semaine minimum et 52 semaines maximum.\nVous avez juste besoin d'écrire le nombre de semaine.");

                                const filter = m => m.author.id === message.author.id;
                                const collector = message.channel.createMessageCollector(filter, {max:1, time: 15000 });

                                collector.on('collect', m =>
                                {
                                    if (isNumeric(m.content) && m.content >=1 && m.content <= 56)
                                    {
                                        var sql = "Select max(id_season) as id, date_format(start_season, '%d/%m/%Y') as start, date_format (Date_add(start_season, INTERVAL '"+m.content+"' week), '%d/%m/%Y') as end from season group by start_season;"
                                        db.query(sql, function(err, result)
                                        {
                                            if(err) throw err;
                                            else
                                            {
                                                let results=JSON.parse(JSON.stringify(result));
                                                 //ajoute fin de saison
                                                var sql = "update season set end_season=Date_add(start_season, INTERVAL '"+m.content+"' week) where id_season='"+results[0].id+"';";
                                                db.query(sql, function(err, result)
                                                {
                                                    if(err) throw err;
                                                    else return message.channel.send("Bravo ! Votre saison se terminera donc le **"+results[0].end+"**.");

                                                });
                                            }
                                        });
                                    }
                                    else return message.channel.send("Vous devez rentrer un chiffre entre 1 et 56.");
                                });


                                collector.on('end', collected =>
                                {
                                    console.log(collected[0]);
                                    if (collected.size === 0 || !isNumeric(collected.map(message => message.content)))
                                    {
                                        var sql = "delete from season order by id_season desc limit 1;"; //Delete la table créée
                                        db.query(sql, function(err, result)
                                        {
                                            if(err) throw err;
                                        });
                                    return message.channel.send("Vous n'avez pas entré de chiffre ou attendu trop longtemps.\nEssayez encore avec la commande s!s.");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
};
