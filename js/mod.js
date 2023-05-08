let modInfo = {
	name: "The Thenonymous Tree",
	id: "thenonymous-thethenonymoustree9276",
	author: "Thenonymous",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3",
	name: "Probably not Nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3</h3><br>
		- Added new layer.<br>
		- Added 2 total rows of Upgrades.<br>
		- New Challenge.<br>
	<h3>v0.2</h3><br>
		- Finished 1st row of Prestige Upgrades.<br>
		- Added new Layer.<br>
	<h3>v0.1</h3><br>
		- Added a single upgrade.<br>
		- Changed color of 'prestige'.`

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

	let gain = new Decimal(0)
	if(hasUpgrade('p', 11)) gain=gain.add(upgradeEffect('p', 11))
	if(hasUpgrade('p', 13)) gain=gain.times(upgradeEffect('p', 13))
	if(hasUpgrade('p', 14)) gain=gain.times(1.5)
	if(hasUpgrade('e', 12)) gain=gain.times(tmp.e.effect)
	if(hasUpgrade('e', 13)) gain=gain.times(upgradeEffect('e', 13))
	if(hasChallenge('p', 11)) gain=gain.times(1.5)
	return gain
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
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}