addLayer("j", {
    name: "junk", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
    }},
    color: "#AAAAAA",
    requires() {
        let req = new Decimal(10)
        req = req.add(player.j.points)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "junk", // Name of prestige currency
    baseResource: "basement points", // Name of resource prestige is based on
    baseAmount() {return player.basementPoints}, // Get the current amount of baseResource
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
    tree: "basement",
    doReset(resettingLayer) {
        let row = layers[resettingLayer].row
        let tree = layers[resettingLayer].tree
        if(row <= this.row || tree != this.tree) return;

        let keep = []
        layerDataReset(this.layer, keep)
    },
    branches: [],
    hotkeys: [
        {key: "j", description: "J: Reset for junk", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return tmp[this.layer].layerShown}},
    ],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],
    layerShown(){return hasUpgrade('b3', 21) || player[this.layer].unlocked},
    buyables: {
        11: {
            title() {return formatWhole(this.amount())+"<br>Basement Booster"},
            amount() {return getBuyableAmount(this.layer, this.id)},
            display() {
                let desc = "Increase basement point gain by 1 and multiply basement point gain by 1.01"
                desc += "<br>Cost: "+format(this.cost())+" junk"
                desc += "<br>Effect: +"+format(this.effect()[0])+" and ×"+format(this.effect()[1])
                return desc
            },
            effect() {
                return [this.amount(), this.amount().pow_base(1.01)]
            },
            cost(x = this.amount()) {
                let cost = x.pow_base(2)
                return cost
            },
            canAfford() {return player.j.points.gte(this.cost())},
            buy() {
                player.j.points = player.j.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
        },
    },
    upgrades: {
        11: {
            title: "Junkyard Junk",
            description: "Multiply basement point gain based on points",
            cost() {return new Decimal(hasUpgrade('j', 12) ? 100 : 10)},
            effect() {return player.points.max("1e5").log(10).div(5)},
            effectDisplay() {return "×"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10 (Points)",
        },
        12: {
            title: "Junk Junkyard",
            description: "Multiply basement point gain based on boosters (1)",
            cost() {return new Decimal(hasUpgrade('j', 11) ? 100 : 10)},
            effect() {return player.b1.points.max(0).add(1).root(2.5)}, 
            effectDisplay() {return "×"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "2.5rt (Boosters (1))",
        },
    },
})