const { prefix } = process.env.BOT_PREFIX;

module.exports = {
    name: 'register',
	description: 'Register to the tournament!',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    cooldown: 2,
    aliases: ['r', 'inscription'],
	execute(message, args) {
        //TODO
	},
};