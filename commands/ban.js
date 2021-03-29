const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'ban',
    args :true,
    description: 'Ban a player !',
    usage: '<@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['b'],
    execute(message, args, db)
    {
      const data = [];



    },
};
