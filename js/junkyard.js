addLayer("b1", {
    name: "booster 1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resetTime: 0,
    }},
    color: "#AA55FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "boosters (1)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 2,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasMilestone('b2', 2)) mult = mult.div(tmp.b2.effect.root(2))
        if(hasMilestone('b3', 2)) mult = mult.div(player.points.max(1).log(10).max(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    tree: "junkyard",
    doReset(resettingLayer) {
        let row = layers[resettingLayer].row
        let tree = layers[resettingLayer].tree
        if(row <= this.row || tree != this.tree) return;

        let keep = []
        layerDataReset(this.layer, keep)
    },
    hotkeys: [
        {key: "1", description: "1: Reset for boosters (1)", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[this.layer].layerShown}},
    ],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["milestones", [0, 1]],
        "blank",
        ["clickable", 11],
        ["milestones", [2, 3]],
    ],
    layerShown(){return true},
    autoPrestige() {return (hasMilestone('b2', 1) || hasMilestone('b3', 0)) && player.b1.resetTime >= 1},
    canBuyMax() {return hasMilestone('b3', 0)},
    effect() {
        let eff = player[this.layer].points.max(0).add(1)
        if(hasMilestone('b1', 0)) eff = eff.add(1).mul(4)
        if(hasMilestone('b1', 1)) eff = eff.pow(1.2).ceil()
        if(hasMilestone('b1', 2)) eff = eff.mul(4).pow(1.1).ceil()
        if(hasMilestone('b1', 3)) eff = eff.pow(1.3).ceil()
        if(hasMilestone('b2', 1)) eff = eff.mul(player.b2.points.max(0).add(1))
        if(hasMilestone('b2', 4)) eff = eff.pow(1.2).ceil()
        if(hasMilestone('b3', 0)) eff = eff.mul(player.b3.points.max(0).add(1))
        return eff.max(1)
    },
    milestonePopups() {return !player.b2.unlocked},
    effectDescription() {return "currently multiplying point gain by ×"+format(tmp[this.layer].effect)},
    milestones: {
        0: {
            requirementDescription: "4 Boosters (1)",
            effectDescription() {return "Booster (1) effect is increased by 1 and multiplied by 4"+(!hasMilestone(this.layer, this.id) ? ("<br>Next: ×"+format(tmp.b1.effect.add(1).mul(4))) : "" )},
            done() {return player.b1.points.gte(4)},
        },
        1: {
            requirementDescription: "7 Boosters (1)",
            effectDescription() {return "Booster (1) effect is powered by 1.2 and rounded up"+(!hasMilestone(this.layer, this.id) ? ("<br>Next: ×"+format(tmp.b1.effect.pow(1.2).ceil())) : "" )},
            done() {return player.b1.points.gte(7)},
        },

        2: {
            requirementDescription() {return getClickableState('b1', 11) ? "10 Boosters (1)" : "12 Boosters (1)"},
            effectDescription() {return "Booster (1) effect is multiplied by 4, powered by 1.1 and rounded up"+(!hasMilestone(this.layer, this.id) ? ("<br>Next: ≈×"+format(tmp.b1.effect.mul(4).pow(1.1).ceil())) : "" )},
            done() {return player.b1.points.gte(getClickableState('b1', 11) ? 10 : 12)},
        },
        3: {
            requirementDescription() {return getClickableState('b1', 11) ? "13 Boosters (1)" : "10 Boosters (1)"},
            effectDescription() {return "Booster (1) effect is powered by 1.3 and rounded up"+(!hasMilestone(this.layer, this.id) ? ("<br>Next: ×"+format(tmp.b1.effect.pow(1.3).ceil())) : "" )},
            done() {return player.b1.points.gte(getClickableState('b1', 11) ? 13 : 10)},
        },
    },
    clickables: {
        11: {
            canClick() {return !(hasMilestone('b1', 2) || hasMilestone('b1', 3))},
            onClick() {setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))},
            title: "Toggle next milestone",
        },
    },
})
addLayer("b2", {
    name: "booster 2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
    }},
    color: "#FFAA55",
    requires: new Decimal(16), // Can be a function that takes requirement increases into account
    resource: "boosters (2)", // Name of prestige currency
    baseResource: "boosters (1)", // Name of resource prestige is based on
    baseAmount() {return player.b1.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.1,
    roundUpCost: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.div(smartUpgradeEffect('b3', 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    tree: "junkyard",
    doReset(resettingLayer) {
        let row = layers[resettingLayer].row
        let tree = layers[resettingLayer].tree
        if(row <= this.row || tree != this.tree) return;

        let keep = []
        layerDataReset(this.layer, keep)
    },
    branches: ["b1"],
    hotkeys: [
        {key: "2", description: "2: Reset for boosters (2)", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[this.layer].layerShown}},
    ],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["milestones", [0, 1, 2, 3]],
        ["upgrades", [1]],
        ["milestones", [4]],
    ],
    layerShown(){return player.b1.points.add(player.b2.points).gte(1) || tmp.b3.layerShown},
    autoPrestige() {return hasMilestone('b3', 1) && player.b2.resetTime >= 3},
    effect() {
        let base = new Decimal(2)
        if(hasMilestone('b2', 3)) base = base.add(1)
        let eff = player[this.layer].points.max(0).pow_base(base)
        if(hasMilestone('b2', 0)) eff = eff.add(player.b1.points)
        if(hasMilestone('b2', 4)) eff = eff.pow(1.2).ceil()
        return eff.max(1)
    },
    milestonePopups() {return !player.b3.unlocked},
    effectDescription() {return "currently multiplying point gain by ×"+format(tmp[this.layer].effect)},
    milestones: {
        0: {
            requirementDescription: "2 Boosters (2)",
            effectDescription() {return "Booster (2) effect is increased by boosters (1)"+(!hasMilestone(this.layer, this.id)? ("<br>Next: ×"+format(tmp.b2.effect.add(player.b1.points))) : "")},
            done() {return player.b2.points.gte(2)},
        },
        1: {
            requirementDescription: "4 Boosters (2)",
            effectDescription() {return "Booster (1) effect is multiplied by boosters (2) and auto-prestige for boosters (1) every 1s"},
            done() {return player.b2.points.gte(4)},
        },

        2: {
            requirementDescription: "5 Boosters (2) & Upgrade 1A<br>or<br>7 Boosters (2)",
            effectDescription() {return "Booster (1) cost is divided by booster (2) effect square rooted"},
            done() {return (player.b2.points.gte(5) && hasUpgrade('b2', 11)) || player.b2.points.gte(7)},
        },
        3: {
            requirementDescription: "5 Boosters (2) & Upgrade 1B<br>or<br>7 Boosters (2)",
            effectDescription() {return "Booster (2) effect scaling is increased by 1"},
            done() {return (player.b2.points.gte(5) && hasUpgrade('b2', 12)) || player.b2.points.gte(7)},
        },

        4: {
            requirementDescription: "12 Boosters (2)",
            effectDescription() {return "Booster (2) and booster (2) effects are powered by 1.2 and rounded up"+(!hasMilestone(this.layer, this.id)?("<br>Next: ×"+format(tmp.b1.effect.pow(1.2).ceil())+" and ×"+format(tmp.b2.effect.pow(1.2).ceil())):"")},
            done() {return player.b2.points.gte(12)},
        },
    },
    upgrades: {
        11: {
            fullDisplay: "<h2>Upgrade 1A</h2>",
            cost: new Decimal(0),
            unlocked() {return !hasUpgrade('b2', 12)},
        },
        12: {
            fullDisplay: "<h2>Upgrade 1B</h2>",
            cost: new Decimal(0),
            unlocked() {return !hasUpgrade('b2', 11)},
        },
    },
})
addLayer("b3", {
    name: "booster 3", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        bPow: new Decimal(0),
    }},
    color: "#55FFAA",
    requires: new Decimal(16), // Can be a function that takes requirement increases into account
    resource: "boosters (3)", // Name of prestige currency
    baseResource: "boosters (2)", // Name of resource prestige is based on
    baseAmount() {return player.b2.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.05,
    roundUpCost: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.div(smartUpgradeEffect('b3', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    tree: "junkyard",
    doReset(resettingLayer) {
        let row = layers[resettingLayer].row
        let tree = layers[resettingLayer].tree
        if(row <= this.row || tree != this.tree) return;

        let keep = []
        layerDataReset(this.layer, keep)
    },
    branches: ["b2"],
    hotkeys: [
        {key: "3", description: "3: Reset for boosters (3)", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[this.layer].layerShown}},
    ],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["milestones", [0, 1, 2, 3]],
        "blank",
        ["display-text", function() {return hasMilestone('b3', 3)?("You have "+format(player.b3.bPow)+" booster power ("+format(tmp.b3.bPowGain)+"/sec)"):null}],
        "blank",
        "upgrades",
    ],
    layerShown(){return player.b2.points.add(player.b3.points).gte(1) || tmp.j.layerShown},
    effect() {
        let inc = new Decimal(player.b3.resetTime).div(10)
        inc = inc.min(8)
        let base = new Decimal(2).add(inc)
        let eff = player[this.layer].points.max(0).pow_base(base)
        if(hasMilestone('b3', 1)) eff = eff.mul(new Decimal(player.b3.milestones.length).max(0).add(1))
        return eff.max(1)
    },
    effectDescription() {return "currently multiplying point gain by ×"+format(tmp[this.layer].effect)},
    bPowGain() {
        let gain = new Decimal(0)
        if(hasMilestone('b3', 3)) gain = gain.add(player.b3.points).sub(6).sub(3*player.b3.upgrades.length)
        return gain
    },
    update(diff) {
        player.b3.bPow = player.b3.bPow.add(tmp.b3.bPowGain.max(0).mul(diff))
    },
    milestones: {
        0: {
            requirementDescription: "2 Boosters (3)",
            effectDescription() {return "Multiply booster (1) effect by boosters (3), always autobuy boosters (1) every 1s and you can buy max boosters (1)"},
            done() {return player.b3.points.gte(2)},
        },
        1: {
            requirementDescription: "5 Boosters (3)",
            effectDescription() {return "Multiply booster (3) effect by booster (3) milestones and autobuy boosters (2) every 3s"},
            done() {return player.b3.points.gte(5)},
        },
        2: {
            requirementDescription: "6 Boosters (3)",
            effectDescription() {return "Divide booster (1) cost by log10 (points)"},
            done() {return player.b3.points.gte(6)},
        },
        3: {
            requirementDescription: "7 Boosters (3)",
            effectDescription() {return "Start generating booster power"},
            done() {return player.b3.points.gte(7)},
        },
    },
    upgrades: {
        11: {
            title: "Upgrade 1A",
            description: "Divide booster (2) cost based on boosters (3)",
            cost: new Decimal(10),
            currencyLayer: "b3",
            currencyInternalName: "bPow",
            currencyDisplayName: "booster power",
            effect() {
                return new Decimal(1).add(player.b3.points.div(50))
            },
            effectDisplay() {
                return "÷"+format(upgradeEffect(this.layer, this.id))
            },
            tooltip: "1 + (Boosters (3) ÷ 50)",
            onPurchase() {
                player.b3.bPow = new Decimal(0)
            },
            unlocked() {return hasMilestone('b3', 3)},
        },
        12: {
            title: "Upgrade 1B",
            description: "Divide booster (3) cost based on boosters (2)",
            cost: new Decimal(10),
            currencyLayer: "b3",
            currencyInternalName: "bPow",
            currencyDisplayName: "booster power",
            effect() {
                return new Decimal(1).add(player.b2.points.div(200))
            },
            effectDisplay() {
                return "÷"+format(upgradeEffect(this.layer, this.id))
            },
            tooltip: "1 + (Boosters (2) ÷ 200)",
            onPurchase() {
                player.b3.bPow = new Decimal(0)
            },
            unlocked() {return hasMilestone('b3', 3)},
        },
        21: {
            title: "Upgrade 2A",
            description: "Unlock the next area",
            cost: new Decimal(200),
            currencyLayer: "b3",
            currencyInternalName: "bPow",
            currencyDisplayName: "booster power",
            onPurchase() {
                player.b3.bPow = new Decimal(0)
            },
            unlocked() {return hasUpgrade('b3', 11) && hasUpgrade('b3', 12)},
        },
    },
})