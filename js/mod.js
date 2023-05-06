let modInfo = {
	name: "The Challenge Tree",
	id: "thechallengetree491501495",
	author: "Thenonymous",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Challenges.",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added cool stuff.`

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

	let gain = new Decimal(5)
	gain = gain.add(new Decimal(challengeCompletions('cp', 11)).times(5))
	if (inChallenge('cp', 13)) gain = new Decimal(1)
	gain = gain.times(player.cp.points.times(new Decimal(challengeCompletions('cp', 12))).add(1).pow(new Decimal(0.3).add(new Decimal(challengeCompletions('cp', 12)).times(0.02))))
	gain = gain.times(player.points.add(1).pow(new Decimal(challengeCompletions('cp', 13)).times(0.03)))
	gain = gain.times(challengeCompletions('cp', 14)+1)
	gain = gain.times(new Decimal(2).pow(player.p.points))
	gain = gain.times(player.sd.points.add(1).pow(0.5))
	if (inChallenge('cp', 14)) gain = gain.dividedBy((challengeCompletions('cp', 14)+1)*2)
	if (inChallenge('cp', 12)) gain = gain.dividedBy(player.points.add(1).pow(0.5))
	if (inChallenge('cp', 21)) gain = gain.pow(0.1).dividedBy(10)
	if (inChallenge('sd', 11)) gain = gain.pow(0.5).dividedBy(2)
	return new Decimal(gain)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
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
	return(60) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}