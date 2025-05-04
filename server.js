import express from 'express' 
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js' 
import { pdfService } from './services/pdf.service.js'

const app = express() 

//Express config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) // for parsing json


//express routing
//bug list
app.get('/api/bug', (req, res) => {
    const  filterBy = {
        txt: req.query.txt 
    }
   bugService.query(filterBy)
   .then(bugs => res.send(bugs))
   .catch(err => {
    loggerService.error('Cannot get bugs', err)
    res.status(400).send('Cannot load bugs')
})

}) 

//POST - add new bug
app.post('/api/bug', (req, res) => {

    const bugToSave = req.body 

    bugService.save(bugToSave)
    .then(savedBug => {res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot add bug', err)
        res.status(400).send('Cannot add bug')
    })
})


//PUT - update bug
app.put('/api/bug/:bugId', (req, res) => {

    const bugToSave = req.body

    bugService.save(bugToSave)
    .then(savedBug => {res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot update bug', err)
        res.status(400).send('Cannot update bug')
    })
})



//get by id + visit count
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap =[] } = req.cookies

    if (visitCountMap.length >= 3) return res.status(400).send('Wait for 10 sec') //the msg will show at the network
    if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)   

    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 }) // after 10 sec it will remove from the browser

 //get by id 
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot load bug')
        })

}) 

//remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(bugId + ' bug Removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })


}) 

// //TODO:Make the option for PDF
// app.get('/api/bug/pdf', (req, res) => {
//     bugService.query() // Query the bugs from the database or file
//         .then(bugs => {
//             pdfService.buildBugsPDF(bugs, res); // Generate and send PDF to client
//         })
//         .catch(err => {
//             loggerService.error('Cannot generate PDF', err)
//             res.status(500).send('Cannot create PDF')
//         })
// })

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)


//BONUS:logger request

