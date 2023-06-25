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
        21: {
            name: "Rebirth, Redeath.",
            done() {return player.al.points.gte(2)},
            tooltip: "Reach the Afterlife After Already Reaching the Afterlife",
        },
        22: {
            name: "There is a Small Patch Missing From The Feild",
            done() {return getBuyableAmount('al', 13).gte(1)},
            tooltip: "Buy 'Kronos Flowers'",
        },
        23: {
            name: "The Cycle",
            done() {return getBuyableAmount('al', 21).gte(10)},
            tooltip: "Purchase 'Kronos Seeds' 10 Times",
        },
        24: {
            name: "Fifth Dimension?",
            done() {return hasUpgrade('e', 15)},
            tooltip: "Purchase an Existence Upgrade in the 5th Column",
        },
        25: {
            name: "Dimensional Shift",
            done() {return hasAchievement('al', 15)},
            tooltip: "Have 10 Afterlives",
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
    resource: "Existence", // Name of prestige currency
    baseResource: "growth", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    autoPrestige() {return hasMilestone('al', 4)},
    resetsNothing() {return hasMilestone('al', 4)},
    base() {
        let base = new Decimal(1)
        base = base.mul(smartUpgradeEffect('al', 15))
        return base.add(1)
    },
    canBuyMax: true,
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= this.row) return;
        
        let keep = [];
        if(hasMilestone('al', 4)) keep.push("upgrades")
        layerDataReset(this.layer, keep)
        if(hasMilestone('al', 0)) player.e.upgrades.push(14, 24, 34, 44)
        if(hasMilestone('al', 1)) player.e.upgrades.push(13, 23, 33, 43)
        if(hasMilestone('al', 2)) player.e.upgrades.push(12, 22, 32, 42)
        if(hasMilestone('al', 3)) player.e.upgrades.push(11, 21, 31, 41)
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
        gain = gain.times(player.al.kronosFlowers.max(0).add(1).pow(0.5))
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
            function() {return hasUpgrade('e', 11) ? "You Have "+format(player.e.voidGrowth)+" Void Growth ["+format(tmp.e.growthGen)+"/sec], Multiplying Growth by "+format(player.e.voidGrowth.add(1).root(2)) : ""}
        ],
        ["display-text", () => "You Have "+formatWhole(upgradeAmount('e'))+" Existence Upgrades"],
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
        upgrades = upgrades.times(buyableEffect('al', 13))
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
            effect() {return getBuyableAmount('e', 12).max(1).div(getBuyableAmount('e', 11).max(1).root(2)).max(0).add(1)},
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
            description: "Unlock the Afterlife",
            cost: (new Decimal(117)),
            unlocked() {return hasUpgrade('e', 34)},
        },
        15: {
            title: "Parallel Universe V",
            description: "Multiply Flower Gain Based on Existence Upgrades",
            cost: (new Decimal(530)),
            unlocked() {return hasMilestone('al', 4)},
            effect() {return upgradeAmount('e').max(0).add(1).root(2)},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
            tooltip: "sqrt Upgrades",
        },
        25: {
            title: "Perpendicular Universe V",
            description: "'Void Plants' Affects 'Void Upgrades' at a Reduced Rate",
            cost: (new Decimal(1912)),
            unlocked() {return hasMilestone('al', 4)},
            effect() {return buyableEffect('e', 13).max(1).add(1).pow(2).log(2)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            tooltip: "log2 (Effect ^ 2)",
        },
        35: {
            title: "Universe Parallel to the Normal Vector V",
            description: "Multiply Flower Gain Based on the Cheapest Kronos Buyable's Cost",
            cost: (new Decimal(2150)),
            unlocked() {return hasMilestone('al', 4)},
            effect() {return buyableCost('al', 11).min(buyableCost('al', 12)).min(buyableCost('al', 13)).min(buyableCost('al', 21)).max(1).add(1).log(2).root(2)},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
            tooltip: "sqrt log2 Cost",
        },
        45: {
            title: "Universe Perpendicular to the Normal Vector V",
            description: "Increase Kronos Stems Effect Base Based on the Most Expensive Kronos Buyable's Cost",
            cost: (new Decimal(2823)),
            unlocked() {return hasMilestone('al', 4)},
            effect() {return buyableCost('al', 11).max(buyableCost('al', 12)).max(buyableCost('al', 13)).max(buyableCost('al', 21)).max(0).log(7.5).root(7.5).max(1).log(7.5)},
            effectDisplay() {return "+"+format(thisUpgradeEffect(this))},
            tooltip: "log7.5 7.5rt log7.5 Cost",
        },
    },
    buyables: {
        11: {
            title: "Void Seeds",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).pow_base(2)
                cost = cost.div(smartUpgradeEffect('e', 13))
                cost = cost.div(smartUpgradeEffect('e', 23))
                cost = cost.div(buyableEffect('e', 13))
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Void Growth by 2", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 12)},
            effect() {return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 2 ^ x<br>Cost Formula: 2 ^ x":"Currently: x"+format(thisBuyableEffect(this))+". Shift for Details"},
            buyMax() {
                let max = player.e.points.div(this.cost(0)).log(2)
                max = max.add(1).floor()
                if(max.gt(thisBuyableAmount(this))) setBuyableAmount(this.layer, this.id, max)
            },
        },
        12: {
            title: "Void Seedlings",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).root(2).pow_base(10).root(2)
                cost = cost.div(buyableEffect('e', 13))
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Growth by 1.5", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 22)},
            effect() {
                let amount = getBuyableAmount(this.layer, this.id)
                if(hasUpgrade('e', 41)) amount = amount.add(getBuyableAmount('e', 11))
                return new Decimal(1.5).pow(amount)
            },
            tooltip() {return shiftDown?"Effect Formula: 1.5 ^ x<br>Cost Formula: sqrt (10 ^ sqrt (x))":"Currently: x"+format(thisBuyableEffect(this))+". Shift for Details"},
            buyMax() {
                let max = player.e.points.div(this.cost(0)).pow(2).log(10).pow(2)
                max = max.add(1).floor()
                if(max.gte(thisBuyableAmount(this))) setBuyableAmount(this.layer, this.id, max)
            },
        },
        13: {
            title: "Void Plants",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).root(1.5).pow_base(10).root(1.5)
                cost = cost.div(smartUpgradeEffect('e', 33))
                cost = cost.div(smartUpgradeEffect('e', 42))
                cost = cost.div(smartUpgradeEffect('al', 13))
                return cost
                },
            canAfford() {return player.e.points.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Divide Previous Buyable Costs Based on a Formula ", this)},
            buy() {
                player.e.points = player.e.points.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 32)},
            effect() {return new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id).root(2))},
            tooltip() {return shiftDown?"Effect Formula: 1.5 ^ sqrt(x)<br>Cost Formula: 10 ^ sqrt (x)":"Currently: ÷"+format(thisBuyableEffect(this))+". Shift for Details"},
            buyMax() {
                let max = player.e.points.div(this.cost(0)).pow(1.5).log(10).pow(1.5)
                max = max.add(1).floor()
                if(max.gte(thisBuyableAmount(this))) setBuyableAmount(this.layer, this.id, max)
            },
        },
        21: {
            title: "Void Upgrades",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).root(1.5).pow_base(5).root(1.5)
                cost = cost.div(smartUpgradeEffect('e', 43))
                cost = cost.div(smartUpgradeEffect('al', 12))
                cost = cost.div(smartUpgradeEffect('al', 14))
                cost = cost.div(buyableEffect('al', 12))
                cost = cost.div(smartUpgradeEffect('e', 25))
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
                player.e.points = player.e.points.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('e', 34)},
            tooltip: "Cost Formula: 1.5rt (5 ^ 1.5rt (x))",
            buyMax() {
                let max = player.e.points.div(this.cost(0)).pow(1.5).log(5).pow(1.5)
                max = max.add(1).floor()
                if(max.gte(thisBuyableAmount(this))) setBuyableAmount(this.layer, this.id, max)
            },
        },
    },
}),
addLayer("al", {
    name: "Afterlife", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        kronosFlowers: new Decimal(0),
        kronosFlowersGain: new Decimal(0),
    }},
    color: "#FFAA00",
    requires: new Decimal(120), // Can be a function that takes requirement increases into account
    resource: "Afterlives", // Name of prestige currency
    baseResource: "existence", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.25, // Prestige currency exponent
    base: 1.25,
    canBuyMax: true,
    roundUpCost: true,
    branches: ['e'],
    automate() {
        if(hasAchievement('al', 11)) buyMaxBuyable('e', 11)
        if(hasAchievement('al', 12)) buyMaxBuyable('e', 12)
        if(hasAchievement('al', 13)) buyMaxBuyable('e', 13)
        if(hasAchievement('al', 14)) buyMaxBuyable('e', 21)
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= this.row) return;
        
        let keep = [];
        layerDataReset(this.layer, keep)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    update(diff) {
        let gain = new Decimal(0)
        if(hasMilestone('al', 0)) gain = gain.add(player.al.points.max(0).add(1).pow(2))
        gain = gain.times(smartUpgradeEffect('al', 13))
        gain = gain.times(buyableEffect('al', 11))
        gain = gain.times(smartUpgradeEffect('e', 15))
        gain = gain.times(smartUpgradeEffect('e', 35))
        player.al.kronosFlowers = player.al.kronosFlowers.add(gain.times(diff)).max(0)
        player.al.kronosFlowersGain = gain
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Afterlives", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[this.layer].layerShown},},
    ],
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
                "achievements",
                "blank",
            ],
        },
        "Kronos": {
            content: [
                ["display-text", () => "<font size = +1>Kronos</font>, the World of Flowers."],
                "blank",
                ["display-text", () => "You Have "+format(player.al.kronosFlowers)+" Flowers ["+format(player.al.kronosFlowersGain)+"/s]"],
                ["display-text", () => "Your Flowers are Multiplying Void Growth by "+format(player.al.kronosFlowers.max(0).add(1).pow(0.5))],
                "blank",
                ["upgrades", [1]],
                "blank",
                ["buyables", [1, 2]],
                "blank",
            ],
            unlocked() {return hasMilestone('al', 0)},
        },
    },
    layerShown(){return hasUpgrade('e', 44) || player.al.best.gte(1)},
    upgradeAmount() {
        let upgrades = new Decimal(player.e.upgrades.length)
        return upgrades
    },
    milestones: {
        0: {
            requirementDescription: "1 Afterlife",
            effectDescription: "Unlock Kronos and Keep the 4th Column of Existence Upgrades",
            done() {return player.al.points.gte(1)},
        },
        1: {
            requirementDescription: "2 Afterlives",
            effectDescription: "Keep the 3rd Column of Existence Upgrades",
            done() {return player.al.points.gte(2)},
        },
        2: {
            requirementDescription: "3 Afterlives",
            effectDescription: "Unlock Kronos Buyables and Keep the 2nd Column of Existence Upgrades",
            done() {return player.al.points.gte(3)},
        },
        3: {
            requirementDescription: "4 Afterlives",
            effectDescription: "Kronos Buyable Costs are Halved, Unlock a New One and Keep the 1st Column of Existence Upgrades",
            done() {return player.al.points.gte(4)},
        },
        4: {
            requirementDescription: "5 Afterlives",
            effectDescription: "Autoreset for Existence, it Resets Nothing and Unlock a New Column of Existence Upgrades, Kept on Afterlife",
            done() {return player.al.points.gte(5)},
        },
    },
    achievements: {
        11: {
            name: "6 Afterlives",
            done() {return player.al.points.gte(6)},
            tooltip: "Auto-Buy 'Void Seeds'",
        },
        12: {
            name: "7 Afterlives",
            done() {return player.al.points.gte(7)},
            tooltip: "Auto-Buy 'Void Seedlings'",
        },
        13: {
            name: "8 Afterlives",
            done() {return player.al.points.gte(8)},
            tooltip: "Auto-Buy 'Void Plants'",
        },
        14: {
            name: "9 Afterlives",
            done() {return player.al.points.gte(9)},
            tooltip: "Auto-Buy 'Void Upgrades'",
        },
        15: {
            name: "10 Afterlives",
            done() {return player.al.points.gte(10)},
            tooltip: "Coming Soon... (Unlocks a New Afterlife)",
        },
    },
    upgrades: {
        11: {
            title: "",
            description: "Multiply Growth Based on Existence Upgrades",
            cost: (new Decimal(1000)),
            effect() {return upgradeAmount('e').max(0).add(1).root(2).pow_base(5)},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
            tooltip: "5 ^ sqrt Upgrades",
            currencyLayer: "al",
            currencyDisplayName: "Flowers",
            currencyInternalName: "kronosFlowers",
        },
        12: {
            title: "",
            description: "Divide 'Void Upgrades' Cost Based on Void Growth",
            cost: (new Decimal(137)),
            effect() {return player.e.voidGrowth.max(100).log(2500)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            tooltip: "log2500 (Void Growth)",
            currencyLayer: "e",
            currencyDisplayName: "Existence",
            currencyInternalName: "points",
        },
        13: {
            title: "",
            description: "Divide 'Void Plants' Cost and Multiply Flower Gain Based on Flowers",
            cost: (new Decimal(4250)),
            effect() {return player.al.kronosFlowers.max(2).log(2).root(2)},
            effectDisplay() {return "÷/×"+format(thisUpgradeEffect(this))},
            tooltip: "sqrt log2 (Flowers)",
            currencyLayer: "al",
            currencyDisplayName: "Flowers",
            currencyInternalName: "kronosFlowers",
        },
        14: {
            title: "",
            description: "Divide 'Void Upgrades' Cost by Afterlives",
            cost: (new Decimal(156)),
            effect() {return player.al.points.add(1)},
            effectDisplay() {return "÷"+format(thisUpgradeEffect(this))},
            currencyLayer: "e",
            currencyDisplayName: "Existence",
            currencyInternalName: "points",
        },
        15: {
            title: "",
            description: "Multiply Existence Cost Base by 0.82",
            cost: (new Decimal(10000)),
            effect() {return 0.82},
            effectDisplay() {return "×"+format(thisUpgradeEffect(this))},
            currencyLayer: "al",
            currencyDisplayName: "Flowers",
            currencyInternalName: "kronosFlowers",
        },
    },
    buyables: {
        11: {
            title: "Kronos Stems",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).root(2).pow_base(250)
                cost = cost.pow(new Decimal(x).max(25).div(25))
                if(hasMilestone('al', 3)) cost = cost.div(2)
                return cost
                },
            canAfford() {return player.al.kronosFlowers.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Flower Gain by "+format(new Decimal(2).add(smartUpgradeEffect('e', 45, 0))), this)},
            buy() {
                player.al.kronosFlowers = player.al.kronosFlowers.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasMilestone('al', 2)},
            effect() {return new Decimal(2).add(smartUpgradeEffect('e', 45, 0)).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 2 ^ x<br>Cost Formula: 250 ^ sqrt (x)"+(thisBuyableAmount(this).gte(25)?", Scales Faster Above 25":""):"Currently: ×"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        12: {
            title: "Kronos Buds",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).add(1).root(1.5).pow_base(500)
                cost = cost.pow(new Decimal(x).max(25).div(25))
                if(hasMilestone('al', 3)) cost = cost.div(2)
                return cost
                },
            canAfford() {return player.al.kronosFlowers.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Divide 'Void Upgrades' Cost by 2", this)},
            buy() {
                player.al.kronosFlowers = player.al.kronosFlowers.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasMilestone('al', 2)},
            effect() {return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 2 ^ x<br>Cost Formula: 500 ^ 1.5rt (x)"+(thisBuyableAmount(this).gte(25)?", Scales Faster Above 25":""):"Currently: ÷"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        13: {
            title: "Kronos Flowers",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).add(2).root(1.25).pow_base(1000)
                cost = cost.pow(new Decimal(x).max(25).div(25))
                if(hasMilestone('al', 3)) cost = cost.div(2)
                return cost
                },
            canAfford() {return player.al.kronosFlowers.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Existence Upgrades by 1.1", this)},
            buy() {
                player.al.kronosFlowers = player.al.kronosFlowers.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasMilestone('al', 2)},
            effect() {return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 1.1 ^ x<br>Cost Formula: 1,000 ^ 1.25rt (x)"+(thisBuyableAmount(this).gte(25)?", Scales Faster Above 25":""):"Currently: ×"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
        21: {
            title: "Kronos Seeds",
            cost(x=thisBuyableAmount(this)) {
                let cost = new Decimal(x).add(3).root(3).pow_base(1000)
                cost = cost.pow(new Decimal(x).max(25).div(25))
                if(hasMilestone('al', 3)) cost = cost.div(2)
                return cost
                },
            canAfford() {return player.al.kronosFlowers.gte(this.cost())},
            display() {return autoThisBuyableDisplay("Multiply Growth by 10", this)},
            buy() {
                player.al.kronosFlowers = player.al.kronosFlowers.sub(this.cost().ceil()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasMilestone('al', 3)},
            effect() {return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))},
            tooltip() {return shiftDown?"Effect Formula: 10 ^ x<br>Cost Formula: 1,000 ^ 3rt (x)"+(thisBuyableAmount(this).gte(25)?", Scales Faster Above 25":""):"Currently: ×"+format(thisBuyableEffect(this))+". Shift for Details"},
        },
    },
})