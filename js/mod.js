let modInfo = {
	name: "The Plant Roots",
	id: "thenonymousmadethisidsoDON'Tcopythisthanksnowgoaway:3...btwit'scalledtheplantrootsifyouhaven'tseenalready",
	author: "Thenonymous",
	pointsName: "Evolution",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Thenonymous Forest",
	discordLink: "https://discord.gg/ffqTnDRQw8",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "Generations",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1: Generations</h3><br>
		- Added Generations, containing an upgrade tree.<br>
		- Added Mitochondria, a sub-section of Generations.`

let winText = `Congratulations! But how tf did you get here???`

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

	let gain = new Decimal(0.1)

	gain = gain.add(smartUpgradeEffect('ge', 21, 0))
	gain = gain.add(smartUpgradeEffect('ge', 22, 0))
	gain = gain.add(smartUpgradeEffect('ge', 81, 0))
	gain = gain.mul(smartUpgradeEffect('ge', 11))
	gain = gain.mul(smartUpgradeEffect('ge', 31))
	gain = gain.mul(smartUpgradeEffect('ge', 33))
	gain = gain.mul(smartUpgradeEffect('ge', 41))

	gain = gain.div(player.ge.points.pow(2).add(1))
	gain = gain.sub(player.ge.points.pow(2).div(100))
	return gain.max(0)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"You are playing The Plant Roots v1",
	function() {return hasUpgrade('ge', 101) ? "You are past endgame. Congratulations, but The Plant Roots does not have any content past this point." : "There's still more content to discover..."},
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