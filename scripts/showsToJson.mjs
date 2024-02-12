import fs from "fs";
import readline from "readline";

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
			monthYear = line;
			continue;
		}
		show.date = `${day} ${monthYear}`;

		// rest of the line
		const theRest = line.slice(2);
		// get the venue (everything until the first open paren)
		let splitByParen = theRest.split("(");
		// remove from array
		show.venue = splitByParen.splice(0, 1)[0].trim();
		// create a string from the rest of the array
		const locationAndLineup = splitByParen.join("(");
		// get location and lineup
		let lineup = locationAndLineup.split(")");
		show.location = lineup.splice(0, 1)[0];
		show.lineup = lineup.join(")");
		shows.push(show);
	}
}

await processLineByLine();

fs.writeFile("../_data/shows.json", JSON.stringify(shows, null, 2), (err) => {
	// Checking for errors
	if (err) throw err;
});
