addLayer("extra", {
    name: "extra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "X", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resetTime: 0,
        timespeed: 1,
        letTimespeed: false,
    }},
    color: "#FFAA00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "boosters (1)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tree: "side",
    layerShown(){return true},
    update(diff) {
        player.devSpeed = player.extra.letTimespeed ? new Decimal(player.extra.timespeed).div(100) : new Decimal(1)
    },
    tabFormat: {
        Savebank: {
            content: [
                "clickables",
            ],
        },
        Timespeed: {
            content: [
                ["slider", ["timespeed", 1, 1000]],
                ["toggle", ["extra", "letTimespeed"]],
            ],
        },
    },
    clickables: {
        11: {
            title: "Junkyard",
            display: "area finished",
            canClick: true,
            onClick() {
                if(!confirm("Your current progress will not be saved!")) return;
                importSave("eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTcwMTE5MDIzNzAxNCwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJ5b3lveW8taXRzLXRoZW5vbnltb3VzLXdpdGgtdGhlLWJvb3N0ZXItdHJlZSEtc2t1bGwtZW1vamktaGFoYWlkb2JlbWFraW50aGVpZHVuaXF1ZXRoby15aGh5cG9qb2p2ZW9yaHZhbGtzamRsYWpmaHZlam5uampuZmtqa2p3cjA0Mzh5MzQ5ODU3IiwidmVyc2lvbiI6IjEiLCJ0aW1lUGxheWVkIjo4MTU2LjQzNDA2NTI1Mzg0NSwia2VlcEdvaW5nIjpmYWxzZSwiaGFzTmFOIjpmYWxzZSwicG9pbnRzIjoiMS44MDA5MDkzNDkwMjQ1NTA3ZTIzIiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fSwiZXh0cmEiOnsibWFpblRhYnMiOiJUaW1lc3BlZWQifX0sImxhc3RTYWZlVGFiIjoiYjMiLCJiYXNlbWVudFBvaW50cyI6IjAiLCJpbmZvYm94ZXMiOnt9LCJpbmZvLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjgxNTYuNDM0MDY1MjUzODQ1LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sIm9wdGlvbnMtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6ODE1Ni40MzQwNjUyNTM4NDUsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiY2hhbmdlbG9nLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjgxNTYuNDM0MDY1MjUzODQ1LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImIxIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwicmVzZXRUaW1lIjowLjQ0OTk5OTk5OTk5OTk5OTk2LCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIiwiYWN0aXZlQ2hhbGxlbmdlIjpudWxsfSwiYjIiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjE1IiwicmVzZXRUaW1lIjowLjQ0OTk5OTk5OTk5OTk5OTk2LCJ0b3RhbCI6IjE1IiwiYmVzdCI6IjE1IiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbMTJdLCJtaWxlc3RvbmVzIjpbIjAiLCIxIiwiMiIsIjMiLCI0Il0sImxhc3RNaWxlc3RvbmUiOiI0IiwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIiwiYWN0aXZlQ2hhbGxlbmdlIjpudWxsfSwiYjMiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjE0IiwicmVzZXRUaW1lIjo1MS4zNDk5OTk5OTk5OTk0NywiYlBvdyI6IjIyMC42OTk5OTk5OTk5OTkxNCIsInRvdGFsIjoiMTQiLCJiZXN0IjoiMTQiLCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOlsxMSwxMl0sIm1pbGVzdG9uZXMiOlsiMCIsIjEiLCIyIiwiMyJdLCJsYXN0TWlsZXN0b25lIjoiMyIsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsImFjdGl2ZUNoYWxsZW5nZSI6bnVsbH0sImoiOnsidW5sb2NrZWQiOmZhbHNlLCJwb2ludHMiOiIwIiwicmVzZXRUaW1lIjo4MTU2LjQzNDA2NTI1Mzg0NSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6eyIxMSI6IjAifSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIiLCJhY3RpdmVDaGFsbGVuZ2UiOm51bGx9LCJleHRyYSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInJlc2V0VGltZSI6NzkxOC4zNDQ1MTgxODE1MzIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsInRpbWVzcGVlZCI6IjEwMDAiLCJsZXRUaW1lc3BlZWQiOmZhbHNlfSwiYmxhbmsiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo4MTU2LjQzNDA2NTI1Mzg0NSwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ0cmVlLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjgxNTYuNDM0MDY1MjUzODQ1LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImRldlNwZWVkIjoiMSJ9")
            },
            style() {return{
                'background-color': '#FFAAAA'
            }},
        },
    },
})