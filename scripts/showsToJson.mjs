import fs from "fs";
import readline from "readline";

// list of words not to capitalize
const noCapList = ["and", "in", "a", "w/", "is"];
const shows = [];

async function processLineByLine() {
	const fileStream = fs.createReadStream("shows.log");

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let monthYear = "";
	for await (const line of rl) {
		const show = {};
		// each line in input.txt will be successively available here as `line`.
		const day = line.slice(0, 2);
		// if it is not a number, then it's a month / year
		if (isNaN(day)) {
			monthYear = upperCaseFirstLetters(line);
			continue;
		}
		show.date = `${day} ${monthYear}`;

		// rest of the line
		const theRest = line.slice(2);
		// get the venue (everything until the first open paren)
		let splitByParen = theRest.split("(");
		// remove from array
		show.venue = splitByParen.splice(0, 1)[0].trim();
		show.venue = upperCaseFirstLetters(show.venue);

		// create a string from the rest of the array
		const locationAndLineup = splitByParen.join("(");

		// get location and lineup
		let lineup = locationAndLineup.split(")");
		show.location = lineup.splice(0, 1)[0];
		show.location = upperCaseFirstLetters(show.location);

		show.lineup = lineup.join(")");
		show.lineup = show.lineup.trim();
		show.lineup = upperCaseFirstLetters(show.lineup);

		shows.push(show);
	}
}

await processLineByLine();

fs.writeFile("../_data/shows.json", JSON.stringify(shows, null, 2), (err) => {
	// Checking for errors
	if (err) throw err;
});

/**
 * Takes a string and returns that string with all letters uppercased
 */
function upperCaseFirstLetters(s) {
	// exit early if this is not a valid string
	if (!s) {
		return "";
	}
	// split on spaces
	let words = s.split(" ");

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		// don't capitalize certain words
		if (noCapList.includes(word)) {
			continue;
		}
		// don't capitalize hrefs
		if (word.substr(0, 6) === 'href="') {
			// and if there is an href, capitalize the first word
			// at the end of the opening href element
			let split = word.split('">')[1];
			let splitCap = split[0].toUpperCase() + split.substr(1);
			words[i] = word.replace(`">${split}`, `">${splitCap}`);
			continue;
		}
		words[i] = word[0].toUpperCase() + word.substr(1);
	}
	// make the array a sentence again
	let joined = words.join(" ");
	return joined;
}
