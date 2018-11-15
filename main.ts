import * as fs from 'fs-extra'
import * as async from 'async'
import * as exporting from './export'
import * as fCrunch from './fileCrunching'
//import * as fileCleaning from './initialization'

//If I could do this all over again, I would not write this program in JS.

//http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html told me to do it.
export var ModuleMain = (function main() {
    let toGlob = {}
    console.log('Start of Main.')
    exporting.ModuleExp.allMethod(true) //Cleans Output Folder
    let filesList = fs.readdirSync('./parsedWeapons')
    async.each(
        filesList,
        async (filePath, callback) => {
            //Starting File Read Stream. Paused.
            let information = await readFile(filePath)
            /*
            Information Array Layout:
            0)
                0. Name of Spaded Ammo Belts
                1. Bullets contained in Stock/Default Ammo Belt.
                2. Bullets contained in Spaded Ammo Belts. Going by order in 1.
                3. All Unique Bullets
                4. New Gun/Stock Gun Information.
            1) 
                Actual File in Object Form.
            2)
                Filename.
        */
            console.log(`${filePath} parsed.`)
            //Export Time!
            exporting.ModuleExp.allMethod(information)
            callback()
        },
        err => {
            if (err) {
                console.log('Main ERROR: ' + err)
            } else {
                console.log('Main Successful.')
            }
        }
    )
    function readFile(filePath: string) {
        return new Promise((resolve, reject) => {
            let reading = fs.createReadStream(`./parsedWeapons/${filePath}`, {
                flags: 'r+'
            })

            //What to do.
            let chunks = [''] //Forced to put in null string to keep typescript happy
            reading.on('data', chunk => {
                chunks.push(chunk)
            }) //Start.
            reading.on('end', async () => {
                //End.
                chunks.shift() //Removes null string
                if (chunks) {
                    resolve([
                        await fCrunch.ModuleFCrunch.crunch(
                            JSON.parse(chunks.join())
                        ),
                        JSON.parse(chunks.join()), //Actually is used in export.
                        filePath
                    ])
                } else {
                    reject('ERROR')
                }
            })
        })
    }
    return toGlob //Returning Global Variables.
})()
