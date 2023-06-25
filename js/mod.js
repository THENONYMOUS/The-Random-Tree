let modInfo = {
	name: "The Plant Tree II",
	id: "thenonymous-theplanttreeii-493764283",
	author: "nobody",
	pointsName: "growth",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0.1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "Existence and the Afterlife",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1</h3><br>
		- Added Afterlife with 4 Upgrades, 5 Milestones, 4 Buyables and 5 Achievements.<br>
		- Added 4 Existence Upgrades.<br>
	<h3>v0.1</h3><br>
		- Added Existence with 16 Upgrades and 4 Buyables.<br>
		- Added Void Growth.`

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

	let gain = new Decimal(1/10)
    gain = gain.times(player.e.voidGrowth.add(1).root(2))
    gain = gain.times(smartUpgradeEffect('e', 14))
    gain = gain.times(smartUpgradeEffect('e', 21))
    gain = gain.times(buyableEffect('e', 12))
    gain = gain.times(smartUpgradeEffect('al', 11))
    gain = gain.times(buyableEffect('al', 21))
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
	return hasAchievement('al', 15)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(360) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}