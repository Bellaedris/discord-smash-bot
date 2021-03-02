const { prefix } = process.env.BOT_PREFIX;

module.exports =
{
  name: 'time-left',
  description: 'Time left before the end of the season!',
  cooldown: 2,
  aliases: ['tl', 'time', 'timeleft'],
  execute(message, args, db)
  {
    const data = [];

    var sql="select datediff( end_season, curdate()) as datediff from season where (select max(id_season) from season);";
    db.query(sql, function(err, result)
    {
      if(err) throw err;
      else
      {
        let results=JSON.parse(JSON.stringify(result));
        message.channel.send("Il reste "+results[0].datediff+" jour(s) avant la fin de la saison.")
      }
    });
  },
};
