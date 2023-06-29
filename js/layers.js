addLayer("i", {
    name: "ingredients", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#13DC4B",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ingredients", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
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
    layerShown(){return true},
    passiveGeneration() {
        let gen = new Decimal(1)
        gen = gen.times(smartUpgradeEffect('i', 12))
        gen = gen.times(buyableEffect('i', 11))
        gen = gen.times(smartAchievementEffect('m', 11))
        gen = gen.times(smartAchievementEffect('m', 21))
        gen = gen.times(smartAchievementEffect('m', 22))
        gen = gen.div(smartAchievementEffect('m', 23))
        return gen
    },
    getResetGain() {
        let gain = player.points.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent).floor()
        return gain
    },
    tabFormat: [
        "main-display",
        ["display-text", function() {return "You are Gaining "+format(getResetGain(this.layer).times(tmp[this.layer].passiveGeneration))+" ["+format(getResetGain(this.layer))+"] Ingredients a Second.<br>Next Gain Increase at "+format(getNextAt(this.layer))+" Points."}],
        "blank",
        ["upgrades", [1]],
        "blank",
        ["buyables", [1]],
        "blank",
        ["upgrades", [2]],
        "blank",
    ],
    upgradeAmount() {return new Decimal(player.i.upgrades.length)},
    upgrades: {
        11: {
            title: "Ingredient-Boosted Points",
            description: "Point Gain is Multiplied Based on Ingredients",
            cost: (new Decimal(10)),
            effect() {return player.i.points.max(0).add(1).pow(0.5)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "sqrt Ingredients",
        },
        12: {
            title: "Ingredient-Boosted Ingredients",
            description: "Ingredient Gain is Multiplied Based on Ingredients",
            cost: (new Decimal(100)),
            effect() {return player.i.points.max(0).add(2).log(2).root(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "sqrt log2 Ingredients",
        },
        13: {
            title: "Point-Boosted Points",
            description: "Point Gain is Multiplied Based on Points",
            cost: (new Decimal(1000)),
            effect() {return player.points.max(0).add(1).log(10)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "log10 Points",
        },
        14: {
            title: "Repeatable Upgrades",
            description: "Unlock 2 Buyables",
            cost: (new Decimal(10000)),
            tooltip: "Buyables can be Bought Multiple Times",
        },
        21: {
            title: "Tetration",
            description: "Multiply Points Based on Ingredients Upgrades",
            cost: (new Decimal("5e6")),
            effect() {return upgradeAmount('i').tetrate(2).max(1)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "Upgrades ^^ 2",
        },
        22: {
            title: "Magnitude",
            description: "Multiply Points Based on Ingredients' Magnitude",
            cost: (new Decimal("5e15")),
            effect() {return player.i.points.max(0).add(1).log(10).floor().pow_base(1.5)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip() {return shiftDown?"1.5 ^ floor log10 Ingredients" : "1.5 ^ Magnitude (Ingredients). Shift for Details"},
        },
        23: {
            title: "Point-Boosted Buyables",
            description: "Divide Buyable Costs Based on Points",
            cost: (new Decimal("2.5e28")),
            effect() {return player.points.max(0).log(10)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "log10 Points",
        },
        24: {
            title: "Ingredient Arrangement",
            description: "Unlock Meals",
            cost: (new Decimal("5e39")),
            style() {return{
                'min-height': '140px',
                'width': '140px'
            }
            },
        },
    },
    buyables: {
        11: {
            title: "Increase Ingredient Gain",
            display() {return autoThisBuyableDisplay("Multiply Ingredient Gain by 2. Hold to Buy Multiple", this)},
            amount() {return new Decimal(getBuyableAmount(this.layer, this.id)).add(this.bonus())},
            bonus() {
                let bonus = new Decimal(0)
                return bonus
            },
            cost(x) {
                let cost = this.amount().max(0).add(3).pow_base(this.amount().div(10).max(10))
                cost = cost.times(this.costMult())
                return cost
            },
            costMult() {
                let costMult = new Decimal(1)
                costMult = costMult.div(smartUpgradeEffect('i', 23))
                costMult = costMult.div(smartAchievementEffect('m', 13))
                return costMult
            },
            canAfford() {return player.i.points.gte(this.cost())},
            buy() {
                player.i.points = player.i.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('i', 14)},
            effect() {return this.amount().max(0).pow_base(2)},
            tooltip() {return "Currently: ×"+format(this.effect())},
        },
        12: {
            title: "Increase Point Gain",
            display() {return autoThisBuyableDisplay("Multiply Point Gain by 2. Hold to Buy Multiple", this)},
            amount() {return new Decimal(getBuyableAmount(this.layer, this.id)).add(this.bonus())},
            bonus() {
                let bonus = new Decimal(0)
                return bonus
            },
            cost(x) {
                let cost = this.amount().max(0).add(3).pow_base(this.amount().div(10).max(10).div(2))
                cost = cost.times(this.costMult())
                return cost
            },
            costMult() {
                let costMult = new Decimal(1)
                costMult = costMult.div(smartUpgradeEffect('i', 23))
                costMult = costMult.div(smartAchievementEffect('m', 13))
                return costMult
            },
            canAfford() {return player.i.points.gte(this.cost())},
            buy() {
                player.i.points = player.i.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            unlocked() {return hasUpgrade('i', 14)},
            effect() {return this.amount().max(0).pow_base(2)},
            tooltip() {return "Currently: ×"+format(this.effect())},
        },
    },
}),
addLayer("m", {
    name: "meals", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FF0033",
    requires: new Decimal("1e42"), // Can be a function that takes requirement increases into account
    resource: "meals", // Name of prestige currency
    baseResource: "ingredients", // Name of resource prestige is based on
    baseAmount() {return player.i.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(smartAchievementEffect('m', 23))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= layers[this.layer].row) return;
        
        let keep = [];
        layerDataReset(this.layer, keep)
    },
    branches: ['i'],
    onPrestige() {
        if(!player.shownLayers.includes(this.layer)) player.shownLayers.push(this.layer)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
        key: "m",
        description: "M: Reset for Meals",
        onPress() {
            if(canReset(this.layer)) doReset(this.layer)
        },
        unlocked() {return layerShown(this.layer)},
        }
    ],
    layerShown() {return hasUpgrade('i', 24) || player.shownLayers.includes(this.layer)},
    passiveGeneration() {
        let gen = new Decimal(0)
        gen = gen.add(smartAchievementEffect('m', 14, 0))
        gen = gen.add(smartAchievementEffect('m', 15, 0))
        return gen
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "achievements",
        "blank",
    ],
    upgradeAmount() {return new Decimal(player.m.upgrades.length)},
    achievements: {
        11: {
            name: "1 Meal",
            done() {return player.m.points.gte(1)},
            tooltip: "Multiply Point and Ingredient Gain by 5",
            effect: 5,
        },
        12: {
            name: "5 Meals",
            done() {return player.m.points.gte(5)},
            tooltip() {return "Multiply Point Gain by Total Meals. Currently: ×"+formatWhole(this.effect())},
            effect() {return player.m.total.max(0).add(1)},
        },
        13: {
            name: "50 Meals",
            done() {return player.m.points.gte(50)},
            tooltip: "Divide Ingredients Buyable Costs by 2",
            effect: 2,
        },
        14: {
            name: "200 Meals",
            done() {return player.m.points.gte(200)},
            tooltip: "Gain 1% of Meal Gain Every Second",
            effect: 0.01,
        },
        15: {
            name: "500 Meals",
            done() {return player.m.points.gte(500)},
            tooltip: "Increase Passive Meal Generation by 1% Per Meal Achievement",
            effect() {return player.m.achievements.length/100},
        },
        21: {
            name: "5,000 Meals",
            done() {return player.m.points.gte(5000)},
            tooltip() {return "Total Meals Multiply Ingredient Gain. Currently: ×"+formatWhole(this.effect())},
            effect() {return player.m.points.max(0).add(1)},
        },
        22: {
            name: "500,000 Meals",
            done() {return player.m.points.gte(500000)},
            tooltip: "Destroy Your Meals and Total Meals but Multiply Ingredients by 2.",
            onComplete() {
                doReset(this.layer)
                player.m.points = new Decimal(0)
                player.m.total = new Decimal(0)
            },
            effect: 2,
        },
        23: {
            name: "5,000,000 Meals",
            done() {return player.m.points.gte("1e6")},
            tooltip: "Divide Ingredients Gain but Multiply Meals Gain by 2",
            effect: 2,
        },
    },
})