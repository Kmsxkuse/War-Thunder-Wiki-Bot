// import * as indexFile from "./index";
import * as fs from 'fs-extra'
import * as path from 'path'
import * as ss from 'simple-statistics'

// TODO: Change everything to % to be mobile friendly.

// Export unfortunately doesn't have much documentation. However, each function/variable are what I hope are self
// documenting. However, some parts, like the Armor Parser, I personally have no clue what's going on.

// And if you're not me, you shouldnt be reading this anyways.

export let ModuleExp = (function exporting() {
    let toGlob = {
        allMethod(input: {} | boolean) {
            const target = createFile(input)
            if ((input.toString() !== 'true', target)) {
                this.startMethod(input, target)
                this.basicMethod(input, target)
                this.weaponMethod(input, target)
                this.beltCompMethod(input, target)
                this.shellMethod(input, target)
                this.beltShellMethod(input, target)
                this.endingMethod(target)
            }
        },
        startMethod(input: {}, target: fs.WriteStream) {
            target.write(startExport(input))
        },
        basicMethod(input: {}, target: fs.WriteStream) {
            target.write(basicExport(input))
        },
        weaponMethod(input: {}, target: fs.WriteStream) {
            target.write(weaponExport(input))
        },
        beltCompMethod(input: {}, target: fs.WriteStream) {
            target.write(beltCompExport(input))
        },
        shellMethod(input: {}, target: fs.WriteStream) {
            target.write(shellExport(input))
        },
        beltShellMethod(input: {}, target: fs.WriteStream) {
            target.write(beltExport(input))
        },
        endingMethod(target: fs.WriteStream) {
            target.write(endDivs())
        }
    }
    function createFile(input: {} | boolean) {
        const destPath = './outputFiles'
        if (!fs.existsSync(destPath) && input.toString() === 'true') {
            console.log(`Creating Export File Directory: ${destPath}`)
            fs.mkdirSync(destPath)
        } else if (input.toString() === 'true') {
            console.log(`Recreating Export File Directory: ${destPath}`)
            fs.removeSync(destPath)
            fs.mkdirSync(destPath)
            return null
        }
        const fileName = input[2],
            extensionName = '.json'
        return fs.createWriteStream(
            `${destPath}/${path.basename(fileName, extensionName)}.html`
        )
    }
    function startExport(input) {
        const toDate = (today: Date) => {
            let dd = today.getDate().toString(),
                mm = (today.getMonth() + 1).toString(), //January is 0!
                yyyy = today.getFullYear()

            if (Number(dd) < 10) {
                dd = '0' + dd
            }

            if (Number(mm) < 10) {
                mm = '0' + mm
            }

            return mm + '/' + dd + '/' + yyyy
        }
        // UPDATE WAR THUNDER VERSION!!!!
        const infoText = `<strong style = "font-size:2em;"> Created by Kmsxkuse. </strong>

Bot Version: [1.0 Alpha]. Bot Last Run: [${toDate(new Date())}].

Database last updated: [${toDate(
            fs.statSync(`./weapons/${input[2].replace(`.json`, `.blkx`)}`).mtime
        )}]. War Thunder Version: [1.83].
        
The following information should be taken with a grain of salt. 

If the numbers dont make sense, assume bugs or missing data. I have no access to server side information that may be modifying the shell data.

If you need to contact the creator, please message /u/Kmsxkuse on www.reddit.com.

<strong style = "font-size:1.5em;"> How numbers are calculated: </strong>

ROF Bar-O-Matic is calculated by multiplying the rate of fire per minute by 30 / 800. 

That value is then the paddingleft css style %.

If the adjusted ROF is > 60 or < 0, then they will be 60 or 0.

Physical Damage is calculated by multiplying the mass of the shell by its (velocity / 100) squared along with hitPowerMult if it exists.

The 1/2 in Ke = 1/2 m v^2 is ignored due to it being a constant and the numbers are for comparison.

High Explosive Damage is calculated by explosiveMass * 100 times the first number in explodeRadius * 100 times explodeHitpower.

Fragmentation Damage is calculated by shutterDamageRadius times shutterAmount times shutterHit.

Belt comparison values for damage are the average of the shells' damage values that compose it.

The rest are values pulled directly from the datamine.`
        const fileName = input[2]
            .slice(0, input[2].lastIndexOf('.'))
            .replace(/\_/g, ' ')
            .replace(/cannon/g, '')
            .replace(/gun/g, '')
            .replace(/(\b[a-z](?!\b))/g, x => {
                return x.toUpperCase()
            })
        const exportFile = `<div class = "mw-customtoggle-header" style="border:mediumturquoise; border-radius: 0.625em; background:lightcyan; padding:0 1%; padding-right:1%; display:inline-block">
<p><strong style = "line-height:1em; font-size:1.75em">Click here for ${fileName} Belts!</strong></p>
</div>
<div class = "mw-collapsible mw-collapsed" id="mw-customcollapsible-header" style = "width:100%; overflow:auto">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; overflow:auto; padding:1%">
<div class = "mw-customtoggle-glossary" style="font-size:1.2em; text-align:center; width:auto; overflow:auto; border:solid crimson; border-radius: 0.625em; background:lightpink">
<strong>Information Page</strong>
</div>
<div class = "mw-collapsible mw-collapsed" id = "mw-customcollapsible-glossary" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin-left:1%; padding:0 1%; overflow:auto">
${infoText}
</div>
</div>\n`
        return exportFile
    }

    function basicExport(input) {
        const fileName = input[2]
            .slice(0, input[2].lastIndexOf('.'))
            .replace(/\_/g, ' ')
            .replace(/cannon/g, '')
            .replace(/gun/g, '')
            .replace(/(\b[a-z](?!\b))/g, function(x) {
                return x.toUpperCase()
            })
        const exportFile = `<div>
<strong style = "line-height:2em; font-size:2.5em">${fileName}</strong>
<hr/>
<br />
<b>Pros:</b>
* Insert Pros Here!
<b>Cons:</b>
* Insert Cons Here!
<br />
</div>\n`
        return exportFile
    }

    function weaponExport(input) {
        const spadeDisp = Math.round(
            Math.tan((input[1].maxDeltaAngle * Math.PI) / 180) * 500
        )
        const stockDisp = Math.round(
            Math.tan((input[0][4].maxDeltaAngle * Math.PI) / 180) * 500
        )
        const effectDist = () => {
            if (input[0][1][0].effectiveDistance) {
                // I could find all the effective Distances of all shells and average them but ehhhhh.
                return input[0][1][0].effectiveDistance
            } else {
                return 'None Specified'
            }
        }
        const caliber = input[0][1][0].caliber * 1000
        const cannon = () => {
            const isCannon = input[1].cannon
            if (isCannon) {
                return 'Yes'
            } else {
                return 'No'
            }
        }
        const ROF = Math.round(input[1].shotFreq * 60)
        const paddingLeft = (ROF: number) => {
            let tempPadLeft = (ROF * 30) / 800
            if (tempPadLeft > 60) {
                tempPadLeft = 60
            } else if (tempPadLeft < 0) {
                tempPadLeft = 0
            }
            return tempPadLeft
        }
        const wikiTablizer = `{|class="wikitable" style = "width:75%; margin:0 auto 1em; font-size:1.2em"
|+ style = "width:auto; font-size:2.0em; text-align:center; margin:0.5em 0 1em" | Rate Of Fire: ~ ${ROF} rounds per minute
! style = "width:33%" | Cannon
! style = "width:33%" | Caliber
! style = "width:33%" | Effective Distance
|-
| style = "text-align:center" | ${cannon()}
| style = "text-align:center" | ${caliber}mm
| style = "text-align:center" | ${effectDist()}m
|}
{|class="wikitable" style = "width:75%; margin:0 auto 1em; font-size:1.2em"
! style = "width:50%" | Spaded Disp @ 500m
! style = "width:50%" | Stock Disp @ 500m
|-
| style = "text-align:center" | ${spadeDisp}m
| style = "text-align:center" | ${stockDisp}m
|}
</div>
</div>\n`
        const barOMatic = `<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin-left:1%; padding:1%; overflow:auto">
<div style = "text-align:center; font-size:1.5em;">RoF Bar-o-matic:</div>
<div style = "background: linear-gradient(to right, red, yellow, green); font-size:3em; width:auto; height:1em; padding:1% 0 0 ${paddingLeft(
            ROF
        )}%; margin:0.3em 19.5% 0.25em"> | </div>\n`
        const exportFile =
            `<div class = "mw-customtoggle-weaponInfo" style="font-size:1.2em; text-align:center; width:auto; overflow:auto; border:solid green; border-radius: 0.625em; background:lightgreen;">
<strong><i>Weapon Information</i></strong>
</div>
<div class = "mw-collapsible" id = "mw-customcollapsible-weaponInfo" style = "width:99%; overflow:auto;">\n` +
            barOMatic +
            wikiTablizer
        return exportFile
    }

    // Following are common functions between belt, shell, and beltshell comparison.
    const isColored = (row: number, version: number) => {
        switch (version) {
            case 0:
                if (row % 2 != 0) {
                    return `background:PowderBlue`
                }
                return `background:LightCyan`
            case 1:
                if (row % 2 != 0) {
                    return `background:SandyBrown`
                }
                return `background:Bisque`
            case 2:
                if (row % 2 != 0) {
                    return `background:Plum`
                }
                return `background:Lavender`
            default:
                return ``
        }
    }
    const headerColor = (version: number) => {
        switch (version) {
            case 0:
                return 'background:LightSkyBlue'
            case 1:
                return 'background:Coral'
            case 2:
                return 'background:PaleVioletRed' // Possibly Orchid. Is a bit pink.
            default:
                return 'background:LightGray'
        }
    }
    const tableTemplate = (
        indexNum: number,
        methods,
        amountIndex: string[][],
        input,
        names: string[][],
        version: number
    ) => {
        // indexNum = # in amountIndex. Methods = table values. Input = info from main.ts. Version: 0 for belt, 1 for shells.
        // AmountBelts = AmountShells
        let amountBelts, tableWidth // Style universal values below.
        let combinedTable = `{| style = "width:75%; text-align:center; margin:0 auto 1%; font-size:1.2em"
|+ style = "width:auto; font-size:1.5em; margin:0.5em 0 0.5em" | ${
            names[1][indexNum]
        }\n`
        if (version == 0) {
            amountBelts = input[0][0].length + 1
            tableWidth = Math.round(100 / (amountBelts + 1))
            combinedTable += `! style = "width:${tableWidth}%" |
! style = "width:${tableWidth}%; ${headerColor(version)}" | Default\n`
            for (let col = 0; col < amountBelts - 1; col++) {
                const beltName = input[0][0][col]
                    .slice(input[0][0][col].indexOf('_') + 1)
                    .replace(/_/g, ' ')
                    .replace(/(\b[a-z](?!\b))/g, function(x) {
                        return x.toUpperCase()
                    })
                combinedTable += `! style = "width:${tableWidth}%; ${headerColor(
                    version
                )}" | ${beltName}\n`
            }
        } else if (version == 1) {
            amountBelts = input[0][3].length // AmountShells
            tableWidth = Math.round(100 / (amountBelts + 1))
            combinedTable += `! style = "width:${tableWidth}%" |\n`
            for (let col = 0; col < amountBelts; col++) {
                let shellName = `Null`
                if (input[0][3][col].bulletType) {
                    shellName = input[0][3][col].bulletType
                        .replace(/_/g, ' ')
                        .replace(/(\b[a-z])/g, function(x) {
                            return x.toUpperCase()
                        })
                }
                combinedTable += `! style = "width:${tableWidth}%; ${headerColor(
                    version
                )}" | ${shellName}\n`
            }
        }
        for (const row in amountIndex[indexNum]) {
            combinedTable += `|-
! style = "${headerColor(version)}" | ${amountIndex[indexNum][row]}\n`
            for (let col = 0; col < amountBelts; col++) {
                combinedTable += `| style = "${isColored(
                    parseInt(row),
                    version
                )}" | ${methods.index[row](col)}\n`
            }
        }
        combinedTable += `|}\n`
        return combinedTable
    }

    const oldTableTemplate = (
        methods,
        amountIndex: string[][],
        input,
        names: string[][],
        version: number,
        beltNum: number
    ) => {
        let combinedTable = `{| style = "width:100em; text-align:center; margin:0 auto 1%; font-size:1em"\n`
        // `|+ style = "width:auto; text-align:center; margin:0.5em 0 0.5em" |\n` //for header. Not needed.
        if (version == 0) {
        } else if (version == 1) {
        } else if (version == 2) {
            combinedTable += `! rowspan="2" style = "${headerColor(
                version
            )}"| Shell Name\n`
            for (const upperRow in names[1]) {
                // Upper Row Names
                const numLowerRow = amountIndex[upperRow].length
                combinedTable += `! colspan="${numLowerRow}" style = "${headerColor(
                    version
                )}"| ${names[1][upperRow]}\n`
            }
            combinedTable += `|-\n`
            for (const lowerRow in amountIndex) {
                for (const lowRowVal in amountIndex[lowerRow]) {
                    // Lower Row Names
                    combinedTable += `! style = "${headerColor(version)}"| ${
                        amountIndex[lowerRow][lowRowVal]
                    }\n`
                }
            }
            const shellName = [`Error`]
            if (beltNum != 0) {
                // Finding shell names in each belt.
                for (const bullets in input[0][2][beltNum - 1]) {
                    shellName.push(input[0][2][beltNum - 1][bullets].bulletType)
                }
            } else {
                // Default Shell names.
                for (const bullets in input[0][1]) {
                    shellName.push(input[0][1][bullets].bulletType)
                }
            }
            shellName.shift()
            for (const row in shellName) {
                let bulletName = 'Null'
                if (shellName[row]) {
                    // Cleaning shell names to be presentable.
                    bulletName = shellName[row]
                        .replace(/_/g, ' ')
                        .replace(/(\b[a-z])/g, function(x) {
                            return x.toUpperCase()
                        })
                }
                combinedTable += `|-
! style = "${headerColor(version)}" | ${bulletName}\n`
                for (const outerCol in amountIndex) {
                    for (const innerCol in amountIndex[outerCol]) {
                        // Inputting values
                        combinedTable += `| style = "${isColored(
                            parseInt(row),
                            version
                        )}" | ${methods.index(
                            shellName[row],
                            parseInt(outerCol),
                            parseInt(innerCol)
                        )}\n`
                    }
                }
            }
        }
        combinedTable += `|}\n`
        return combinedTable
    }

    const internalButtons = (
        amount: number,
        typeName: string,
        typeNumber: number,
        names: string[][]
    ) => {
        // Amount = number of headers.
        let combinedButton = `` // Button construction. Mainly changing the ID names.
        for (let row = 0; row <= amount; row++) {
            if (row != 0) {
                combinedButton += `<div class = "mw-collapsible mw-collapsed" id = "mw-customcollapsible-${typeName +
                    row}" style="margin:0.5em auto; text-align: center">\n`
            } else {
                combinedButton += `<div class = "mw-collapsible" id = "mw-customcollapsible-${typeName +
                    row}" style="margin:0.5em auto; text-align: center">\n`
            }
            for (let col = 0; col <= amount; col++) {
                if (row == col) {
                    combinedButton += `<div style="border:mediumturquoise; border-radius: 0.625em; background:lightgreen; padding:0 1%; padding-right:1%; display:inline-block">
<p><strong style = "line-height:1em; font-size:1.75em">${
                        names[typeNumber][col]
                    }</strong></p>
</div>\n`
                } else {
                    combinedButton += `<div class = "mw-customtoggle-${typeName +
                        row} mw-customtoggle-${typeName +
                        col}" style="border:mediumturquoise; border-radius: 0.625em; background:lightblue; padding:0 1%; padding-right:1%; display:inline-block">
<p><strong style = "line-height:1em; font-size:1.75em">${
                        names[typeNumber][col]
                    }</strong></p>
</div>\n`
                }
            }
            combinedButton += `</div>\n`
        }
        return combinedButton
    }

    const internalTableHeader = (version: number, typeName: string) => {
        return `<div class = "mw-collapsible mw-collapsed" id = "mw-customcollapsible-${typeName +
            version}" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "background:white; margin-left:1%; padding:0 1%; overflow:auto">`
    }

    const internalTableEnder = `</div>
</div>`

    const armorEqu = (
        values: number[][],
        col: number,
        dist: number | undefined
    ) => {
        // Linear Regression.
        // X and Y Values are reversed. Shouldnt Matter for Linear Regression.
        const line = ss.linearRegression(values) // Estimated values based on armor pen Line of Best Fit.
        if (dist) {
            return ((dist - line.b) / line.m).toFixed(2)
        }
        return ss
            .rSquared(values, x => {
                return line.m * x + line.b
            })
            .toFixed(2)
    }
    // Everything beyond this is pretty repetitive. Just different implementation.
    function beltCompExport(input) {
        const amountIndex = [
            [`Physical`, `H.E.`, `Frag.`],
            [`Caliber`, `Tracer`],
            [`R²`, `100m`, `250m`, `500m`, `750m`, `1000m`],
            [`Damage Rating`, `Fire Rating`],
            [`Damage Rating`, `Radius`, `Pen.`],
            [`Damage Rating`, `Radius`, `Pen.`]
        ]
        const names = [
            [
                'Damage',
                'Properties',
                'Penetration',
                'Physical',
                'High Explosive',
                'Fragmentation'
            ],
            [
                'Damage Comparisons',
                'Projectile Properties',
                'Maximum Penetration (mm)',
                'Physical Projectile Damage',
                'High Explosive Damage',
                'Fragmentation Damage'
            ]
        ]
        const damageLookup = (
            belt: number,
            version: number,
            searchIndex: string[],
            input
        ) => {
            let counter = 1,
                avgDam = 0,
                searchBelt = []
            if (belt == 0 && input[0][1][0]) {
                searchBelt = input[0][1]
            } else if (input[0][2][belt - 1]) {
                searchBelt = input[0][2][belt - 1]
            } else {
                return -1
            }
            for (const bullet in searchBelt) {
                let point = 0
                switch (version) {
                    case 0: //Moving Averages
                        if (
                            searchBelt[bullet][searchIndex[0]] ||
                            searchBelt[bullet][searchIndex[1]]
                        ) {
                            //Skipping first value of search index
                            point = 1
                            for (let key = 1; key < searchIndex.length; key++) {
                                if (searchBelt[bullet][searchIndex[key]]) {
                                    //Manual Offsets
                                    switch (searchIndex[key]) {
                                        case 'speed':
                                            point *=
                                                (searchBelt[bullet][
                                                    searchIndex[key]
                                                ] /
                                                    100) **
                                                2 // So the numbers dont get too large
                                            break
                                        case 'explosiveMass':
                                            point *=
                                                searchBelt[bullet][
                                                    searchIndex[key]
                                                ] * 100
                                            break
                                        case 'explodeRadius':
                                            point *=
                                                searchBelt[bullet][
                                                    searchIndex[key]
                                                ][0] * 100
                                            break
                                        default:
                                            point *=
                                                searchBelt[bullet][
                                                    searchIndex[key]
                                                ]
                                            break
                                    }
                                }
                            }
                        }
                        avgDam = avgDam + (point - avgDam) / counter
                        counter++
                        break
                    case 1: //Maximum. Hardcoded to accept only 1 search index other than the main existence checker.
                        if (
                            searchBelt[bullet][searchIndex[0]] &&
                            searchBelt[bullet][searchIndex[1]] &&
                            avgDam < searchBelt[bullet][searchIndex[1]]
                        ) {
                            avgDam = searchBelt[bullet][searchIndex[1]]
                        } else if (
                            searchBelt[bullet][searchIndex[0]] &&
                            searchBelt[bullet][searchIndex[1]][0] &&
                            avgDam < searchBelt[bullet][searchIndex[1]][0]
                        ) {
                            avgDam = searchBelt[bullet][searchIndex[1]][0]
                        }
                        break
                }
            }
            return avgDam
        }
        const frag = input => {
            const fragObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius',
                            'shutterAmount',
                            'shutterHit'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' m'
                        )
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterArmorPower'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' mm'
                        )
                    }
                ]
            }
            const indexNum = 5 // Number 5 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                fragObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        const highExp = input => {
            const heObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'explosiveMass',
                            'explodeHitPower',
                            'explosiveMass', //Manually times 100
                            'explodeRadius' //Manually times 100
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = ['explodeHitPower', 'explodeRadius']
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' m'
                        )
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'explodeHitPower',
                            'explodeArmorPower'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' mm'
                        )
                    }
                ]
            }
            const indexNum = 4 // Number 4 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                heObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        const physical = input => {
            const phyObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'mass',
                            'mass',
                            'speed',
                            'hitPowerMult'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'onHitChanceMultFire',
                            'onHitChanceMultFire'
                        ]
                        return (
                            'x' +
                            damageLookup(belt, 0, searchIndex, input).toFixed(2)
                        )
                    }
                ]
            }
            const indexNum = 3 // Number 3 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                phyObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        let armorPen = [
                // Stock or Spaded?
                [
                    // Numb or Bullet
                    [
                        // Actual Belt
                        [15, 1] // Armorpower
                    ]
                ] // armorPen[belt][bullet][armorpower in m]
            ],
            armorParse = (belt: number, input) => {
                // Not relocating this outside. Nope.
                let numb = 0
                // The following attempts to pull individual values from within a bullet's armorpower object and replace
                // it with an array of the same inner arrays.
                try {
                    // I dont know what the fuck this is but it works so im not going to touch it.
                    if (belt == 0 && input[0][1]) {
                        for (const stockBelt of input[0][1]) {
                            for (const key in stockBelt.armorpower) {
                                armorPen[belt][numb].push(
                                    stockBelt.armorpower[key]
                                )
                            }
                            armorPen[belt].push([[13, 1]])
                            armorPen[belt][numb].shift()
                            numb++
                        }
                        armorPen[belt].pop()
                    } else if (input[0][2][belt - 1]) {
                        for (const spadedBelt of input[0][2][belt - 1]) {
                            armorPen.push([[[12, 1]]])
                            for (const key in spadedBelt.armorpower) {
                                armorPen[belt][numb].push(
                                    spadedBelt.armorpower[key]
                                )
                            }
                            armorPen[belt].push([[11, 1]])
                            armorPen[belt][numb].shift()
                            numb++
                        }
                        armorPen[belt].pop()
                    } else {
                        throw new Error('Error. ArmorPower Not Found.')
                    }
                } catch (err) {
                    return `None Found: ${err}`
                }
                return armorPen
            }
        const findLargest = (values: number[][][]) => {
            let currentLar = [0, 0],
                currentArr = 0 // I think I can replace currentArr with key. For later.
            try {
                for (const key in values) {
                    if (values[key][0][1] > currentLar[0]) {
                        currentLar[0] = values[key][0][0]
                        currentLar[1] = currentArr
                    }
                    currentArr++
                }
            } catch (err) {
                // Doesn't matter.
            }
            return currentLar[1]
        }
        const penTable = input => {
            const penObj = {
                index: [
                    (belt: number) => {
                        //R^2
                        armorParse(belt, input)
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            undefined
                        )
                    },
                    (belt: number) => {
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            100
                        )
                    },
                    (belt: number) => {
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            250
                        )
                    },
                    (belt: number) => {
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            500
                        )
                    },
                    (belt: number) => {
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            750
                        )
                    },
                    (belt: number) => {
                        return armorEqu(
                            armorPen[belt][findLargest(armorPen[belt])],
                            belt,
                            1000
                        )
                    }
                ]
            }
            const indexNum = 2 // Number 2 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                penObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        const damageComp = input => {
            const damObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'mass',
                            'mass',
                            'speed',
                            'hitPowerMult'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'explosiveMass',
                            'explodeHitPower',
                            'explosiveMass', //Manually times 100
                            'explodeRadius' //Manually times 100
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius',
                            'shutterAmount',
                            'shutterHit'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    }
                ]
            }
            const indexNum = 0 // Number 0 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                damObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        const projProp = input => {
            const projObj = {
                // Maximum amount of index allowed = number of things in amountIndex
                index: [
                    (belt: number) => {
                        // Caliber
                        if (belt == 0 && input[0][1][0]) {
                            return (
                                (input[0][1][0].caliber * 1000).toString() +
                                'mm'
                            )
                        } else if (input[0][2][belt - 1][0]) {
                            return (
                                (
                                    input[0][2][belt - 1][0].caliber * 1000
                                ).toString() + 'mm'
                            )
                        } else {
                            return `None Found.`
                        }
                    },
                    (belt: number) => {
                        // Tracer
                        if (belt == 0) {
                            for (const stockBelt of input[0][1]) {
                                if (
                                    stockBelt.visual &&
                                    stockBelt.visual.tracer !== 'noColor'
                                ) {
                                    return 'Yes'
                                }
                            }
                        } else {
                            for (const spadedBelt of input[0][2][belt - 1]) {
                                if (
                                    spadedBelt.visual &&
                                    spadedBelt.visual.tracer !== 'noColor'
                                ) {
                                    return 'Yes'
                                }
                            }
                        }
                        return 'No'
                    }
                ]
            }
            const indexNum = 1 // Number 1 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                projObj,
                amountIndex,
                input,
                names,
                0
            )
            return completedTable
        }
        const internalFile = `<div class = "mw-collapsible" id = "mw-customcollapsible-internal0" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "background:white; margin-left:1%; padding:0 1%; overflow:auto">
${damageComp(input)}
${internalTableEnder}
${internalTableHeader(1, 'internal')}
${projProp(input)}
${internalTableEnder}
${internalTableHeader(2, 'internal')}
${penTable(input)}
${internalTableEnder}
${internalTableHeader(3, 'internal')}
${physical(input)}
${internalTableEnder}
${internalTableHeader(4, 'internal')}
${highExp(input)}
${internalTableEnder}
${internalTableHeader(5, 'internal')}
${frag(input)}
${internalTableEnder}
${internalButtons(5, 'internal', 0, names)}` // When changing 'internal' name, dont forget internalFile ID above.

        const exportFile = `<div class = "mw-customtoggle-beltCompare" style="font-size:1.2em; text-align:center; width:auto; overflow:auto; border:solid blue; border-radius: 0.625em; background:lightskyblue">
<strong><i>Belt Comparison</i></strong>
</div>
<div class = "mw-collapsible" id = "mw-customcollapsible-beltCompare" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin-left:1%; padding:0 1%; overflow:auto">
${internalFile}
</div>
</div>\n`
        return exportFile
    }

    // Used in shellExport and beltExport.
    let bulletArmorPen
    const armorParseShell = (bullet: number, input) => {
        try {
            // Literally magic.
            bulletArmorPen.push([[14, 1]])
            for (const key in input[0][3][bullet].armorpower) {
                bulletArmorPen[bullet].push(input[0][3][bullet].armorpower[key])
            }
            bulletArmorPen[bullet].shift()
        } catch (err) {
            return err
        }
        return bulletArmorPen[bullet]
    }

    function shellExport(input) {
        // Split value hunting to seperate object array?
        const amountIndex = [
            [`Physical`, `H.E.`, `Frag.`],
            [`Caliber`, `Tracer`, `Velocity`, `Mass`],
            [`R²`, `100m`, `250m`, `500m`, `750m`, `1000m`],
            [`Damage Rating`, `Fire Rating`],
            [`Damage Rating`, `Radius`, `Pen.`],
            [`Damage Rating`, `Radius`, `Pen.`]
        ]
        const names = [
            [
                'Damage',
                'Properties',
                'Penetration',
                'Physical',
                'High Explosive',
                'Fragmentation'
            ],
            [
                'Damage Comparisons',
                'Projectile Properties',
                'Shell Penetration (mm)',
                'Physical Projectile Damage',
                'High Explosive Damage',
                'Fragmentation Damage'
            ]
        ]

        const damageLookup = (
            bullet: number,
            version: number,
            searchIndex: string[],
            input
        ) => {
            let avgDam = 0,
                searchBelt = []
            if (input[0][3]) {
                searchBelt = input[0][3]
            } else {
                return -1
            }
            let point = 0
            switch (version) {
                case 0: //Moving Averages
                    if (
                        searchBelt[bullet][searchIndex[0]] ||
                        searchBelt[bullet][searchIndex[1]]
                    ) {
                        //Skipping first value of search index
                        point = 1
                        for (let key = 1; key < searchIndex.length; key++) {
                            if (searchBelt[bullet][searchIndex[key]]) {
                                //Manual Offsets
                                switch (searchIndex[key]) {
                                    case 'speed':
                                        point *=
                                            (searchBelt[bullet][
                                                searchIndex[key]
                                            ] /
                                                100) **
                                            2 // So the numbers dont get too large
                                        break
                                    case 'explosiveMass':
                                        point *=
                                            searchBelt[bullet][
                                                searchIndex[key]
                                            ] * 100
                                        break
                                    case 'explodeRadius':
                                        point *=
                                            searchBelt[bullet][
                                                searchIndex[key]
                                            ][0] * 100
                                        break
                                    default:
                                        point *=
                                            searchBelt[bullet][searchIndex[key]]
                                        break
                                }
                            }
                        }
                    }
                    avgDam = point
                    break
                case 1: //Maximum. Hardcoded to accept only 1 search index other than the main existence checker.
                    if (
                        searchIndex[1] !== 'explodeRadius' &&
                        searchBelt[bullet][searchIndex[0]] &&
                        searchBelt[bullet][searchIndex[1]]
                    ) {
                        avgDam = searchBelt[bullet][searchIndex[1]]
                    } else if (
                        searchBelt[bullet][searchIndex[0]] &&
                        searchBelt[bullet][searchIndex[1]][0]
                    ) {
                        avgDam = searchBelt[bullet][searchIndex[1]][0]
                    }
                    break
            }
            return avgDam
        }
        const damageComp = input => {
            const damObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'mass',
                            'mass',
                            'speed',
                            'hitPowerMult'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'explosiveMass',
                            'explodeHitPower',
                            'explosiveMass', //Manually times 100
                            'explodeRadius' //Manually times 100
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius',
                            'shutterAmount',
                            'shutterHit'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    }
                ]
            }
            const indexNum = 0 // Number 0 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                damObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }
        const projProp = input => {
            const projObj = {
                index: [
                    (belt: number) => {
                        // Caliber
                        if (input[0][3][belt]) {
                            return (
                                (input[0][3][belt].caliber * 1000).toString() +
                                'mm'
                            )
                        } else {
                            return `None Found.`
                        }
                    },
                    (belt: number) => {
                        // Tracer
                        if (
                            input[0][3][belt].visual &&
                            input[0][3][belt].visual.tracer !== 'noColor'
                        ) {
                            return 'Yes'
                        }
                        return 'No'
                    },
                    (belt: number) => {
                        // Velocity
                        if (input[0][3][belt]) {
                            return input[0][3][belt].speed + `m/s`
                        } else {
                            return `None Found.`
                        }
                    },
                    (belt: number) => {
                        // Mass
                        if (input[0][3][belt]) {
                            return (
                                (input[0][3][belt].mass * 1000).toFixed(0) + `g`
                            )
                        } else {
                            return `None Found.`
                        }
                    }
                ]
            }
            const indexNum = 1 // Number 1 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                projObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }

        bulletArmorPen = [[[15, 1]]] // Reseting array. I would love to put armorParseShell() outside but belt is needed.
        const penTable = input => {
            const penObj = {
                index: [
                    (belt: number) => {
                        armorParseShell(belt, input) // belt called many times. Just index[0] called 5 or so times.
                        return armorEqu(bulletArmorPen[belt], belt, undefined)
                    },
                    (belt: number) => {
                        return armorEqu(bulletArmorPen[belt], belt, 100)
                    },
                    (belt: number) => {
                        return armorEqu(bulletArmorPen[belt], belt, 250)
                    },
                    (belt: number) => {
                        return armorEqu(bulletArmorPen[belt], belt, 500)
                    },
                    (belt: number) => {
                        return armorEqu(bulletArmorPen[belt], belt, 750)
                    },
                    (belt: number) => {
                        return armorEqu(bulletArmorPen[belt], belt, 1000)
                    }
                ]
            }
            const indexNum = 2 // Number 2 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                penObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }
        const physical = input => {
            const phyObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'mass',
                            'mass',
                            'speed',
                            'hitPowerMult'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'onHitChanceMultFire',
                            'onHitChanceMultFire'
                        ]
                        return (
                            'x' +
                            damageLookup(belt, 1, searchIndex, input).toFixed(2)
                        )
                    }
                ]
            }
            const indexNum = 3 // Number 3 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                phyObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }
        const highExp = input => {
            const heObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'explosiveMass',
                            'explodeHitPower',
                            'explosiveMass', //Manually times 100
                            'explodeRadius' //Manually times 100
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = ['explodeHitPower', 'explodeRadius']
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' m'
                        )
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'explodeHitPower',
                            'explodeArmorPower'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' mm'
                        )
                    }
                ]
            }
            const indexNum = 4 // Number 4 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                heObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }
        const frag = input => {
            const fragObj = {
                index: [
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius',
                            'shutterAmount',
                            'shutterHit'
                        ]
                        return damageLookup(
                            belt,
                            0,
                            searchIndex,
                            input
                        ).toFixed(2)
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' m'
                        )
                    },
                    (belt: number) => {
                        const searchIndex = [
                            'shutterDamage',
                            'shutterArmorPower'
                        ]
                        return (
                            damageLookup(belt, 1, searchIndex, input).toFixed(
                                2
                            ) + ' mm'
                        )
                    }
                ]
            }
            const indexNum = 5 // Number 5 in AmountIndex
            const completedTable = tableTemplate(
                indexNum,
                fragObj,
                amountIndex,
                input,
                names,
                1
            )
            return completedTable
        }
        const internalFile = `<div class = "mw-collapsible" id = "mw-customcollapsible-shell0" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "background:white; margin-left:1%; padding:0 1%; overflow:auto">
${damageComp(input)}
${internalTableEnder}
${internalTableHeader(1, 'shell')}
${projProp(input)}
${internalTableEnder}
${internalTableHeader(2, 'shell')}
${penTable(input)}
${internalTableEnder}
${internalTableHeader(3, 'shell')}
${physical(input)}
${internalTableEnder}
${internalTableHeader(4, 'shell')}
${highExp(input)}
${internalTableEnder}
${internalTableHeader(5, 'shell')}
${frag(input)}
${internalTableEnder}
${internalButtons(5, 'shell', 0, names)}`
        const exportFile = `<div class = "mw-customtoggle-shells" style="font-size:1.2em; text-align:center; width:auto; overflow:auto; border:solid orange; border-radius: 0.625em; background:mistyrose">
<strong><i>Shells</i></strong>
</div>
<div class = "mw-collapsible" id = "mw-customcollapsible-shells" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin-left:1%; padding:0 1%; overflow:auto">
${internalFile}
</div>
</div>\n`
        return exportFile
    }

    function beltExport(input) {
        const amountIndex = [
            [`Caliber`, `Tracer`, `Velocity`, `Mass`],
            [`R²`, `100m`, `250m`, `500m`, `750m`, `1000m`],
            [`Damage<br/>Rating`, `Fire<br/>Rating`],
            [`Damage<br/>Rating`, `Radius`, `Pen.`],
            [`Damage<br/>Rating`, `Radius`, `Pen.`]
        ]
        const names = [
            [
                'Properties',
                'Penetration',
                'Physical',
                'High Explosive',
                'Fragmentation'
            ],
            [
                'Projectile Properties',
                'Shell Penetration (mm)',
                'Physical Projectile<br/>Damage',
                'High Explosive<br/>Damage',
                'Fragmentation<br/>Damage'
            ]
        ]
        const findBullet = (input, bullet: string) => {
            for (const internal in input[0][3]) {
                if (
                    input[0][3][internal].bulletType &&
                    input[0][3][internal].bulletType === bullet
                ) {
                    return [input[0][3][internal], parseInt(internal)]
                }
            }
            return undefined
        }
        const shellBeltTables = (input, beltNum: number) => {
            const damageLookup = (
                version: number,
                searchIndex: string[],
                foundBullet
            ) => {
                let avgDam = 0
                let point = 0
                switch (version) {
                    case 0: //Moving Averages
                        if (
                            foundBullet[searchIndex[0]] ||
                            foundBullet[searchIndex[1]]
                        ) {
                            //Skipping first value of search index
                            point = 1
                            for (let key = 1; key < searchIndex.length; key++) {
                                if (foundBullet[searchIndex[key]]) {
                                    //Manual Offsets
                                    switch (searchIndex[key]) {
                                        case 'speed':
                                            point *=
                                                (foundBullet[searchIndex[key]] /
                                                    100) **
                                                2 // So the numbers dont get too large
                                            break
                                        case 'explosiveMass':
                                            point *=
                                                foundBullet[searchIndex[key]] *
                                                100
                                            break
                                        case 'explodeRadius':
                                            point *=
                                                foundBullet[
                                                    searchIndex[key]
                                                ][0] * 100
                                            break
                                        default:
                                            point *=
                                                foundBullet[searchIndex[key]]
                                            break
                                    }
                                }
                            }
                        }
                        avgDam = point
                        break
                    case 1: //Maximum. Hardcoded to accept only 1 search index other than the main existence checker.
                        if (
                            searchIndex[1] !== 'explodeRadius' &&
                            foundBullet[searchIndex[0]] &&
                            foundBullet[searchIndex[1]]
                        ) {
                            avgDam = foundBullet[searchIndex[1]]
                        } else if (
                            foundBullet[searchIndex[0]] &&
                            foundBullet[searchIndex[1]][0]
                        ) {
                            avgDam = foundBullet[searchIndex[1]][0]
                        }
                        break
                }
                return avgDam
            }
            const caliber = foundBullet => {
                return foundBullet.caliber * 1000 + 'mm'
            }
            const tracer = foundBullet => {
                if (
                    foundBullet.visual &&
                    foundBullet.visual.tracer !== 'noColor'
                ) {
                    return 'Yes'
                } else if (foundBullet.visual) {
                    return 'No'
                }
            }
            const velocity = foundBullet => {
                return foundBullet.speed + 'm/s'
            }
            const mass = foundBullet => {
                return foundBullet.mass * 1000 + 'g'
            }
            const physical = (foundBullet, innerCol) => {
                let searchIndex = ['']
                switch (innerCol) {
                    case 0:
                        searchIndex = ['mass', 'mass', 'speed', 'hitPowerMult']
                        return damageLookup(
                            0,
                            searchIndex,
                            foundBullet
                        ).toFixed(2)
                    case 1:
                        searchIndex = [
                            'onHitChanceMultFire',
                            'onHitChanceMultFire'
                        ]
                        return (
                            'x' +
                            damageLookup(1, searchIndex, foundBullet).toFixed(2)
                        )
                }
            }
            const highExp = (foundBullet, innerCol) => {
                let searchIndex = ['']
                switch (innerCol) {
                    case 0:
                        searchIndex = [
                            'explosiveMass',
                            'explodeHitPower',
                            'explosiveMass', //Manually times 100
                            'explodeRadius' //Manually times 100
                        ]
                        return damageLookup(
                            0,
                            searchIndex,
                            foundBullet
                        ).toFixed(2)
                    case 1:
                        searchIndex = ['explodeHitPower', 'explodeRadius']
                        return (
                            damageLookup(1, searchIndex, foundBullet).toFixed(
                                2
                            ) + ' m'
                        )
                    case 2:
                        searchIndex = ['explodeHitPower', 'explodeArmorPower']
                        return (
                            damageLookup(1, searchIndex, foundBullet).toFixed(
                                2
                            ) + ' mm'
                        )
                }
            }
            const fragment = (foundBullet, innerCol) => {
                let searchIndex = ['']
                switch (innerCol) {
                    case 0:
                        searchIndex = [
                            'shutterDamage',
                            'shutterDamageRadius',
                            'shutterAmount',
                            'shutterHit'
                        ]
                        return damageLookup(
                            0,
                            searchIndex,
                            foundBullet
                        ).toFixed(2)
                    case 1:
                        searchIndex = ['shutterDamage', 'shutterDamageRadius']
                        return (
                            damageLookup(1, searchIndex, foundBullet).toFixed(
                                2
                            ) + ' m'
                        )
                    case 2:
                        searchIndex = ['shutterDamage', 'shutterArmorPower']
                        return (
                            damageLookup(1, searchIndex, foundBullet).toFixed(
                                2
                            ) + ' mm'
                        )
                }
            }
            const shellOut = {
                index: (
                    bulletName: string,
                    outerCol: number,
                    innerCol: number
                ) => {
                    // outerCol = names[0], innerCol = amountIndex[outerCol]
                    const foundBullet = findBullet(input, bulletName)
                    if (foundBullet == undefined) {
                        return 'ERROR'
                    }
                    switch (
                        outerCol // Manually coded in.
                    ) {
                        case 0: // Properties
                            switch (innerCol) {
                                case 0:
                                    return caliber(foundBullet[0])
                                case 1:
                                    return tracer(foundBullet[0])
                                case 2:
                                    return velocity(foundBullet[0])
                                case 3:
                                    return mass(foundBullet[0])
                            }
                            break
                        case 1: // Pen
                            switch (innerCol) {
                                case 0:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        undefined
                                    )
                                case 1:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        100
                                    )
                                case 2:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        250
                                    )
                                case 3:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        500
                                    )
                                case 4:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        750
                                    )
                                case 5:
                                    return armorEqu(
                                        bulletArmorPen[foundBullet[1]],
                                        foundBullet[1],
                                        1000
                                    )
                            }
                            break
                        case 2: // Physical
                            return physical(foundBullet[0], innerCol)
                        case 3: // HE
                            return highExp(foundBullet[0], innerCol)
                        case 4: // Frag
                            return fragment(foundBullet[0], innerCol)
                        default:
                            // Bugcatcher
                            return '6'
                    }
                }
            }
            return oldTableTemplate(
                shellOut,
                amountIndex,
                input,
                names,
                2,
                beltNum
            )
        }
        const multiBelt = input => {
            let constructedString = ``
            const beltName = (beltNumber: number, input) => {
                // I could delete the input parameter but I like redundancy.
                if (beltNumber == 0) {
                    return `Default`
                } else {
                    return input[0][0][beltNumber - 1]
                        .slice(input[0][0][beltNumber - 1].indexOf('_') + 1)
                        .replace(/_/g, ' ')
                        .replace(/(\b[a-z](?!\b))/g, function(x) {
                            return x.toUpperCase()
                        })
                }
            }
            for (let belts = 0; belts <= input[0][0].length; belts++) {
                constructedString += `<div class = "mw-customtoggle-belt${belts}" style="text-align:center; width:auto; margin:1% 0 0 0; overflow:auto; border:solid purple; border-radius: 0.625em; background:lavender">
<strong><i>${beltName(belts, input)}</i></strong>
</div>
<div class = "mw-collapsible mw-collapsed" id = "mw-customcollapsible-belt${belts}" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin:0 0 0 1%; padding:0 1%; overflow:auto">
${shellBeltTables(input, belts)}
</div>
</div>\n`
            }
            return constructedString
        }
        const exportFile = `<div class = "mw-customtoggle-belts" style="font-size:1.2em; text-align:center; width:auto; overflow:auto; border:solid purple; border-radius: 0.625em; background:lavender">
<strong><i>Belts</i></strong>
</div>
<div class = "mw-collapsible" id = "mw-customcollapsible-belts" style = "width:99%; overflow:auto;">
<div class = "mw-collapsible-content" style = "border:solid lightgray; background:white; margin-left:1%; padding:0 1%; overflow:auto">
${multiBelt(input)}
</div>
</div>\n`
        return exportFile
    }

    function endDivs() {
        // Last two divs to close the entire template.
        return `</div>
</div>`
    } // And that's all folks. Thanks for sticking around. Tomorrow at noon is my next performance. See y'all there.
    return toGlob
})()
