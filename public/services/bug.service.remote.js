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
    const url = BASE_URL + bugId +'/remove'
    return axios.get(url)
}

function save(bug) {
    var queryparse = `title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
    const url = BASE_URL + 'save?' + queryparse
    if (bug._id)  queryparse += `&_id=${bug._id}`
    return axios.get(url)
    .then(res => res.data)

}


function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}


function downloadPDF() {
    fetch('/api/bug/pdf')  
        .then(response => response.blob())  
        .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url;
            link.download = 'bugs.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
        .catch(err => console.error('Error downloading PDF:', err))
  }