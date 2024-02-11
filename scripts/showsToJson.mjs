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
		// Each line in input.txt will be successively available here as `line`.
		const day = line.slice(0, 2);
		const theRest = line.slice(2);
		// if it is not a number, then it's a month / year
		if (isNaN(day)) {
			show.monthYear = line;
			shows.push(show);
			monthYear = line;
			continue;
		}
		const epoch = Date.parse(`${day} ${monthYear}`);
		const splitByParen = theRest.split("(");
		show.epoch = epoch;
		show.venue = splitByParen[0].trim();
		show.location = splitByParen[1].split(")")[0];
		show.lineup = splitByParen[1].split(")")[1];
		shows.push(show);
	}
}

await processLineByLine();
//console.log("shows", shows);

fs.writeFile("../assets/json/shows.json", JSON.stringify(shows), (err) => {
	// Checking for errors
	if (err) throw err;
});
