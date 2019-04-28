var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

var prefix = 'd!';

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});


bot.on('message', function (user, userID, channelID, message, evt) {
  if (message.startsWith(prefix)) {
    let args = message.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase(); 

    // For die, command is d!roll [faces] [roll_count].
    switch (command) {
      case 'roll':
        let message = '';

        if (args.length != 2 || (/[a-zA-z]/.test(args)) || !Number.isInteger(Number(args[0]))) {
          message = "Please provide the command in the form of *d!roll [number_of_faces] [roll_count]*."
        } else {
          let dieOptions = [4, 6, 8, 10, 12, 20];
          let faceCount = args[0];
          let rollCount = args[1];

          if (!dieOptions.includes(Number(faceCount))) {
            message = "Error: You can pick between a 4, 6, 8, 10, 12, and 20 sided die."
          } else {
            if (rollCount > 10) {
              bot.sendMessage({
                to: channelID,
                message: "Warning: Max allowed roll count is 10. Setting roll count to 10..."
              });
              rollCount = 10;
            }
            
            message = "Rolling d" + faceCount + "...\n";

            for (i = 0; i < rollCount; i++) {
              let result = Math.floor(Math.random() * faceCount) + 1;

              if (faceCount == 20 && result == 1) {
                message += "**You rolled a 1. Critical fail.**\n";
              } else {
                message += result == 20 ? "**YOU ROLLED A NATURAL 20!**\n" : "You rolled a " + result + ".\n";
              }
            }
          }
        }

        sendDelayedMessage(channelID, message, 500);
        break;
    }
  }
});

/**
 * Sends a delayed message to a given channel after a provided delay in ms. 
 * @param {Byte} channelID 
 * @param {String} message 
 * @param {Number} delay 
 */
function sendDelayedMessage(channelID, message, delay) {
  setTimeout(function() {bot.sendMessage({
    to: channelID,
    message: message
  });}, delay);
}