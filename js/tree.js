var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    //tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    tabFormat: [
        ['display-text', function() {return "<h2>Junkyard</h2>"},],
        "blank",
        ['tree',[
            ["b1"], ["b2"], ["b3"],
        ]],
        "blank",
        "blank",

        ['display-text', function() {return tmp.j.layerShown?"<h2>Basement</h2><br>You have <h2>"+format(player.basementPoints)+"</h2> basement points. ("+format(tmp['tree-tab'].basementPointGain)+"/sec)<br>Multiplying point gain by ×"+format(player.basementPoints.max(10).log(10)):null},],
        "blank",
        ['tree',[
            ["j"],
        ]],
        "blank",
        "blank",
    ],
    previousTab: "",
    leftTab: true,
    doReset(resettingLayer) {
        let tree = layers[resettingLayer].tree

        if(tree == "basement") player.basementPoints = new Decimal(0)
    },
    update(diff) {
        player.basementPoints = player.basementPoints.add(tmp['tree-tab'].basementPointGain.mul(diff))
    },
    basementPointGain() {
        let gain = new Decimal(0)
        if(hasUpgrade('b3', 21)) gain = gain.add(1)
        gain = gain.add(buyableEffect('j', 11)[0])
        gain = gain.mul(buyableEffect('j', 11)[1])
        gain = gain.mul(smartUpgradeEffect('j', 11))
        gain = gain.mul(smartUpgradeEffect('j', 12))
        return gain
    },
})