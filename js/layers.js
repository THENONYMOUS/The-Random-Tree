addLayer("s", {
    name: "Sofia Tokens", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Sofia Tokens", // Name of prestige currency
    baseResource: "snow", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('s', 14)) mult=mult.times(upgradeEffect('s', 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset to gain Sofia Tokens", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            description: "Generate snow, increases based on Sofia Tokens",
            cost: (new Decimal(1)),
            effect() {
                if(hasUpgrade('s', 12)){
                return player.s.points.add(1).pow(0.5).times(upgradeEffect('s', 12))}
            else {
                return player.s.points.add(1).pow(0.5)
            }},
            effectDisplay() {return "+"+format(upgradeEffect('s', 11))},
        },
        12: {
            description: "Multiply upgrade 1 effect based on points",
            cost: (new Decimal(5)),
            effect() {return player.points.add(1).times(2).pow(0.2)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 12))},
        },
        13: {
            description: "Multiply point gain by 2",
            cost: (new Decimal(10)),
            effect() {return 2},
            effectDisplay() {return "x2"},
        },
        14: {
            description: "Sofia Tokens multiply their own gain",
            cost: (new Decimal(25)),
            effect() {return player.s.points.add(1).pow(0.25)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 14))},
        },
        21: {
            description: "Generate more snow, affected by boosts to upgrade 1",
            cost: (new Decimal(100)),
            unlocked() {return hasMilestone('s', 0)},
            effect() {if(hasUpgrade('s', 22)) {
                    return upgradeEffect('s', 11).times(0.25).times(upgradeEffect('s', 22))}
                else {
                    return upgradeEffect('s', 11).times(0.25)}},
            effectDisplay() {return "+"+format(upgradeEffect('s', 21))},
        },
        22: {
            description: "Multiply Upgrade 2-1 (row 2 Column 1) based on Sofia Tokens",
            cost: (new Decimal(1000)),
            unlocked() {return hasMilestone('s', 0)},
            effect() {return player.s.points.add(1).pow(0.1)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 22))},
        },
    },
    milestones: {
        0: {
            requirementDescription: "5,000 Points",
            effectDescription: "Unlock row 2 Sofia Token upgrades",
            unlocked() {return hasUpgrade('s', 14)},
            done() {return player.points.gte(5000) && hasUpgrade('s', 14)},
        },
    }
})
