import * as fs from 'fs-extra'
import * as path from 'path' //Needed for extname() search. Dont delete.
import * as async from 'async'
import * as fCrunch from './fileCrunching'

export var ModuleInit = (async function initialization() {
    var toGlob = {}
    console.log('Start of Initialization.')
    //console.log(fs.readFile('ui.html', 'utf8', (error, data) => {console.log(data)})) //literally magic. NEVER DELETE
    //Path to Weapons Files Here.
    const fileDirectory = './weapons',
        fileDestination = './parsedWeapons',
        extensionName = '.blkx',
        hitpowerFile = './hitpowerFile.csv'

    let dirPath = path.resolve(fileDirectory),
        destPath = path.resolve(fileDestination),
        hitPath = path.resolve(hitpowerFile)

    //Finds all files. Thanks Stackoverflow.
    const filesList = fs.readdirSync(dirPath).filter(e => {
        //Sync because important.
        return path.extname(e).toLowerCase() === extensionName
    })
    //Clears and Recreates Destination Folder.
    if (!fs.existsSync(destPath)) {
        console.log(`Creating Destination File Directory: ${destPath}`)
        fs.mkdirSync(destPath)
    } else {
        console.log(`Recreating Destination File Directory: ${destPath}`)
        fs.removeSync(destPath)
        fs.mkdirSync(destPath)
    }
    //Clearing Hitpower File.
    if (fs.existsSync(hitPath)) {
        console.log(`Deleting Previous Hitpower File: ${hitPath}`)
        fs.unlinkSync(hitPath)
    }

    //Parsing Files
    async.each(
        filesList,
        (fileName, callback) => {
            //Literally asyncronizing. Workers would be multithreading
            //Problem is, you really cant make a worker per file because that'll crash the browser.
            dirPath = path.resolve(fileDirectory + '/' + fileName)
            console.log(`Accessed: ${fileName}`)
            //let timer = Date.now()

            //Reading and Export pipes.
            const reading = fs.createReadStream(dirPath),
                destination = fs.createWriteStream(
                    `${destPath}/${path.basename(fileName, extensionName) +
                        '.json'}`
                )

            //What to do.
            let chunks = [''] //Forced to put in null string to keep typescript happy
            reading.on('data', chunk => {
                chunks.push(chunk)
            }) //Start.
            reading.on('end', async () => {
                //End.
                chunks.shift() //Removes null string
                let fileContent = await fCrunch.ModuleFCrunch.crunch(
                    parsingTime(chunks.join())
                )

                //Hitpower File Generation
                //Why do I put hitpower in initialization? Because Async messes shit up in main.

                //https://stackoverflow.com/questions/40292837/can-multiple-fs-write-to-append-to-the-same-file-guarantee-the-order-of-executio

                //Modifying Hitpower File
                const hitDestination = fs.createWriteStream(hitPath, {
                        flags: 'a'
                    }),
                    pulledHitNumbers = await getHitPower(fileContent)
                hitDestination.on('error', console.error)
                hitDestination.write(pulledHitNumbers)
                hitDestination.end()
            })

            async function getHitPower(fileContent: object) {
                let hitNumbers = ''
                for (const bullet of fileContent[3]) {
                    if (bullet.hitpower) {
                        try {
                            for (const indHit in bullet.hitpower) {
                                const stringHit = JSON.stringify(
                                    bullet.hitpower[indHit]
                                )
                                hitNumbers += `${stringHit}\n`
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                }
                return hitNumbers
            }

            //Parser Initializer
            function parsingTime(file: string) {
                let parsedFile = {}
                if (file.indexOf('{') == 0) {
                    parsedFile = parser(file, 1) //Pre Parsed. Thanks Gaijin.
                } else {
                    parsedFile = parser(file, 2) //Non Parsed
                }
                destination.write(JSON.stringify(parsedFile))
                return parsedFile
            }
            callback()
        },
        err => {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('Init: A file failed to process. ' + err)
            } else {
                console.log('File Creation Complete. Processing BLK files now.')
            }
        }
    )
    function parser(input: string, type: number) {
        let bCtr = 0,
            output
        switch (type) {
            case 1:
                output = JSON.parse(
                    input
                        //Renames bullets.
                        .replace(/\"bullet\"/g, () => {
                            return '"bullet' + bCtr++ + '"'
                        })
                )
                return output

            case 2:
                output = JSON.parse(
                    input
                        //Renames bullets.
                        .replace(/\"bullet\"/g, () => {
                            return '"bullet' + bCtr++ + '"'
                        })
                )
                //Removing First Level of Brackets.
                //Transforms JSON Array to Object.
                let processed = output.reduce((result, item) => {
                    var key = Object.keys(item)[0]
                    result[key] = item[key]
                    return result
                }, {})

                //Removing Second Level Brackets.
                //Goes through every property of JSON {}
                //{Scanning Here}
                for (const key in processed) {
                    //Goes through every property within each {} property inside the JSON {}
                    //{ {Scanning Here} }
                    for (const iterator of Object.keys(key)) {
                        //Checks if Second Level Properties have Third Level Objects
                        //{ { {Exists?} } }
                        if (processed[key][iterator]) {
                            //Pulls Third Level to replace Second Level
                            for (const iterator1 of Object.keys(
                                processed[key][iterator]
                            )) {
                                //From { { {Property} } } to { {Property} }
                                processed[key][iterator] =
                                    processed[key][iterator][iterator1]
                            }
                        }
                    }
                }
                return processed
        }
    }
    return toGlob
})()
