import * as fs from 'fs-extra'
import * as papaparse from 'papaparse'

export var ModuleIndex = (function index() {
    let toGlob = {
        index : ['']
    }
    let fileLocation = './index.csv'
    let fileContent = papaparse.parse(fs.readFileSync(fileLocation, 'utf8')).data
    for (const key in fileContent) {
        toGlob.index.push(fileContent[key][0]) //Should be a X by 1 Spreadsheet.
    }
    toGlob.index.shift()
    return toGlob
}())