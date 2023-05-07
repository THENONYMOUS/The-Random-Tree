addLayer("s", {
    name: "Sofia Tokens", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#B0B0FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Sofia Tokens", // Name of prestige currency
    baseResource: "snow", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    autoUpgrade() {return hasMilestone('f', 1)},
    passiveGeneration() {if(hasMilestone('f', 2)){return 0.25}
                    else{return 0}},
    softcap: (new Decimal(1000)),
    softcapPower: (new Decimal(0.5)),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('s', 14)) mult=mult.times(upgradeEffect('s', 14))
        if(hasUpgrade('s', 23)) mult=mult.times(upgradeEffect('s', 23))
        if(hasUpgrade('s', 32)) mult=mult.times(upgradeEffect('s', 32))
        mult=mult.times(getBuyableAmount('f', 11).add(1))
        mult=mult.time(player.w.points.add(1).pow(0.5))
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
            description: "Multiply upgrade 1 effect based on snow",
            cost: (new Decimal(5)),
            effect() {return player.points.add(1).times(2).pow(0.2).pow(upgradeEffect('s', 33))},
            effectDisplay() {return "x"+format(upgradeEffect('s', 12))},
        },
        13: {
            description: "Multiply snow gain by 2",
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
                    return upgradeEffect('s', 11).times(0.5).times(upgradeEffect('s', 22))}
                else {
                    return upgradeEffect('s', 11).times(0.5)}},
            effectDisplay() {return "+"+format(upgradeEffect('s', 21))},
        },
        22: {
            description: "Multiply Upgrade 2-1 (row 2 Column 1) based on Sofia Tokens",
            cost: (new Decimal(1000)),
            unlocked() {return hasMilestone('s', 0)},
            effect() {return player.s.points.add(1).pow(0.2)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 22))},
        },
        23: {
            description: "Multiply Sofia Token gain based on Snow",
            cost: (new Decimal(1500)),
            unlocked() {return hasMilestone('s', 0)},
            effect() {return player.points.add(1).pow(0.1)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 23))},
        },
        24: {
            description: "Unlock a new layer (Step 1/2)",
            cost: (new Decimal(2500)),
            unlocked() {return hasMilestone('s', 0)},
        },
        31: {
            title: "Gift:",
            description: "Multiply snow gain by 2",
            cost: (new Decimal(0)),
            unlocked() {return hasMilestone('f', 0)},
        },
        32: {
            description: "Food effect applies to Sofia Tokens",
            cost: (new Decimal(30)),
            unlocked() {return hasMilestone('f', 0)},
            effect() {return player.f.points.add(1).pow(0.5)},
            effectDisplay() {return "x"+format(upgradeEffect('s', 32))},
        },
        33: {
            description: "Boost Upgrade 1-2 Effect ^1.1",
            cost: (new Decimal(3000)),
            unlocked() {return hasMilestone('f', 0)},
            effect() {if(hasUpgrade('s', 33)) {return 1.1}
        else {return 1}},
        },
        34: {
            description: "Unlock a challenge (in food layer)",
            cost: (new Decimal(5000)),
            unlocked() {return hasMilestone('f', 0)},
        },
    },
    milestones: {
        0: {
            requirementDescription: "5,000 Snow",
            effectDescription: "Unlock row 2 Sofia Token upgrades",
            unlocked() {return hasUpgrade('s', 14)&&!inChallenge('f', 11)},
            done() {return player.points.gte(5000)&&hasUpgrade('s', 14)&&!inChallenge('f', 11)},
        },
        1: {
            requirementDescription: "50,000 Snow",
            effectDescription: "Unlock a new layer (Step 2/2)",
            unlocked() {return hasUpgrade('s', 24)},
            done() {return player.points.gte(50000)&&hasUpgrade('s', 24)},
        },
    },
}),
addLayer("f", {
    name: "Food", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#DD0000",
    requires: new Decimal(3000), // Can be a function that takes requirement increases into account
    resource: "Meat Boxes", // Name of prestige currency
    baseResource: "Sofia Tokens", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    effect() {return player.f.points.add(1).pow(0.5)},
    effectDescription() {return "Multiplies snow gain by x"+format(player.f.points.add(1).pow(0.5))},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset to gain Meat Boxes", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return hasMilestone('s', 1)||player.f.best.gte(1)}},
    ],
    layerShown(){return hasMilestone('s', 1)||hasMilestone('f', 0)},

    milestones: {
        0: {
            requirementDescription: "1 Meat Box",
            effectDescription: "Unlock a new row of Sofia Token upgrades",
            done() {return player.f.points.gte(1)},
        },
        1: {
            requirementDescription: "3 Meat Boxes",
            effectDescription: "Auto-buy Sofia Token upgrades",
            done() {return player.f.points.gte(3)},
        },
        2: {
            requirementDescription: "10 Meat Boxes",
            effectDescription: "Gain 25% of Sofia Tokens gained every second",
            done() {return player.f.points.gte(10)},
        },
        3: {
            requirementDescription: "5 Buyable Purchases",
            effectDescription: "Unlock a new layer",
            unlocked() {return hasChallenge('f', 11)},
            done() {return getBuyableAmount('f', 11).gte(5)},
        },
    },
    challenges: {
        11: {
            name: "Stuck",
            challengeDescription: "You can't buy row 2 upgrades",
            goalDescription: "Buy the Challenge Unlock again",
            rewardDescription() {return "Multiply point gain by Food and unlocks a buyable. Currently: "+format(player.f.points.add(1).pow(0.25))},
            unlocked() {return hasUpgrade('s', 34)||hasChallenge('f', 11)||inChallenge('f', 11)},
            canComplete() {return hasUpgrade('s', 34)},
        },
    },
    buyables: {
        11: {
            cost(x) {return new Decimal(2).pow(x)},
            display() {return "Multiply Sofia Token gain by Amount+1. Cost: "+format(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))+". Amount: "+format(getBuyableAmount(this.layer, this.id))},
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasChallenge('f', 11)},
        },
    }
}),
addLayer("w", {
    name: "Walks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#5050FF",
    requires: new Decimal(3000), // Can be a function that takes requirement increases into account
    resource: "Walks", // Name of prestige currency
    baseResource: "Snow", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    effect() {return player.w.points.add(1).pow(0.5)},
    effectDescription() {return "Multiplies Sofia Token gain by x"+format(player.w.points.add(1).pow(0.5))},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "w", description: "W: Reset to gain Walks", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return hasMilestone('f', 3)||player.w.best.gte(1)}},
    ],
    layerShown(){return hasMilestone('f', 3)||hasMilestone('w', 0)},

    milestones: {
        0: {
            requirementDescription: "1 Walk",
            effectDescription: "Keep Walks Unlocked",
            done() {return player.w.points.gte(1)}
        }
    }
})