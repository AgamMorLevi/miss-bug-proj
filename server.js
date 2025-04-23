import express from 'express' 
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js' 

const app = express() 

app.use(express.static('public'))
app.use(cookieParser())

// Basic - Routing in express
app.get('/', (req, res) => res.send('Hello Muki'))
app.get('/puki', (req, res) => {
    var visitCount = req.cookies.visitCount || 0
    visitCount++
    res.cookie('visitCount', visitCount, { maxAge: 1000 * 5 }) // after 5 sec it will remove from the browser
    res.send('Hello Puki')
})
app.get('/nono', (req, res) => res.redirect('/'))



//Provide an API for Bugs CRUDL: Implement one by one along with a bugService

//TODO: List of bugs
//* Read
app.get('/api/bug', (req, res) => {
   bugService.query()
   .then(bugs => res.send(bugs))
   .catch(err => {
    loggerService.error('Cannot get bugs', err)
    res.status(500).send('Cannot load bugs')
})

}) 

//TODO: Set Defult value
//Save
app.get('/api/bug/save', (req, res) => {

    loggerService.debug('req.query', req.query)

    const { title, description, severity, _id } = req.query
    console.log('req.query', req.query)
    const bug = {
        _id,
        title,
        description,
        severity: +severity,
    }

    bugService.save(bug).then((savedBug) => {
        res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot save bug', err)
        res.status(400).send('Cannot save bug')
    })
})

//TODO:erfactor Err
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })

}) 

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('bug Removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })


}) 

//TODO:Make the option for PDF

const port = 3030

app.get('/', (req, res) => res.send('Hello there')) 
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)


//BONUS:logger request
