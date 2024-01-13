const advantage = "adv";		// Marked as 'a' in roll command
const disadvantage = "disadv";	// Marked as 'b' in roll command
const crit = "crit";			// Marked as 'c' in roll command
const validRoll = /\d+d\d+(kh?l?\d+)?$/;


export async function roll(message) {
	message.reply("ohs noes. dis is bwoken wight now. soz");
	return;

	let originalInteraction = interaction;
	let originalMessage = message;
	let fullRoll = null;
	let rollOperations = [];
	let reply = '';

	// Check if command was from message or slash command and handle accordingly
	if (interaction == null) {
		if (message == null) {
			// Should not happen
			console.log('no interaction or message provided');
			return;
		}
		content = message.content.trim();
		if (content === "") {
			return 'I don\'t know what you want me to roll.';
		}

		fullRoll = content;
		interaction = message;
	}
	else {
		fullRoll = interaction.options.getString('dice');
	}

	// Standardize roll to lower case
	fullRoll = fullRoll.toLowerCase();

	// Remove all whitespace
	fullRoll = fullRoll.replace(/\s/g, '');
	// Replace roll modifiers with single characters
	fullRoll = fullRoll.replace(/adv/gi, 'a');
	fullRoll = fullRoll.replace(/disadv/gi, 'b');
	fullRoll = fullRoll.replace(/crit/gi, 'c');

	let subRoll = "";
	// Parse full roll into seperate roll sub operations (rolls)
	for (var i = 0; i < fullRoll.length; i++) {
		character = fullRoll[i];
		switch (character) {
			case '+':
			case '-':
			case '<':
			case '>':
			case '(':
			case ')':
			case 'a':
			case 'b':
			case 'c':
				if (subRoll != "") {
					rollOperations.push(subRoll);
				}
				rollOperations.push(character);
				subRoll = "";
				break;
			default:
				subRoll += character;
				break;
		}
	}
	rollOperations.push(subRoll);
	try {
		let { fullRollOutcome, totalRoll } = executeRolls(rollOperations);
		return "**Rolling " + fullRoll + ": **" + fullRollOutcome + "\n**You rolled:** " + totalRoll;
	}
	catch (error) {
		return error;
	}
}

function executeRolls(rollOperations) {
	console.log(rollOperations);
	console.log(rollOperations);
	let totalRoll = 0;
	let fullRollOutcome = "";
	let addNext = true;
	while (rollOperations.length > 0) {
		var nextOperation = rollOperations.shift()
		console.log(nextOperation);
		switch (nextOperation) {
			// Check if next operation is a special operation character
			case '+':
				addNext = true;
				break;
			case '-':
				addNext = false;
				break;
			case '<':
				// unused
			case '>':
				// unused
			case '(':
				// unused
			case ')':
				// unused
			case 'a':
				// unused
			case 'b':
				// unused
			case 'c':
				// unused
				break;
			// If not special operation character, treat as regular roll operation
			default:
				// Check if roll operation is just a constant

				try {
					var { rollResultString, total } = resolveRoll(nextOperation);
					if (fullRollOutcome == "") {
						fullRollOutcome = "(" + rollResultString + ")";
					}
					else {
						if (addNext) {
							fullRollOutcome += " + ";
						} else {
							fullRollOutcome += " - ";
						}
						fullRollOutcome += "(" + rollResultString + ")";
					}

					if (addNext) {
						totalRoll += total;
					}
					else {
						totalRoll -= total;
					}
				}
				catch (error) {
					console.log(error);
					throw error;
				}
				break;
		}

	}
	return {
		fullRollOutcome,
		totalRoll
	};
}

function resolveRoll(roll) {	
	// Check that roll has valid syntax
	if (!validRoll.test(roll)) {
		throw "Roll syntax is invalid.";
		return;
	}

	// Indentifies how many rolled dice to drop from total
	let diceToDrop = 0;
	// dropHighest: false -> drop the lowest rolls
	// dropHighest: true -> drop the highest rolls
	let dropHighest = false;

	// Split roll into 2 args
	// args[0] = number of dice
	// args[1] = dice to roll
	console.log("begin parsing");
	let args = roll.split('d');
	let numDice = Number(args[0]);
	let diceToRoll = args[1];
	let dieSize = "";

	console.log("parse diceToRoll");

	if (diceToRoll.includes('k')) {
		// Index of keep character
		let keepIndex = diceToRoll.indexOf('k');
		// Offset for number of dice to keep
		let numKeepOffset = 1;
		let nextChar = diceToRoll[keepIndex + 1];
		switch (nextChar) {
			case 'l':
				dropHighest = true;
			case 'h':
				numKeepOffset = 2;
			default:
				diceToKeep = diceToRoll.substring(keepIndex + numKeepOffset);
				diceToKeep = Number(diceToKeep);
				// Cannot keep more dice that rolled
				// diceToKeep must be less than numDice
				console.log("rolling: " + numDice + " dice");
				console.log("keeping: " + diceToKeep + " rolls");
				if (numDice <= diceToKeep) {
					throw "Cannot drop more dice than are rolled."
				}
				diceToDrop = numDice - diceToKeep;
				dieSize = diceToRoll.substring(0, keepIndex);
				break;
		}
	}
	else {
		dieSize = diceToRoll;
	}

	console.log(diceToDrop);

	let rollResults = [];
	numDice = Number(numDice);
	dieSize = Number(dieSize);
	console.log("new rolling " + numDice + "d" + dieSize);

	// Roll dice and add to result
	for (var i = 0; i < numDice; i++) {
		var result = Math.floor(Math.random() * (dieSize) + 1);
		rollResults.push(result);
		console.log("new rolled: " + result);
	}

	// Sort rolls in ascending order
	rollResults = rollResults.sort(function(a, b){return a - b});
	console.log("new sorted rolls: " + rollResults);

	// Formatted string with total result of rolls
	let rollResultString = "";
	var total = 0;
	// Loop to review, drop, and format roll result
	for (var i = 0; i < rollResults.length; i++) {
		var result = rollResults[i];	
		var value = Number(result);
		// Formatted string for a single die roll
		var resultString = result.toString();

		// Format result to highlight max and min rolls
		if (result == dieSize) {
			resultString = "**" + resultString + "**";
		} else if (result == 1) {
			resultString = "__" + resultString + "__";
		}
	
		if (diceToDrop != 0) {
			// Drop last n (diceToDrop) rolls
			if (dropHighest) {
				if (i > rollResults.length - diceToDrop - 1) {
					resultString = "~~ " + resultString + " ~~";							
				}
				else {
					// Roll not drpped, update total sum
					total += value;
				}
			}
			// Drop first n (diceToDrop) rolls
			else {
				if (i < diceToDrop ) {
					resultString = "~~ " + resultString + " ~~";							
				}
				else {
					// Roll not drpped, update total sum
					total += value;
				}
			}
		}
		else {
			// No dropped dice, update total sum
			total += value;
		}

		// Add individual result to total result
		if (rollResultString == "") {
			rollResultString = resultString;
		} else {
			rollResultString += ", " + resultString;
		}
	}

	console.log(rollResultString);

	return {
		rollResultString,
		total
	};
}

