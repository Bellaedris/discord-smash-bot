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
        const filter = m => m.content.includes('discord');
        const collector = message.channel.createMessageCollector(filter, { time: 15000 });

        collector.on('collect', m => {
            console.log(`Collected ${m.content}`);
        });

        collector.on('end', collected => {
            return console.log("time's up");
            
        });
    },
};