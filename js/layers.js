addLayer("ge", {
    name: "Generations", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ge", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        mitochondria: new Decimal(0),
    }},
    color: "#FFEEAA",
    requires() {
        let req = new Decimal(1)
        req = req.div(smartUpgradeEffect('ge', 32))
        req = req.div(smartUpgradeEffect('ge', 34))
        req = req.div(smartUpgradeEffect('ge', 61))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "Generations", // Name of prestige currency
    baseResource: "evolution", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 2,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for Generations", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige() {
        player.ge.mitochondria = new Decimal(0)
    },
    update(diff) {
        // MITOCHONDRIA gain
        let gain = new Decimal(0)
        if(hasUpgrade('ge', 41)) gain = gain.add(1)
        gain = gain.add(smartUpgradeEffect('ge', 81, 0))
        gain = gain.mul(smartUpgradeEffect('ge', 51))
        gain = gain.mul(smartUpgradeEffect('ge', 52))
        gain = gain.mul(smartUpgradeEffect('ge', 62))
        gain = gain.mul(smartUpgradeEffect('ge', 71))
        gain = gain.mul(smartUpgradeEffect('ge', 91))

        let cap = gain.mul(10)
        cap = cap.div(smartUpgradeEffect('ge', 91))

        player.ge.mitochondria = player.ge.mitochondria.add(gain.mul(diff)).min(cap).max(player.ge.mitochondria)
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                ["display-text", function() {
                    return "When you reach a new Generation, your evolution gain is nerfed. This nerf is removed when you undo those Generations for boosts.<br>Each upgrade you buy increases the cost of other upgrades in the same row."
                },],
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["upgrade-tree", [
                    [11],
                    [21, 22],
                    [31, 32, 33, 34],
                    [41],
                ]],
                ["display-text", function() {
                    return "You have <h2 style='color: "+tmp.ge.color+"'>"+format(player.ge.mitochondria)+"</h2> Mitochondria, capped at 10s of production and boosting 'Mitochondria' by x"+format(tmp.ge.effect.mitochondria)
                }, {"background-color": "#111111"}],
                ["main-display", null, {"background-color": "#111111"}],
                "prestige-button",
                "blank",
                ["upgrade-tree", [
                    [51, 52, 53],
                    [61, 62, 63],
                    [71],
                    [81, 82, 83, 84, 85, 86],
                    [91, 92],
                    [101],
                ]],
                "blank",
            ],
        },
    },
    effect: {
        mitochondria() {
            let eff = player.ge.mitochondria.div(10).add(1).root(2)
            eff = eff.pow(smartUpgradeEffect('ge', 53))
            return eff
        }
    },
    autoPrestige() {return hasUpgrade('ge', 92)},
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Cells",
            description() {return hasUpgrade('ge', 63) ? ("Multiply Evolution Speed by "+format(upgradeEffect(this.layer, this.id))) : "Double Evolution Speed"},
            cost: new Decimal(1),
            effect() {
                let eff = new Decimal(2)
                eff = eff.pow(smartUpgradeEffect('ge', 63))
                return eff
            },
            branches() {return hasUpgrade('ge', 101) ? [[101, tmp.ge.color], [91, tmp.ge.color], [92, tmp.ge.color]] : []},
        },
        21: {
            title: "Defensive Cells",
            description: "Upgrades increase Base Evolution Speed",
            cost() {return new Decimal(2).add(upgradeRow('ge', 2))},
            ...upgradeBranches('ge', [11]),
            effect() {return new Decimal(player.ge.upgrades.length).div(10)},
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "Upgrades ÷ 10",
        },
        22: {
            title: "Resourceful Cells",
            description: "Generations increase Base Evolution Speed",
            cost() {return new Decimal(2).add(upgradeRow('ge', 2))},
            ...upgradeBranches('ge', [11]),
            effect() {return player.ge.points.div(10)},
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "Generations ÷ 10",
        },
        31: {
            title: "Stronger Membranes",
            description: "Upgrades multiply Evolution Speed",
            cost() {return new Decimal(2).add(upgradeRow('ge', 3))},
            ...upgradeBranches('ge', [21]),
            effect() {return new Decimal(player.ge.upgrades.length).add(1).root(2)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "sqrt(Upgrades)",
        },
        32: {
            title: "Secure Receptors",
            description: "Upgrades divide Generation Requirements",
            cost() {return new Decimal(3).add(upgradeRow('ge', 3))},
            ...upgradeBranches('ge', [21]),
            effect() {return new Decimal(player.ge.upgrades.length).add(1).root(2)},
            effectDisplay() {return "÷"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "sqrt(Upgrades)",
        },
        33: {
            title: "Faster Flagella",
            description: "Generations multiply Evolution Speed",
            cost() {return new Decimal(2).add(upgradeRow('ge', 3))},
            ...upgradeBranches('ge', [22]),
            effect() {return player.ge.points.add(1).root(2)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "sqrt(Generation)",
        },
        34: {
            title: "Receptive Receptors",
            description: "Generations divide Generation Requirements",
            cost() {return new Decimal(3).add(upgradeRow('ge', 3))},
            ...upgradeBranches('ge', [22]),
            effect() {return player.ge.points.add(1).root(2)},
            effectDisplay() {return "÷"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "sqrt(Generations)",
        },
        41: {
            title: "Mitochondria",
            description: "Evolution multiplies Evolution Speed and begin generation of Mitochondria, which boosts this upgrade",
            cost() {return new Decimal(6).add(upgradeRow('ge', 4))},
            ...upgradeBranches('ge', [31, 32, 33, 34]),
            effect() {return player.points.add(1).log(10).add(1).mul(tmp.ge.effect.mitochondria)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Evolution) x Mitochondria effect",
        },
        51: {
            title: "Faster Mitochondria",
            description: "Multiply Mitochondria gain based on Generations",
            cost() {return new Decimal(7).add(upgradeRow('ge', 5))},
            ...upgradeBranches('ge', [41]),
            effect() {return player.ge.points.add(1).log(10).add(1)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Generations)",
        },
        52: {
            title: "Booster Mitochondria",
            description: "Mitochondria effect affects Mitochondria Gain at a reduced rate",
            cost() {return new Decimal(7).add(upgradeRow('ge', 5))},
            ...upgradeBranches('ge', [51, 53]),
            effect() {return tmp.ge.effect.mitochondria.add(1).log(10).add(1)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Mitochondria effect)",
        },
        53: {
            title: "Stronger Mitochondria",
            description: "Raise Mitochondria effect based on Generations",
            cost() {return new Decimal(7).add(upgradeRow('ge', 5))},
            ...upgradeBranches('ge', [41]),
            effect() {return player.ge.points.add(1).log(10).add(1).log(10).add(1)},
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10^2(Generations)",
        },
        61: {
            title: "Efficient Mitochondria",
            description: "'Mitochondria' effect divides Generation Requirements at a reduced rate",
            cost() {return new Decimal(10).add(upgradeRow('ge', 6))},
            ...upgradeBranches('ge', [62]),
            effect() {return upgradeEffect('ge', 41).root(2)},
            effectDisplay() {return "÷"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "sqrt('Mitochondria' effect)",
        },
        62: {
            title: "More Mitochondria",
            description: "Mitochondria gain is multiplied by Upgrades",
            cost() {return new Decimal(10).add(upgradeRow('ge', 6))},
            ...upgradeBranches('ge', [52]),
            effect() {return new Decimal(player.ge.upgrades.length).add(1).log(10).add(1)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Upgrades)",
        },
        63: {
            title: "Multi-Mitochondria",
            description: "Mitochondria raise the 'Cells' effect",
            cost() {return new Decimal(10).add(upgradeRow('ge', 6))},
            ...upgradeBranches('ge', [62]),
            effect() {return player.ge.mitochondria.add(1).log(10).add(1)},
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Mitochondria)",
        },
        71: {
            title: "MOOOOOORE Mitochondria",
            description: "Mitochondria gain is multiplied by Evolution",
            cost() {return new Decimal(16).add(upgradeRow('ge', 7))},
            ...upgradeBranches('ge', [61, 62, 63]),
            effect() {return player.points.add(1).log(10).add(1)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "log10(Evolution)",
        },
        81: {
            title: "Upgrade chain start",
            description: "Increase base Evolution Speed and Mitochondria Gain by upgrades in this row",
            cost() {return new Decimal(19).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71]),
            effect() {return upgradeRow('ge', 8)},
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
            tooltip: "Upgrade chain upgrades",
        },
        82: {
            title: "Upgrade chain I",
            description: "Just an upgrade",
            cost() {return new Decimal(15).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71, 81]),
        },
        83: {
            title: "Upgrade chain II",
            description: "Just an upgrade",
            cost() {return new Decimal(15).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71, 81]),
        },
        84: {
            title: "Upgrade chain III",
            description: "Just an upgrade",
            cost() {return new Decimal(15).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71, 81]),
        },
        85: {
            title: "Upgrade chain IV",
            description: "Just an upgrade",
            cost() {return new Decimal(15).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71, 81]),
        },
        86: {
            title: "Upgrade chain V",
            description: "Just an upgrade",
            cost() {return new Decimal(15).add(upgradeRow('ge', 8))},
            ...upgradeBranches('ge', [71, 81]),
        },
        91: {
            title: "Fast-ochondria",
            description: "Mitochondria now capped 10x earlier but Mitochondria gain is 10x higher (effectively just 10x faster)",
            cost() {return new Decimal(25).add(upgradeRow('ge', 9))},
            ...upgradeBranches('ge', [81], [82, 83, 84, 85, 86]),
            effect() {return new Decimal(10)},
            effectDisplay() {return "x"+format(upgradeEffect(this.layer, this.id))},
        },
        92: {
            title: "Autochondria",
            description: "Automatically get new Generations",
            cost() {return new Decimal(25).add(upgradeRow('ge', 9))},
            ...upgradeBranches('ge', [81], [82, 83, 84, 85, 86]),
        },
        101: {
            title: "Upgrade 101",
            description() {return hasUpgrade('ge', 101) ? "Sorry, check back in 5 hours. It'll be added by then for sure" : "Unlock something new..."},
            cost() {return new Decimal(27).add(upgradeRow('ge', 10))},
            ...upgradeBranches('ge', [91, 92]),
        },
    },
})
addLayer("options", {
    name: "bnuy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    nodeStyle: {
        transform() {return "rotate("+(player.timePlayed*90)+"deg)"}
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        gameSpeed: 100,
        enableSpeed: false,
    }},
    color: "#FFFFEE",
    requires() {
        let req = new Decimal(1)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "Generations", // Name of prestige currency
    baseResource: "evolution", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none",
    row: "side",
    tabFormat: {
        Resources: {
            content: [
                function() {return tmp.ge.layerShown ? ["layer-proxy", ['ge', ["main-display"]]] : null},
            ],
        },
        DevSpeed: {
            content: [
                ["display-text", "This slider controls the percentage, not the value.<br>The toggle decides if this will be active"],
                ["slider", ["gameSpeed", 1, 1000]],
                ["toggle", ["options", "enableSpeed"]],
            ],
        },
        Savebank: {
            content: [
                ["display-text", "This is the <h2>Savebank</h2>. You can load saves from here."],
                "clickables",
                "blank",
            ],
        },
    },
    automate() {
        player.devSpeed = player.options.enableSpeed ? player.options.gameSpeed/100 : 1
    },
    layerShown(){return true},
    tooltip: "Options",
    clickables: {
        11: {
            title: "Generations",
            display: "layer finished",
            onClick() {
                if(!confirm("Your current progress will not be saved!")) return;
                importSave("eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTcwNTE2MTAzNTIwMywibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJ0aGVub255bW91c21hZGV0aGlzaWRzb0RPTidUY29weXRoaXN0aGFua3Nub3dnb2F3YXk6My4uLmJ0d2l0J3NjYWxsZWR0aGVwbGFudHJvb3RzaWZ5b3VoYXZlbid0c2VlbmFscmVhZHkiLCJ2ZXJzaW9uIjoiMSIsInRpbWVQbGF5ZWQiOjE2MzIuODM0MDAwMDAwMTQ3LCJrZWVwR29pbmciOmZhbHNlLCJoYXNOYU4iOmZhbHNlLCJwb2ludHMiOiIwIiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fSwiZ2UiOnsibWFpblRhYnMiOiJNYWluIn0sIm9wdGlvbnMiOnsibWFpblRhYnMiOiJSZXNvdXJjZXMifX0sImxhc3RTYWZlVGFiIjoiZ2UiLCJpbmZvYm94ZXMiOnt9LCJpbmZvLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjE2MzIuODM0MDAwMDAwMTQ3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sIm9wdGlvbnMtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTYzMi44MzQwMDAwMDAxNDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiY2hhbmdlbG9nLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjE2MzIuODM0MDAwMDAwMTQ3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImdlIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIxNCIsIm1pdG9jaG9uZHJpYSI6IjIzLjc2MTMzMTQzMzUyNDcwNiIsInRvdGFsIjoiMzAyIiwiYmVzdCI6IjI3IiwicmVzZXRUaW1lIjowLjA1LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOlsxMSwyMSwzMSwyMiwzMywzMiwzNCw0MSw1Myw1MSw1Miw2Miw2MSw2Myw3MSw4MSw4NCw4Myw4NSw4Miw4Niw5Miw5MSwxMDFdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sIm9wdGlvbnMiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJnYW1lU3BlZWQiOjEwMCwiZW5hYmxlU3BlZWQiOmZhbHNlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTMuMDE5MDAwMDAwMDAwMDQsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImJsYW5rIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTYzMi44MzQwMDAwMDAxNDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwidHJlZS10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxNjMyLjgzNDAwMDAwMDE0NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJkZXZTcGVlZCI6MX0=")
            },
            canClick: true,
            style() {return{
                "background-color": tmp.ge.color,
            }},
        },
    },
})