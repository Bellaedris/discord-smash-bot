const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'admin',
    args :true,
    description: 'Make someone admin!',
    usage: '<@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['a'],
    execute(message, args, db)
    {
      const data = [];

      

    },
};
