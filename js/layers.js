addLayer("d", {
    name: "data", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        cooldown: new Decimal(1),
    }},
    color: "#AAAAFF",
    requires() {
        let req = new Decimal(1)

        req = req.div(smartUpgradeEffect('d', 21))
        req = req.div(smartUpgradeEffect('d', 22))
        req = req.div(smartUpgradeEffect('d', 32))

        return req
    },
    resource: "data", // Name of prestige currency
    baseResource: "permutations", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.5,
    canBuyMax: true,

    canReset() {
        return player.d.cooldown.lt(0) && tmp.d.baseAmount.gte(tmp.d.nextAt) 
    },
    update(diff) {
        player.d.cooldown = player.d.cooldown.sub(diff)
    },

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset to gain Data", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},


    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "upgrades",
                "blank",
                "buyables",
                "blank",
            ],
        },
    },


    upgrades: {
        11: {
            title: "Data A1",
            description: "Permutation limit is multiplied based on current permutations",
            tooltip: "sqrt(Permutations + 1)",
            cost: new Decimal(1),
            effect() {
                return player.points.add(1).root(2)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " limit"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        12: {
            title: "Data A2",
            description: "Permutation limit is multiplied based on current data",
            tooltip: "sqrt(Data + 1)",
            cost: new Decimal(2),
            effect() {
                return player.d.points.add(1).root(2)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " limit"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        13: {
            title: "Data A3",
            description: "Permutation gain is multiplied based on current permutations",
            tooltip: "Log10(Permutations + 1) + 1",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).log(10).add(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " permutation gain"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        14: {
            title: "Data A4",
            description: "Permutation limit is multiplied based on permutation gain",
            tooltip: "sqrt(Gain + 1)",
            cost: new Decimal(5),
            effect() {
                return new Decimal(tmp.pointGen).add(1).root(2)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " limit"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        21: {
            title: "Data B1",
            description: "Data requirement is divided based on upgrades bought",
            tooltip: "sqrt(Upgrades + 1)",
            cost: new Decimal(7),
            unlocked() {
                return hasUpgrade('d', 13) && hasUpgrade('d', 14)
            },
            effect() {
                return new Decimal(player.d.upgrades.length).add(1).root(2)
            },
            effectDisplay() {
                return "÷" + format(upgradeEffect(this.layer, this.id)) + " data requirement"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        22: {
            title: "Data B2",
            description: "Data requirement is divided based on permutations",
            tooltip: "Log10(Permutations + 1) + 1",
            cost: new Decimal(10),
            unlocked() {
                return hasUpgrade('d', 13) && hasUpgrade('d', 14)
            },
            effect() {
                return player.points.add(1).log(10).add(1)
            },
            effectDisplay() {
                return "÷" + format(upgradeEffect(this.layer, this.id)) + " data requirement"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        23: {
            title: "Data B3",
            description: "Permutation gain is multiplied based on data",
            tooltip: "3rt(Data + 1)",
            cost: new Decimal(13),
            unlocked() {
                return hasUpgrade('d', 13) && hasUpgrade('d', 14)
            },
            effect() {
                return player.d.points.add(1).root(3)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " permutation gain"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        24: {
            title: "Data B4",
            description: "Unlock a data buyable",
            cost: new Decimal(15),
            unlocked() {
                return hasUpgrade('d', 13) && hasUpgrade('d', 14)
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        31: {
            title: "Data C1",
            description: "Permutation gain is multiplied based on upgrades bought",
            tooltip: "3rt(Upgrades + 1)",
            cost: new Decimal(29),
            unlocked() {
                return player.g.best.gte(1)
            },
            effect() {
                return new Decimal(player.d.upgrades.length).add(1).root(3)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " permutation gain"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        32: {
            title: "Data C2",
            description: "Divide data requirement by group effect",
            cost: new Decimal(62),
            unlocked() {
                return player.g.best.gte(1)
            },
            effect() {
                return tmp.g.effect.effect1
            },
            effectDisplay() {
                return "÷" + format(upgradeEffect(this.layer, this.id)) + " data requirement"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        33: {
            title: "Data C3",
            description: "Divide group requirement based on permutations",
            tooltip: "Log10(Permutations + 1) + 1",
            cost: new Decimal(70),
            unlocked() {
                return player.g.best.gte(1)
            },
            effect() {
                return player.points.add(1).log(10).add(1)
            },
            effectDisplay() {
                return "÷" + format(upgradeEffect(this.layer, this.id)) + " group requirement"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
        34: {
            title: "Data C4",
            description: "Multiply permutation gain by groups",
            cost: new Decimal(71),
            unlocked() {
                return player.g.best.gte(1)
            },
            effect() {
                return player.g.points
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id)) + " permutation gain"
            },
            onPurchase() {
                player.d.cooldown = new Decimal(1)
            },
        },
    },

    buyables: {
        11: {
            amount() {return getBuyableAmount(this.layer, this.id)},
            title() {return formatWhole(this.amount()) + "<br>Data Buyable A1"},
            display() {
                let desc = "Double permutation gain"
                desc += "<br> Cost: " + format(this.cost()) + " data"
                desc += "<br> Effect: x" + format(this.effect()) + " permutation gain"
                return desc
            },
            canAfford() {return player.d.points.gte(this.cost())},
            costDetails: {
                base() {
                    let base = new Decimal(5)
                    if(hasUpgrade('g', 11)) base = base.sub(1)
                    return base
                },
            },
            cost() {
                let cost = this.amount().add(1).mul(this.costDetails.base())
                return cost
            },
            buy() {
                player.d.points = player.d.points.sub(this.cost()).floor().max(0)
                addBuyables(this.layer, this.id, 1)
                player.d.cooldown = new Decimal(1)
            },

            effect() {
                let effect = this.amount().pow_base(2)
                return effect
            },
            unlocked() {return hasUpgrade('d', 24)},
            tooltip: "2 ^ Amount",
        },
    },
})
addLayer("g", {
    name: "groups", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ['d'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
        cooldown: new Decimal(1),
        variables: {
            variable1: new Decimal(1),
        },
    }},
    color: "#FFAA00",
    requires() {
        let req = new Decimal(1000)

        req = req.div(smartUpgradeEffect('d', 33))

        return req
    },
    resource: "groups", // Name of prestige currency
    baseResource: "permutations", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 10,
    canBuyMax: true,

    canReset() {
        return player.g.cooldown.lt(0) && tmp.g.baseAmount.gte(tmp.g.nextAt) 
    },
    update(diff) {
        player.g.cooldown = player.g.cooldown.sub(diff)
    },

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset to gain Groups", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked(){return tmp.g.layerShown}},
    ],
    layerShown(){
        return hasUpgrade('d', 24)
            || player.g.best.gte(1)
    },

    effect: {
        effect1() {
            let eff = player.g.points.add(1).root(2)
            return eff
        },
    },

    upgrades: {
        11: {
            title: "Groups A1",
            description: "Reduce the cost scaling of data buyable A1",
            tooltip: "5x -> 4x",
            cost: new Decimal(3),
            onPurchase() {
                player.g.cooldown = new Decimal(1)
            },
        },
        12: {
            title: "Groups A2",
            description: "Permutation gain is multiplied based on permutation limit",
            tooltip: "Log10(Limit + 1) + 1",
            cost: new Decimal(4),
            effect() {
                return player.hardcap.add(1).log(10).add(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            onPurchase() {
                player.g.cooldown = new Decimal(1)
            },
        },
        13: {
            title: "Groups A3",
            description: "Unlock a variable which multiplies permutation gain but divides permutation limit",
            cost: new Decimal(6),
            onPurchase() {
                player.g.cooldown = new Decimal(1)
            },
        },
        14: {
            title: "Groups A4",
            description: "This variable's effect to permutation gain is increased",
            tooltip: "^1 -> ^1.5",
            cost: new Decimal(7),
            effect() {
                return player.g.variables.variable1.pow(1.5)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))
            },
            onPurchase() {
                player.g.cooldown = new Decimal(1)
            },
        },
    },
    clickables: {
        11: {
            title: "Var1 +",
            display: "Increase the first group variable",
            canClick() {
                return player.g.variables.variable1.lt(10)
            },
            onClick() {
                player.g.variables.variable1 = player.g.variables.variable1.add(1)
            },
            unlocked() {
                return hasUpgrade('g', 13)
            },
            style: {
                'min-height': '85px',
                'width': '85px'
            },
        },
        12: {
            title: "Var1 -",
            display: "Decrease the first group variable",
            canClick() {
                return player.g.variables.variable1.gt(1)
            },
            onClick() {
                player.g.variables.variable1 = player.g.variables.variable1.sub(1)
            },
            unlocked() {
                return hasUpgrade('g', 13)
            },
            style: {
                'min-height': '85px',
                'width': '85px'
            },
        },
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function() {
                    return "<h3 style='color: #FFAA00'>Groups</h3> multiply permutation limit by <h3 style='color: #FFAA00'>" + format(tmp.g.effect.effect1) + "</h3><br><sub>base = sqrt(Groups + 1)</sub>"
                }],
                "blank",
                ["display-text", function() {
                    return hasUpgrade('g', 13) ? ("The first variable is at a value of <h3 style='color: #FFAA00'>" + formatWhole(player.g.variables.variable1) + "</h3>/10<br><sub>This divides permutation limit but multiplies permutation gain") : ""
                }],
                ["clickables", [1]],
                "blank",
                "upgrades",
                "blank",
                "buyables",
                "blank",
            ],
        },
    },
})
