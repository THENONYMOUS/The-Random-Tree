addLayer("cp", {
    name: "Challenge Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#D07A05",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "Challenge Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "c", description: "C: Reset for Challenge Points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },
    challenges: {
        11: {
            name: "The First Challenge",
            challengeDescription: "No nerfs, just reach the goal",
            completionLimit: (5),
            rewardDescription() {return "+5 to base point gain per completion ("+format(challengeCompletions('cp', 11))+"/5)"},
            goalDescription() {return "Reach "+format (new Decimal(50).times(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 11)))))+" points"},
            canComplete() {return player.points.gte(new Decimal(50).times(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 11)))))},
        },
        12: {
            name: "The First Real Challenge",
            challengeDescription: "Divide Point gain by points^0.5",
            completionLimit: (5),
            rewardDescription() {return "x"+format(player.cp.points.times(new Decimal(challengeCompletions('cp', 12))).add(1).pow(0.5))+" point gain ("+format(challengeCompletions('cp', 12))+"/5)"},
            goalDescription() {return "Reach "+format(new Decimal(25).times(new Decimal(2).pow(new Decimal(challengeCompletions('cp', 12)))))+" points"},
            canComplete() {return player.points.gte(new Decimal(25).times(new Decimal(2).pow(new Decimal(challengeCompletions('cp', 12)))))},
        },
    }
})