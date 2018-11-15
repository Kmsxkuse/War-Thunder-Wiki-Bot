import * as fs from 'fs-extra'
import * as path from 'path'
import * as ss from 'simple-statistics'

export var ModuleHit = (function hitPwr() {
    let toGlob = {}
    const hitpowerFile = path.resolve('./hitpowerFile.csv'),
        reading = fs.createReadStream(hitpowerFile),
        destinationFile = path.resolve('./hitpowerStats.json')
    console.log(`Accessed: ${hitpowerFile}`)

    let chunks = ['']
    reading.on('data', chunk => {
        chunks.push(chunk)
    })
    reading.on('end', () => {
        //Converting hitpower.csv to array
        chunks.shift() //Removes null string
        let fileContent = chunks.join().split('['),
            bulletPoints = [['']]
        for (const point in fileContent) {
            if (fileContent[point] !== '') {
                fileContent[point] = fileContent[point].replace(']\n', '')
                bulletPoints.push(fileContent[point].split(','))
            }
        }
        bulletPoints.shift()

        //Finding unique distances in hitpower
        let uX = [0]
        for (const points of bulletPoints) {
            uX.push(parseInt(points[1]))
        }
        uX.shift()
        uX = uniqBy(uX, JSON.stringify)

        //Combining Y values by X
        //Creating array of length uX starting at default 0.
        let uC = [...Array(uX.length)].map((u, i) => {
            return [[uX[i]], [0]] //All are number[] to make typescript happy
        })
        for (const points of bulletPoints) {
            const xLoc = uX.indexOf(parseInt(points[1]))
            uC[xLoc][1].push(parseFloat(points[0]))
        }
        for (const placeholders in uC) {
            uC[placeholders][1].shift()
        }
        //Removing lesser used points in uC and sorting them descending
        uC = uC
            .filter(coordinates => coordinates[1].length >= 50)
            .sort((a, b) => {
                return a[0][0] - b[0][0]
            })

        //Statistics Array
        /*
            0. X value
            1. Mean Y value
            2. sampleStandardDeviation of Ys
        */
        let stats = [...Array(uC.length)].map((u, i) => {
            return [uC[i][0][0], 0, 0]
        })
        for (const arr in uC) {
            stats[arr][1] = ss.mean(uC[arr][1])
            stats[arr][2] = ss.sampleStandardDeviation(uC[arr][1])
        }
        const writing = fs.createWriteStream(destinationFile)
        writing.on('error', console.error)
        writing.write(JSON.stringify(stats))
        writing.end()
    })
    function uniqBy(a, key) {
        var seen = {}
        return a.filter(function(item) {
            var k = key(item)
            return seen.hasOwnProperty(k) ? false : (seen[k] = true)
        })
    }
    return toGlob
})()
