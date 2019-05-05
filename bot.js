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
        /*
          Command Options:
            d!roll d20
            d!roll 5d12
            d!roll 5d12 + 2
        */
        let message = '';

        /*
          This long list of conditionals checks if the arguments for the command d!roll are valid. They check the following for INVALIDITY, respectively:
            1. Is the argument count greater than 3?
            2. Is the argument count less than 1?
            3. Is the argument count 2? 
            4. Does the first argument not include a 'd'?
            5. If there are 3 arguments, is the second one not a plus or a minus?
            6. If there are 3 arguments, does the third one not a number?
            7. Does the first argument have a number before the d (if there is something before the d)?
            8. Does the first number have a number after the d?
        */
        if (args.length > 3 || args.length < 1 || args.length == 2 || !args[0].includes('d') || (args.length == 3 && ((args[1] != '+' && args[1] != '-')
          || !(/^\d+$/).test(args[2])))) {
            message = "Please provide the command in the form of *d!roll [# of die]d[# of faces] [+ or -] [modifier]*."
        } else {
          let dIndex = args[0].indexOf('d');
          let beforeD = args[0].substr(0, dIndex);
          let afterD = args[0].substr(dIndex + 1);

          // This if condition checks for invalidity #7 and #8.
          if ((beforeD != '' && !(/^\d+$/).test(beforeD)) || afterD == '' || !(/^\d+$/).test(afterD)) {
            message = "Please provide the command in the form of *d!roll [# of die]d[# of faces] [+ or -] [modifier]*."
          } else {
            let dieOptions = [4, 6, 8, 10, 12, 20];
            let rollCount = Number(beforeD); // If beforeD is empty, rollCount will be 0.
            let faceCount = Number(afterD);
            let modifier;
            let modifierVal;

            // Sets values of the modifier and modifier value if there are enough arguments.
            if (args.length == 3) {
              modifier = args[1] == '+' ? (a, b) => { return a + b } : (a, b) => { return a - b < 0 ? 0 : a - b};
              modifierVal = Number(args[2]);
            }

            // Check if the chosen faceCount is valid.
            if (!dieOptions.includes(faceCount)) {
              message = "Error: You can pick between a 4, 6, 8, 10, 12, and 20 sided die.";
            } else {
              
              // First fix rollCount if it is too great or 0.
              if (rollCount > 10) {
                bot.sendMessage({
                  to: channelID,
                  message: "Warning: Max allowed roll count is 10. Setting roll count to 10..."
                });

                rollCount = 10;
              } else if (rollCount == 0) {
                rollCount = 1;
              }

              message = "Rolling " + rollCount + "d" + faceCount + (args.length == 3 ? args[1] + " " + args[2] : "") + "...\n";

              let total = 0;
              // Loop to roll die and format message properly.
              for (i = 0; i < rollCount; i++) {
                let result = Math.floor(Math.random() * faceCount) + 1;

                if (rollCount == 1 && faceCount == 20) {
                  if (result == 1) {
                    message += "**Critical Fail. You rolled a 1.**\n";
                  } else if (result == 20) {
                    message += "**:star:NATURAL 20!:star:**\n";
                  }
                }
                if (faceCount == 20 && result == 1) {
                  message += "**Critical Fail. You rolled a 1.**\n";
                } else {
                  message += result == 20 ? "**:star:NATURAL 20!:star:**\n" : `Roll Total: ${result} + ${modifierVal} = ${args.length == 3 ? modifier(result, modifierVal) : result}\n`;
                }
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
