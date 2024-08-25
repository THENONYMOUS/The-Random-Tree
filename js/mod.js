let modInfo = {
	name: "The SymmeTree",
	id: "Ibetnoonehasthisidbutjusttomakesureheressomespamlsaiudlaasldiufdsadlghdjkcgjkggsaioeras",
	author: "Thenonymous",
	pointsName: "permutations",
	modFiles: ["layers.js", "layersSide.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "Groups",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1</h3><br>
		- Permutations<br>
		- Data<br>
		- Groups<br>`

let winText = `Congratulations!`

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

	let gain = new Decimal(0.25)
	
	gain = gain.mul(smartUpgradeEffect('d', 13))
	gain = gain.mul(smartUpgradeEffect('d', 23))
	gain = gain.mul(smartUpgradeEffect('d', 31))
	gain = gain.mul(smartUpgradeEffect('d', 34))
	gain = gain.mul(buyableEffect('d', 11))
	gain = gain.mul(smartUpgradeEffect('g', 12))

	gain = gain.mul(player.g.variables.variable1)
	if(hasUpgrade('g', 14)) gain = gain.mul(player.g.variables.variable1.root(2))

	return gain
}

// Function to implement custom parts of gameLoop()
function gameLoopExtension() {
	player.hardcap = findHardcap()
	player.points = player.points.min(player.hardcap)
}

// Point hardcap
function findHardcap() {
	let cap = new Decimal(1)

	cap = cap.mul(smartUpgradeEffect('d', 11))
	cap = cap.mul(smartUpgradeEffect('d', 12))
	cap = cap.mul(smartUpgradeEffect('d', 14))
	cap = cap.mul(tmp.g.effect.effect1)

	cap = cap.div(player.g.variables.variable1)

	return cap
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	hardcap: new Decimal(1)
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return "You stop finding permutations at " + format(player.hardcap) + " permutations"
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.d.points.gte(87)
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