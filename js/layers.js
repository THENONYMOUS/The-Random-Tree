addLayer("cp", {
    name: "Challenge Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#D07A05",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "Challenge Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= layers[this.layer].row) return;
        if(hasMilestone('sd', 3)) var x = new Decimal(player.cp.points.times(0.9));

        let keptChallenges = {};
        if (hasMilestone('sd', 0)) keptChallenges[11] = challengeCompletions(this.layer, 11);
        if (hasMilestone('sd', 0)) keptChallenges[21] = challengeCompletions(this.layer, 21);
        if (hasMilestone('sd', 1)) keptChallenges[12] = challengeCompletions(this.layer, 12);
        if (hasMilestone('sd', 2)) keptChallenges[13] = challengeCompletions(this.layer, 13);
        if (hasMilestone('sd', 3)) keptChallenges[14] = challengeCompletions(this.layer, 14);

        let keep = [];
        layerDataReset(this.layer, keep);

        console.log("current challenge: "+format(player.sd.activeChallenge))
        if(!new Decimal(player.sd.activeChallenge) == new Decimal(0.00)) {
        if(hasMilestone('sd', 3)) player.cp.points=new Decimal(x);

        for(const [id, completions] of Object.entries(keptChallenges)) {
            player[this.layer].challenges[id] = completions;
        }}
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
        { key: "c", description: "C: Reset for Challenge Points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },
    challenges: {
        11: {
            name: "The First Challenge",
            challengeDescription: "No nerfs, just reach the goal",
            completionLimit() {
                if(hasChallenge('sd', 11)) return (100)
                else return (10)
            },
            rewardDescription() {return "+5 to base point gain per completion ("+format(challengeCompletions('cp', 11))+"/10)"},
            goalDescription() {return "Reach "+format (new Decimal(50).times(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 11)))))+" points"},
            canComplete() {return player.points.gte(new Decimal(50).times(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 11)))))},
        },
        12: {
            name: "The First Real Challenge",
            challengeDescription: "Divide Point gain by points^0.5",
            completionLimit: (10),
            rewardDescription() {return "x"+format(player.cp.points.times(new Decimal(challengeCompletions('cp', 12))).add(1).pow(new Decimal(0.3).add(new Decimal(challengeCompletions('cp', 12)).times(0.02))))+" point gain, based on Challenge Points ("+format(challengeCompletions('cp', 12))+"/10)"},
            goalDescription() {return "Reach "+format(new Decimal(25).times(new Decimal(2).pow(new Decimal(challengeCompletions('cp', 12)))))+" points"},
            canComplete() {return player.points.gte(new Decimal(25).times(new Decimal(2).pow(new Decimal(challengeCompletions('cp', 12)))))},
        },
        13: {
            name: "Strict",
            challengeDescription: "Base Gain is always 1",
            completionLimit: (10),
            unlocked() {return new Decimal(challengeCompletions('cp', 11)+challengeCompletions('cp', 12)).gte(5)},
            rewardDescription() {return "Gain multiplied based on points. Currently: x"+format(player.points.add(1).pow(new Decimal(challengeCompletions('cp', 13)).times(0.03)))+" ("+format(challengeCompletions('cp', 13))+"/10)"},
            goalDescription() {return "reach "+format(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 13))).times(50))+" points"},
            canComplete() {return player.points.gte(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 13))).times(50))},
        },
        14: {
            name: "Nerfalo",
            challengeDescription() {return "Gain Divided by "+format((challengeCompletions('cp', 14)+1)*2)},
            completionLimit: (10),
            unlocked() {return player.cp.points.gte(100)},
            rewardDescription() {return "Multiply Point Gain by Challenge Completions. ("+format(challengeCompletions('cp', 14))+"/10)"},
            goalDescription() {return "reach "+format(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 14))).times(1000))+" points"},
            canComplete() {return player.points.gte(new Decimal(3).pow(new Decimal(challengeCompletions('cp', 14))).times(1000))}
        },
        21: {
            name: "Pointless",
            challengeDescription: "Point gain ^0.1 then x0.1",
            unlocked() {return new Decimal(challengeCompletions('cp', 11)).gte(10)},
            rewardDescription: "Unlock 'Powers', an adjacent layer which multiplies point gain by 2^Power",
            goalDescription: "Reach 0.30 Points/sec",
            canComplete() {return new Decimal(tmp.pointGen).gte(0.295)},
        },
    },
    milestones: {
        0: {
            requirementDescription: "5 Total Completions",
            effectDescription: "Unlock Challenge 3: Strict",
            done() {return new Decimal(challengeCompletions('cp', 11)+challengeCompletions('cp', 12)).gte(5)},
        },
        1: {
            requirementDescription: "100 Challenge Points",
            effectDescription: "Unlock Challenge 4: Nerfalo",
            done() {return player.cp.points.gte(100)},
        },
        2: {
            requirementDescription: "10 Completions of Challenge 1",
            effectDescription: "Unlock Challenge 5: Pointless",
            done() {return new Decimal(challengeCompletions('cp', 11)).gte(10)},
        },
    },
}),
addLayer("p", {
    name: "Powers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#055FD0",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "Power", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: (1000),
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "p", description: "P: Reset for Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasChallenge('cp', 21) },
}),
addLayer("sd", {
    name: "Slowdown", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#055FD0",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "Slowdown", // Name of prestige currency
    baseResource: "Power", // Name of resource prestige is based on
    baseAmount() { return player.p.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    effect() {return player.sd.points.add(1).pow(0.5)},
    effectDescription() {return "Slowdown is Multiplying point gain. Currently: "+format(player.sd.points.add(1).pow(0.5))},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "s", description: "S: Reset for Slowdown", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return new Decimal(challengeCompletions('cp', 11)).gte(1) },
    milestones: {
        0: {
            requirementDescription: "1 Slowdown",
            effectDescription: "Keep Challenge 1 and 'Pointless' completions on reset",
            done() {return player.sd.points.gte(1)},
        },
        1: {
            requirementDescription: "2 Slowdown",
            effectDescription: "Keep Challenge 2 completions on reset",
            done() {return player.sd.points.gte(2)},
        },
        2: {
            requirementDescription: "3 Slowdown",
            effectDescription: "Keep Challenge 3 completions on reset and unlock a Slowdown Challenge",
            done() {return player.sd.points.gte(3)},
        },
        3: {
            requirementDescription: "4 Slowdown",
            effectDescription: "Keep Challenge 4 completions and 90% of challenge points on reset",
            done() {return player.sd.points.gte(4)},
        },
    },
    challenges: {
        11: {
            name: "Slowdown",
            challengeDescription: "'Pointless' effect but using 0.5 instead of 0.1",
            unlocked() {return hasMilestone('sd', 2)},
            rewardDescription: "Increase Completion limit of Challenge 1 to 100",
            goalDescription: "Reach 3 Power",
            canComplete() {return player.p.points.gte(3)},
        },
    },
})