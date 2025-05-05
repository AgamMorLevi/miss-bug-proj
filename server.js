import express from 'express' 
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js' 
import { userService } from './services/user.service.js'


const app = express() 

//Express config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) 


//express routing
//bug list
app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

   bugService.query(queryOptions)
   .then(bugs => res.send(bugs))
   .catch(err => {
    loggerService.error('Cannot get bugs', err)
    res.status(400).send('Cannot load bugs')
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}

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
id
    const bugToSave = req.body

    bugService.save(bugToSave)
    .then(savedBug => {res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot update bug', err)
        res.status(400).send('Cannot update bug')
    })
})



//get by  + visit count
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

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

//User Api
app.get('/api/auth', (req, res) => {
    userService.query()
    .then(users => res.send(users))
    .catch(err => {
        loggerService.error('Cannot get users', err)
        res.status(400).send('Cannot load users')
    })
    
})

//GET - get user by id
app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot load user')
        })
})

///TODO: api/auth/signup – add a new user to the file 
//POST - add new user
app.post('api/auth/signup', (req, res) => {
    const userToSave = req.body 
    
    userService.save(userToSave)
    .then(savedUser => res.send(savedUser))
        .catch(err => {
            loggerService.error('Cannot add user', err)
            res.status(400).send('Cannot add user')
        })
    })
    
    
    // TODO: /api/auth/login – check if username and password are correct - generate a 
    // loginToken and return a mini-user to the frontend 
    // ▪ When bug is added – get the creator from the loginToken 
    // ▪ Only the bug's creator can DELETE/UPDATE a bug 
    // Update only updatable fields 
    
    // o /api/auth/logout – clear the cookie 
