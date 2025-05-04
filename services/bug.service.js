import fs from 'fs'

import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'


const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save

}


function query(filterBy={}) {
    var filteredBugs = bugs
    
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)  
        }
 
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    // pdfService.buildBugsPDF(bugs) //pdf bonus
    if (!bug) return Promise.reject('Bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = { ...bugs[idx], ...bug }
    } else {
        bug = {
            title: bug.title,
            severity: bug.severity,
            description: bug.description,
            createdAt: Date.now(),
            _id: utilService.makeId()
        }
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            console.log('The file was saved!')
            resolve()
        })
    })
}

