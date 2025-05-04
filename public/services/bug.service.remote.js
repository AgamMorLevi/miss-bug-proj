import { jsPDF } from 'jspdf'           

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadPDF

}

function query(filterBy) {
    return axios.get(BASE_URL)
    .then (res => res.data)
    .then(bugs => {

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugs = bugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        return bugs
    })
}

function getById(bugId) {
    return axios.get( BASE_URL + bugId)
    .then(res => res.data)  
}

function remove(bugId) {

    return axios.delete(BASE_URL + bugId)
    .then(res => res.data)
}

function save(bug) {

    if (bug._id) {
        return axios.put(BASE_URL + bug._id , bug)
        .then(res => res.data)
        .catch(err => {
            console.log('Error updating bug:', err)
            throw err
        })

    } else {
        return axios.post(BASE_URL, bug)
        .then(res => res.data)
        .catch(err => {
            console.log('Error creating bug:', err)
            throw err
        })
        
    }
}


function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function downloadPDF() {
    const doc = new jsPDF()

    doc.text('Bug List', 10, 10)
    doc.text('Example bug content...', 10, 20)

    doc.save('bugs.pdf')
}