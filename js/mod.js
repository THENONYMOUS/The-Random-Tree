let modInfo = {
	name: "Intreegue",
	id: "yoyoyo-its-thenonymous-with-the-booster-tree!-skull-emoji-hahaidobemakintheiduniquetho-yhhypojojveorhvalksjdlajfhvejnnjjnfkjkjwr0438y349857",
	author: "Thenonymous",
	pointsName: "points",
	modFiles: ["junkyard.js", "basement.js", "extra.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "Boosters",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1</h3><br>
		- Added boosters.<br>
		- Added more boosters.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(tmp.b1.effect)
	gain = gain.mul(tmp.b2.effect)
	gain = gain.mul(tmp.b3.effect)
	gain = gain.mul(player.basementPoints.max(10).log(10))
	//gain = gain.mul(buyableEffect('j', 12))

	gain = gain.div("1e10").pow(player.points.max(1).log(10).div(20).min(1)).mul("1e10").min(gain)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	basementPoints: new Decimal(0),
}}

// Display extra things at the top of the page
var displayThings = [
	() => {return "Endgame is at <h2 style='color: #AAAAFF'>1e25</h2> points"},
	() => {return tmp.pointGen.gte("1e10") && player.points.lt("1e20") && player.points.gte("1e10") ? "Past 1e10 Points/sec your point gain is raised to "+format(player.points.max(1).log(10).div(20).min(1))+", this is effect weakens with more points" : null}
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}