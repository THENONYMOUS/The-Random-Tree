addLayer("p", {
    name: "Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        energy: new Decimal(0),
        auto11: false,
        auto13: false,
    }},
    color: "#AAAAFF",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip: "Points",
    update(diff) {
        player.p.energy = player.p.energy.add(buyableEffect('p', 33).times(diff))
    },
    automate() {
        if(hasMilestone('p', 0) && player.p.auto11) buyMaxBuyable('p', 11)
        if(hasMilestone('p', 1) && player.p.auto13) buyMaxBuyable('p', 13)
        if(hasMilestone('u', 1) && player.p.auto33) buyMaxBuyable('p', 33)
        if(hasMilestone('u', 2) && player.p.auto22) buyMaxBuyable('p', 22)
    },
    tabFormat: [
        ["display-text", function() {return "You Have "+format(player.points)+" Points.<br>Effective Buyable Levels Double Every 25 Bought."},],
        "blank",
        ["display-text", function() {return getBuyableAmount('p', 33).gte(1)?"You Have "+format(player.p.energy)+" Energy.<br>Energy is Rooting 'Not as Generic Boost' and Boost 2-1 Cost and Multiplying Point Gain by "+format(player.p.energy.max(0).add(1).root(10))+".":""}],
        "blank",
        ["display-text", () => "There are 9 Buyables<br>There are 12 Upgrades<br>There are 5 Milestones"],
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
        "milestones",
        "blank",
    ],
    buyables: {
        11: {
            title: "Generic Boost",
            display() {return autoThisBuyableDisplay("Increase Point Gain by 1", this)+"<br>Currently: +"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(player.u.best.gte(1)?24.9:25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {
                let cost = getBuyableAmount(this.layer, this.id).pow(1.1).pow_base(1.1).times(10)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let cost = new Decimal(1)
                cost = cost.div(buyableEffect('p', 13))
                return cost
            },
            effect() {return this.amount().max(0).pow(buyableEffect('p', 21))},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            buyMax() {
                let max = player.points.div(this.costMult()).div(10).log(1.1).root(1.1)
                max = max.add(1).floor()
                if(max.gt(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, max)
            },
        },
        12: {
            title: "Not as Generic Boost",
            display() {return autoThisBuyableDisplay("Increase Point Gain by 5%", this)+"<br>Currently: +"+format(this.effect().sub(1).mul(100))+"%"},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.2).pow_base(1.2).times(500).tetrate(getBuyableAmount(this.layer, this.id).max(100).div(100)).root(smartMilestoneEffect('p', 2)).root(player.p.energy.max(0).add(1).root(10))},
            effect() {return this.amount().max(0).pow_base(buyableEffect('p', 23).times(1.05))},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 11).gte(25)},
            purchaseLimit: 10000,
        },
        13: {
            title: "Slightly Unique Boost Stolen Off of a Guy on the Internet",
            display() {return autoThisBuyableDisplay("Divide 'Generic Boost' Cost", this)+"<br>Currently: ÷"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.3).pow_base(1.3).times(10000)},
            costMult() {return 1},
            effect() {return this.amount().max(0).add(1).pow(buyableEffect('p', 32))},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 12).gte(15)},
            buyMax() {
                let max = player.points.div(this.costMult()).div(10000).log(1.3).root(1.3)
                max = max.add(1).floor().min(10000)
                if(max.gt(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, max)
            },
            purchaseLimit: 10000,
        },
        21: {
            title: "A Boost You Came up With Yourself but Find Everyone Else Uses it",
            display() {return autoThisBuyableDisplay("Raise Total 'Generic Boost' Effect to 1.02", this)+"<br>Currently: ^"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.4).pow_base(1.4).times("1e7").tetrate(getBuyableAmount(this.layer, this.id).max(50).div(50)).root(smartUpgradeEffect('p', 24)).root(player.p.energy.max(0).add(1).root(10))},
            effect() {return this.amount().max(0).div(50).add(1)},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 13).gte(15)},
            purchaseLimit: 10000,
        },
        22: {
            title: "An <i>Interesting</i> Boost",
            display() {return autoThisBuyableDisplay("Multiply Point Gain, Increases With More Points", this)+"<br>Currently: ×"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(player.u.best.gte(1)?24:25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.5).pow_base(1.5).times("1e244").pow(getBuyableAmount(this.layer, this.id).max(175).div(175).pow(2)).pow(getBuyableAmount(this.layer, this.id).max(250).div(250).pow(20)).tetrate(getBuyableAmount(this.layer, this.id).max(500).div(500).root(2))},
            effect() {return player.points.max("1e10").log(10).log(10).pow(this.amount().max(0).root(2))},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 13).gte(360)},
            buyMax() {
                let current = getBuyableAmount(this.layer, this.id)
                let max = player.points.div("1e244").log(1.5).root(1.5)
                if(max.gt(500)) max = max.tetrate(decimalOne.div(max.div(500).root(2)))
                if(max.gt(250)) max = max.root(max.div(250).pow(20))
                if(max.gt(175)) max = max.root(max.div(175).pow(2))
                max = max.add(1).floor()
                if(max.gt(current)) setBuyableAmount(this.layer, this.id, max)
            },
            purchaseLimit: 10000,
        },
        23: {
            title: "Slightly Unique Boost Not Stolen Off of a Guy on the Internet",
            display() {return autoThisBuyableDisplay("Increase 'Not as Generic Boost' Base", this)+"<br>Currently: +"+format(this.effect().sub(1).mul(100))+"%"},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.6).pow_base(1.6).times("1e262").pow(getBuyableAmount(this.layer, this.id).max(25).div(25))},
            effect() {return this.amount().max(0).div(1000).add(1).root(2)},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 22).gte(22)},
            purchaseLimit: 10000,
        },
        31: {
            title: "A Cool, Moderately Unique Boost!",
            display() {return autoThisBuyableDisplay("Increase Point Gain Multiplier by 9, Effective Levels Double Every 9 Purchases Instead", this)+"<br>Currently: ×"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(9).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.7).pow_base(1.7).times("5e381")},
            effect() {return this.amount().max(0).mul(9).max(1)},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 22).gte(86)},
            buyMax() {
                let max = player.points.div("5e381").log(1.7).root(1.7)
                max = max.add(1).floor().min(10000)
                if(max.gt(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, max)
            },
            purchaseLimit: 10000,
        },
        32: {
            title: "A Satisfactory Unique Boost",
            display() {return autoThisBuyableDisplay("Raise Boost 1-3's Effect", this)+"<br>Currently: ^"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.8).pow_base(1.8).times("1e483").pow(getBuyableAmount(this.layer, this.id).max(100).div(100).pow(10))},
            effect() {return this.amount().max(0).add(1).root(5)},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 22).gte(123)},
            purchaseLimit: 10000,
        },
        33: {
            title: "A Completely Unique Boost",
            display() {return autoThisBuyableDisplay("Generate Energy Which Roots The Cost of 'Not as Generic Boost' and Boost 2-1 and Multiplies Point Gain", this)+"<br>Currently: +"+format(this.effect())+"/sec"},
            amount(x=getBuyableAmount(this.layer, this.id)) {
                x=new Decimal(x)
                return x.times(x.div(25).floor().pow_base(2))
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {return getBuyableAmount(this.layer, this.id).pow(1.9).pow_base(1.9).times("2.5e641").times(this.amount().times("1e265").max(1))},
            effect() {return this.amount().max(0).pow(getBuyableAmount('p', 33).max(0).add(1.5).log(1.5))},
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.points.gte(this.cost())},
            unlocked() {return getBuyableAmount('p', 22).gte(173)},
            buyMax() {
                let max = player.points.div("2.5e641").log(1.9).root(1.9)
                max = player.points.div(this.amount(this.amount().max(max)).times("1e265").max(1)).div("2.5e641").log(1.9).root(1.9)
                max = max.add(1).floor().min(10000)
                if(max.gt(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, max)
            },
            purchaseLimit: 10000,
        },
    },
    upgrades: {
        11: {
            title: "Generic Boost",
            description: "Multiply Point Gain Based on 'Generic Boost' Effective Levels",
            cost: (new Decimal(2500)),
            unlocked() {return getBuyableAmount('p', 11).gte(25)},
            effect() {return tmp.p.buyables[11]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        12: {
            title: "Not as Generic Boost",
            description: "Multiply Point Gain Based on 'Not as Generic Boost' Effective Levels",
            cost: (new Decimal("1e9")),
            unlocked() {return getBuyableAmount('p', 21).gte(7)},
            effect() {return tmp.p.buyables[12]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        13: {
            title: "Slightly Unique Boost Stolen Off of a Guy on the Internet",
            description: "Multiply Point Gain Based on 'Slightly Unique Boost Stolen Off of a Guy on the Internet' Effective Levels",
            cost: (new Decimal("1e233")),
            unlocked() {return getBuyableAmount('p', 13).gte(348)},
            effect() {return tmp.p.buyables[13]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        14: {
            title: "A Unique Upgrade, But Also Generic",
            description: "Multiply Point Gain Based on Points and Upgrades",
            cost: (new Decimal("4e247")),
            unlocked() {return getBuyableAmount('p', 11).gte(2770)},
            effect() {return player.points.max(10).log(10).times(new Decimal(2).pow(player.p.upgrades.length))},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        21: {
            title: "A Boost You Came up With Yourself but Find Everyone Else Uses it",
            description: "Multiply Point Gain Based on 'A Boost You Came up With Yourself but Find Everyone Else Uses it' Effective Levels",
            cost: (new Decimal("3e366")),
            unlocked() {return getBuyableAmount('p', 11).gte(3945)},
            effect() {return tmp.p.buyables[21]['amount'].max(0).add(1).root(2).pow(smartMilestoneEffect('p', 3))},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        22: {
            title: "An <i>Interesting</i> Boost",
            description: "Multiply Point Gain Based on 'An <i>Interesting</i> Boost' Effective Levels",
            cost: (new Decimal("5e376")),
            unlocked() {return getBuyableAmount('p', 11).gte(4045)},
            effect() {return tmp.p.buyables[22]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        23: {
            title: "Slightly Unique Boost Not Stolen Off of a Guy on the Internet",
            description: "Multiply Point Gain Based on 'Slightly Unique Boost Not Stolen Off of a Guy on the Internet' Effective Levels",
            cost: (new Decimal("5e391")),
            unlocked() {return getBuyableAmount('p', 22).gte(90)},
            effect() {return tmp.p.buyables[23]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        24: {
            title: "Sorta Unique Upgrade I Guess...",
            description: "Root 'A Boost You Came up With Yourself but Find Everyone Else Uses it' Cost Based on Points",
            cost: (new Decimal("5e409")),
            unlocked() {return getBuyableAmount('p', 11).gte(4345)},
            effect() {return player.points.log(1.5).root(1.5)},
            effectDisplay() {return format(this.effect())+"rt"},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        31: {
            title: "A Cool, Moderately Unique Boost!",
            description: "Multiply Point Gain Based on 'A Cool, Moderately Unique Boost!' Effective Levels",
            cost: (new Decimal("3e475")),
            unlocked() {return getBuyableAmount('p', 22).gte(121)},
            effect() {return tmp.p.buyables[31]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        32: {
            title: "A Satisfactory Unique Boost",
            description: "Multiply Point Gain Based on 'A Satisfactory Unique Boost' Effective Levels",
            cost: (new Decimal("2.5e917")),
            unlocked() {return player.p.energy.gte(1000000)},
            effect() {return tmp.p.buyables[32]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        33: {
            title: "A Completely Unique Boost",
            description: "A Completely Unique Boost",
            cost: (new Decimal("2.5e928")),
            unlocked() {return player.p.energy.gte(1000000)},
            effect() {return tmp.p.buyables[33]['amount'].max(0).add(1).root(2)},
            effectDisplay() {return "x"+format(this.effect())},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
        34: {
            title: "A Completely Unique... LAYER??",
            description: "You're not Redy for This",
            cost: (new Decimal("1e932")),
            unlocked() {return hasUpgrade('p', 33)},
            currencyInternalName: 'points',
            currencyDisplayName: "Points",
        },
    },
    milestones: {
        0: {
            requirementDescription: "20 Not as Generic Boosts",
            effectDescription: "Auto-buy Generic Boost and Make it 'Free'",
            done() {return getBuyableAmount('p', 12).gte(20)},
            unlocked() {return getBuyableAmount('p', 13).gte(5)},
            toggles: [["p", "auto11"]],
        },
        1: {
            requirementDescription: "348 of Boost 1-3",
            effectDescription: "Auto-buy Boost 1-3 and Make it 'Free'",
            done() {return getBuyableAmount('p', 13).gte(348)},
            unlocked() {return getBuyableAmount('p', 21).gte(50)},
            toggles: [["p", "auto13"]],
        },
        2: {
            requirementDescription: "12 Cool, Moderately Unique Boost!s",
            effectDescription() {return "Reduce Super-Scaling of 'Not as Generic Boost' Based on Points.<br>Currently: "+format(milestoneEffect('p', 2))},
            done() {return getBuyableAmount('p', 31).gte(12)},
            unlocked() {return getBuyableAmount('p', 31).gte(9)},
            effect() {return player.points.log(2).root(2)},
        },
        3: {
            requirementDescription: "3e543 Points",
            effectDescription: "Boost 2-1 Also Raises it's Corresponding Upgrade Effect.",
            done() {return player.points.gte("3e543")},
            unlocked() {return getBuyableAmount('p', 32).gte(21)},
            effect() {return buyableEffect('p', 21)},
        },
        4: {
            requirementDescription: "62 Cool, Moderately Unique Boost!s",
            effectDescription: "Multiply Point Gain by 5",
            done() {return getBuyableAmount('p', 31).gte(62)},
            unlocked() {return getBuyableAmount('p', 31).gte(61)},
            effect: 5,
        },
    },
}),
addLayer("u", {
    name: "Uniqueness", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FFAA00",
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    requires: new Decimal("1e932"),
    baseAmount() {return player.points},
    baseResource: "points",
    resource: "Uniqueness",
    automate() {
        if(hasMilestone('u', 0)) buyMaxBuyable('p', 31)
    },
    exponent: 1/500,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    layerShown(){return hasUpgrade('p', 34)||player.u.best.gte(1)},
    buyables: {
        11: {
            title: "Point Mult Increaser",
            display() {return autoThisBuyableDisplay("Increase Point Gain Mult by 10", this)+"<br>Currently: x"+format(this.effect())},
            amount() {return getBuyableAmount(this.layer, this.id).times(getBuyableAmount(this.layer, this.id).div(25).floor().pow_base(2))},
            cost(x = getBuyableAmount(this.layer, this.id)) {
                let cost = getBuyableAmount(this.layer, this.id).pow(1.1).pow_base(1.1).times(1)
                return cost.ceil()
            },
            effect() {return this.amount().max(0).times(10).max(1)},
            buy() {
                player.u.points = player.u.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {return player.u.points.gte(this.cost())},
            purchaseLimit: 10000,
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Total Uniqueness",
            effectDescription: "Reduce Generic Boost's Base to 24.9 from 25 and Autobuy 'Cool, Moderately Unique Boost!'",
            done() {return player.u.total.gte(1)},
        },
        1: {
            requirementDescription: "5 Total Uniqueness",
            effectDescription: "Autobuy 'Completely Unique Boost'",
            done() {return player.u.total.gte(5)},
            toggles: [["p", "auto33"]]
        },
        2: {
            requirementDescription: "10 Total Uniqueness",
            effectDescription: "Autobuy 'An <i>Interesting</i> Boost'",
            done() {return player.u.total.gte(10)},
            toggles: [["p", "auto22"]]
        },
    },
})