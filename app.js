/**
 * BASIC CONFIGURATION MOSTLY DONE WITH THE HELP OF https://discordjs.guide/
 */

const fs = require('fs');
require('dotenv').config()
const Discord = require('discord.js')
const{prefix} = require("./config.json");

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //link command files
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

//runned when client is ready
client.on('message', message => {
    //ignore if msg does not start with prefix or is written by bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //gets the args from the msg string: cuts the prefix then splits the words
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    //gets the command keyword and remove it from args
    const commandName = args.shift().toLowerCase();

    //gets the command or an alias of this command
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

    if (command.args && !args.length)
    {
        let reply = "You did not provided any arguments.\n";

        if (command.usage) {
            reply += `The correct usage is: ${prefix}${command.name} ${command.usage}`;
        }

        return message.channel.send(reply);
    }

    if (command.guildOnly && message.channel.type === 'dm')
    {
        return message.reply('This command isn not executable in my DMs!');
    }

    //cooldown between 2 commands
    if (!cooldowns.has(command.name))
    {
        cooldowns.set(command.name, new Discord.Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000; //sets the CD time. Default is 2s

        //if the command is in cooldown, compares the time to the end of CD time
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
        //add the user to the active cooldowns
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args); //execute the named command
    } catch (e) {
        console.error(e);
        message.reply('An error occured while trying to execute the command.');
    }
});

//login to discord
client.login(process.env.DISCORD_BOT_TOKEN);