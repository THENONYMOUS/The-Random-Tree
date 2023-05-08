addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#7A7AFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(2)
        if(hasUpgrade('e', 11)) mult=mult.times(upgradeEffect('e', 11))
        if(hasUpgrade('p', 21)) mult=mult.times(upgradeEffect('p', 21))
        if(hasUpgrade('p', 22)) mult=mult.times(upgradeEffect('p', 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            description: "Generate 2 Points every second",
            cost: (new Decimal(1)),
            effect() {return new Decimal(2)},
            effectDisplay() {return "+"+format(upgradeEffect('p', 11))},
        },
        12: {
            description: "Previous upgrade is multiplied by 2",
            cost: (new Decimal(3)),
            unlocked() {return hasUpgrade('p', 11)},
            effect() {if(hasUpgrade('p', 12)) {return 2}
            else{return 1}},
            effectDisplay() {return "x"+format(upgradeEffect('p', 12))},
        },
        13: {
            description: "Multiply Point gain by prestige points",
            cost: (new Decimal(5)),
            unlocked() {return hasUpgrade('p', 12)},
            effect() {return player.p.points.add(1).pow(0.5)},
            effectDisplay() {return "x"+format(upgradeEffect('p', 13))},
            tooltip: "(Prestige points + 1)^0.5",
        },
        14: {
            description: "Unlock a new layer and point gain increased by 50%",
            cost: (new Decimal(20)),
            unlocked() {return hasUpgrade('p', 13)},
        },
        21: {
            description: "Points multiply prestige point gain",
            cost: (new Decimal(100)),
            unlocked() {return hasUpgrade('e', 14)},
            effect() {return player.points.add(1).pow(0.1)},
            effectDisplay() {return "x"+format(upgradeEffect('p', 21))},
            tooltip: "(Points + 1)^0.1",
        },
        22: {
            description: "Expansion effect affects Prestige points at a reduced rate",
            cost: (new Decimal(1000)),
            unlocked() {return hasUpgrade('p', 21)},
            effect() {return (tmp.e.effect).pow(0.3)},
            effectDisplay() {return "x"+format(upgradeEffect('p', 22))},
            tooltip: "Effect ^0.3",
        },
    },
}),
addLayer("e", {
    name: "Expansion", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#E9FF57",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Expansion points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: new Decimal(5),
    exponent: 1, // Prestige currency exponent
    canBuyMax() {return hasUpgrade('e', 14)},
    effect() {if(hasUpgrade('e', 12)) {
        return new Decimal(2).pow(player.e.points.add(1))
    } else {
        return 1
    }},
    effectDescription() {return "Expansions are multiplying point gain by x"+format(tmp.e.effect)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for Expansion points", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[layer].layerShown;}},
    ],
    layerShown(){return hasUpgrade('p', 14)||player[this.layer].best.gte(1)},
    upgrades: {
        11: {
            description: "Gain 50% more Prestige points",
            cost: (new Decimal(1)),
            effect() {return 1.5},
            effectDisplay() {return "x"+format(upgradeEffect('e', 11))},
        },
        12: {
            description: "Unlock Expansion effect",
            cost: (new Decimal(1)),
            unlocked() {return hasUpgrade('e', 11)},
            tooltip: "2^(Expansion points + 1)",
        },
        13: {
            description: "Points boost their own gain",
            cost: (new Decimal(3)),
            unlocked() {return hasUpgrade('e', 12)},
            effect() {return player.points.add(1).pow(0.3)},
            effectDisplay() {return "x"+format(upgradeEffect('e', 13))},
            tooltip: "(Points + 1)^0.3",
        },
        14: {
            description: "You can buy max Expansion points and unlock a new row of prestige upgrades",
            cost: (new Decimal(5)),
            unlocked() {return hasUpgrade('e', 13)},
        },
    },
})
