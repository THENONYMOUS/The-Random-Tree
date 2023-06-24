addLayer("a", {
    name: "achievements",
    symbol: "A",
    position: 0,
    resource: "Achievements",
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFAA00",
    update(diff) {
        player.a.points = player.a.achievements.length
    },
    type: "none",
    row: "side",
    tabFormat: [
        ["display-text",
         function() {return "You Have "+formatWhole(new Decimal(player.a.achievements.length))+" Achievements"},
        ],
        "blank",
        "achievements",
    ],
    achievements: {
        11: {
            name: "Seeds",
            done() {return hasUpgrade('e', 12)},
            tooltip: "Unlock Void Seeds",
        },
        12: {
            name: "Unparalleled",
            done() {return hasUpgrade('e', 21)},
            tooltip: "Buy an Upgrade Unrelated to Parallel Universes",
        },
        13: {
            name: "Usual",
            done() {return hasUpgrade('e', 31)},
            tooltip: "Buy Something Normal",
        },
        14: {
            name: "Where did we get <i>these</i>",
            done() {return getBuyableAmount('e', 21).gte(9)},
            tooltip: "Purchase 9 Void Upgrades",
        },
        15: {
            name: "Fourth Dimension",
            done() {return hasUpgrade('e', 44)},
            tooltip: "Purchase 4 Rows of Existence Upgrades",
        },
    },
}),
addLayer("e", {
    name: "existence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        voidGrowth: new Decimal(0),
    }},
    color: "#AA00DD",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "existence", // Name of prestige currency
    baseResource: "growth", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 2,
    canBuyMax: true,
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= this.row) return;
        
        let keep = [];
        layerDataReset(this.layer, keep)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.div(smartUpgradeEffect('e', 24))
        return mult
    },
    update(diff) {
        if(hasUpgrade('e', 11)) player.e.voidGrowth = player.e.voidGrowth.add(tmp.e.growthGen.times(diff)).max(0)
    },
    growthGen() {
        let gain = smartUpgradeEffect('e', 11, new Decimal(0))
        gain = gain.times(buyableEffect('e', 11))
        return gain
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for Existence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text",
            function() {return hasUpgrade('e', 11) ? "You Have "+format(player.e.voidGrowth)+" Void Growth ("+format(tmp.e.growthGen)+"/sec), Multiplying Growth by "+format(player.e.voidGrowth.add(1).root(2)) : ""}
        ],
        "blank",
        "upgrades",
        "blank",
        "buyables",
        "blank"
    ],
    layerShown(){return true},
    upgradeAmount() {
        let upgrades = new Decimal(player.e.upgrades.length)
        upgrades = upgrades.add(getBuyableAmount('e', 21))
        return upgrades
    },
    upgrades: {
        11: {
            title: "Parallel Universe I",
            description: "Start Generation of <i>Void Growth</i>",
            cost: (new Decimal(1)),
            effect() {return player.e.points.max(0).add(1).root(2).div(10)},
            effectDisplay() {return "+"+format(upgradeEffect('e', 11))},
        },
        12: {
            title: "Parallel Universe II",
            description: "Unlock Void Seeds",
            cost: (new Decimal(3)),
        },
        13: {
            title: "Parallel Universe III",
            description: "Divide 'Void Seeds' Cost by it's Amount",
            cost: (new Decimal(6)),
            effect() {return getBuyableAmount('e', 11).max(0).add(1)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
        },
        14: {
            title: "Parallel Universe IV",
            description: "Multiply Growth by Existence",
            cost: (new Decimal(8)),
            effect() {return player.e.points.max(0).add(1)},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
        },
        21: {
            title: "Perpendicular Universe I",
            description() {return "Multiply Growth by "+format(smartUpgradeEffect('e', 31, new Decimal(0)).add(2))+" for Each Existence Upgrade"},
            cost: (new Decimal(12)),
            unlocked() {return hasUpgrade('e', 14)},
            effect() {return new Decimal(smartUpgradeEffect('e', 31, new Decimal(0)).add(2)).pow(upgradeAmount('e')).max(1)},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
        },
        22: {
            title: "Perpendicular Universe II",
            description: "Unlock Void Seedlings",
            cost: (new Decimal(18)),
            unlocked() {return hasUpgrade('e', 14)},
        },
        23: {
            title: "Perpendicular Universe III",
            description: "Divide 'Void Seeds' Cost by 'Void Seedlings' Amount, Weakened by it's own",
            cost: (new Decimal(25)),
            unlocked() {return hasUpgrade('e', 14)},
            effect() {return getBuyableAmount('e', 12).div(getBuyableAmount('e', 11).root(2)).max(0).add(1)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            tooltip: "(Seedlings / sqrt (Seeds)) + 1",
        },
        24: {
            title: "Perpendicular Universe IV",
            description: "Divide Existence Costs Based on Existence",
            cost: (new Decimal(28)),
            unlocked() {return hasUpgrade('e', 14)},
            effect() {return player.e.points.max(0).add(1).root(2).pow_base(2)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            tooltip: "2 ^ sqrt (Existence)",
        },
        31: {
            title: "Universe Parallel to the Normal Vector I",
            description: "Each Existence Upgrade Increases 'Perpendicular Universe I's Base by 0.05",
            cost: (new Decimal(37)),
            unlocked() {return hasUpgrade('e', 24)},
            effect() {return upgradeAmount('e').div(20).max(0)},
            effectDisplay() {return "+"+format(thisUpgradeEffect(this))},
        },
        32: {
            title: "Universe Parallel to the Normal Vector II",
            description: "Unlock Void Plants",
            cost: (new Decimal(42)),
            unlocked() {return hasUpgrade('e', 24)},
        },
        33: {
            title: "Universe Parallel to the Normal Vector III",
            description: "'Void Seedlings' Divide 'Void Plants' Costs",
            cost: (new Decimal(50)),
            unlocked() {return hasUpgrade('e', 24)},
            effect() {return getBuyableAmount('e', 12).max(0).add(1).root(1.5)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
        },
        34: {
            title: "Universe Parallel to the Normal Vector IV",
            description: "Unlock Void Upgrades",
            cost: (new Decimal(54)),
            unlocked() {return hasUpgrade('e', 24)},
        },
        41: {
            title: "Universe Perpendicular to the Normal Vector I",
            description: "Void Seeds Gives Free Levels to Void Seedlings",
            cost: (new Decimal(77)),
            unlocked() {return hasUpgrade('e', 34)},
        },
        42: {
            title: "Universe Perpendicular to the Normal Vector II",
            description: "Divide Void Plants Cost by Existence Upgrades",
            cost: (new Decimal(92)),
            unlocked() {return hasUpgrade('e', 34)},
            effect() {return upgradeAmount('e').max(0).add(1)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
        },
        43: {
            title: "Universe Perpendicular to the Normal Vector III",
            description: "Divide Void Upgrades Cost based on Existence Upgrades",
            cost: (new Decimal(98)),
            unlocked() {return hasUpgrade('e', 34)},
            effect() {return upgradeAmount('e').max(0).add(1).root(20/9)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            tooltip: "(20/9)rt Upgrades",
        },
        44: {
            title: "Universe Perpendicular to the Normal Vector IV",
            description: "Coming Soon...",
            cost: (new Decimal(117)),
            unlocked() {return hasUpgrade('e', 34)},
        },
    },
    buyables: {
        11: {
            title: "Void Seeds",
            cost(x) {
                let cost = new Decimal(x).pow_base(2)
                cost = cost.div(smartUpgradeEffect('e', 13))
                cost = cost.div(smartUpgradeEffect('e', 23))
                cost = cost.div(buyableEffect('e', 13))
                return cost.ceil()
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Void Growth by 2", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 12)},
            effect() {return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 2 ^ x<br>Cost Formula: 2 ^ x":"Currently: x"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        12: {
            title: "Void Seedlings",
            cost(x) {
                let cost = new Decimal(x).root(2).pow_base(10).root(2)
                cost = cost.div(buyableEffect('e', 13))
                cost = cost.ceil()
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Growth by 1.5", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 22)},
            effect() {
                let amount = getBuyableAmount(this.layer, this.id)
                if(hasUpgrade('e', 41)) amount = amount.add(getBuyableAmount('e', 11))
                return new Decimal(1.5).pow(amount)
            },
            tooltip() {return shiftDown?"Effect Formula: 1.5 ^ x<br>Cost Formula: sqrt (10 ^ sqrt (x))":"Currently: x"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        13: {
            title: "Void Plants",
            cost(x) {
                let cost = new Decimal(x).root(1.5).pow_base(10).root(1.5)
                cost = cost.div(smartUpgradeEffect('e', 33))
                cost = cost.div(smartUpgradeEffect('e', 42))
                cost = cost.ceil()
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Divide Previous Buyable Costs Based on a Formula ", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 32)},
            effect() {return new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id).root(2))},
            tooltip() {return shiftDown?"Effect Formula: 1.5 ^ sqrt(x)<br>Cost Formula: 10 ^ sqrt (x)":"Currently: ÷"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        21: {
            title: "Void Upgrades",
            cost(x) {
                let cost = new Decimal(x).root(1.5).pow_base(5).root(1.5)
                cost = cost.div(smartUpgradeEffect('e', 43))
                cost = cost.ceil()
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Gain the Effect of 1 Free Upgrade", this)},
            style: {
                height: "100px",
                width: "625px",
                borderRadius: "10%",
            },
            buy() {
                player.e.points = player.e.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 34)},
        },
    },
})
