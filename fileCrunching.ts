import * as async from 'async'

//Isolated from Main.ts due to Initialization.ts requiring its services.
export var ModuleFCrunch = (function main() {
    let toGlob = {
        crunch(fileContent: {}) {
            return new Promise(resolve => {
                let ammoBelts = [''],
                    defaultBullets = [{}],
                    allBullets = [{}],
                    prevFound = 0,
                    spadedBullets = [[{}]],
                    nextBelt = 0,
                    newGun = {}
                async.eachOf(
                    fileContent,
                    (item, key, callback) => {
                        if (Array.isArray(item) || typeof item === 'object') {
                            //New Gun Information
                            if (key.toString().includes('new_gun')) {
                                newGun = item
                            } else {
                                //Bullet Information
                                for (
                                    let i = prevFound;
                                    i < Object.keys(fileContent).length;
                                    i++
                                ) {
                                    if (key === `bullet${i}`) {
                                        //Default
                                        defaultBullets.push(item)
                                        allBullets.push(item)
                                        prevFound = i
                                        break
                                    } else if (item[0] && item[0]['mass']) {
                                        //AmmoBelts
                                        ammoBelts.push(key.toString())
                                        for (
                                            let i = 0;
                                            i < Object.keys(item).length;
                                            i++
                                        ) {
                                            //because for of loops didnt work
                                            if (item[i]['mass']) {
                                                allBullets.push(item[i])
                                                spadedBullets[nextBelt].push(
                                                    item[i]
                                                )
                                            }
                                        }
                                        spadedBullets.push([{}])
                                        nextBelt++
                                        break
                                        //Ammobelts w/ 1 shell type.
                                    } else if (
                                        !key.toString().includes('bullet') &&
                                        item['mass']
                                    ) {
                                        ammoBelts.push(key.toString())
                                        break
                                    }
                                }
                            }
                        }
                        callback()
                    },
                    err => {
                        if (err) {
                            console.log(
                                'Main: A file failed to process. ' + err
                            )
                        }
                    }
                )

                //Removing initial null values.
                ammoBelts.shift()
                defaultBullets.shift()
                allBullets.shift()
                spadedBullets.pop()
                for (const iterator of spadedBullets) {
                    iterator.shift()
                }

                //Removing Duplicate Bullets in allBullets.
                allBullets = uniqBy(allBullets, JSON.stringify)
                resolve([
                    ammoBelts,
                    defaultBullets,
                    spadedBullets,
                    allBullets,
                    newGun
                ])
            })
        }
    }
    //Straight from StackOverflow. Me Lazy XD. And it works so... ehhhhhhh.
    function uniqBy(a, key) {
        var seen = {}
        return a.filter(function(item) {
            var k = key(item)
            return seen.hasOwnProperty(k) ? false : (seen[k] = true)
        })
    }
    return toGlob //Returning Global Variables.
})()
